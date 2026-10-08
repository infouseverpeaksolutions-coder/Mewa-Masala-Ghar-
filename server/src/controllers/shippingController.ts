import { Request, Response } from 'express';
import prisma from '../config/db';
import { ENV } from '../config/env';
import { shiprocketService } from '../services/shiprocketService';
import { ShiprocketShippingProvider, isValidTransition } from '../services/shippingService';
import { sendEmail } from '../config/email';
import { OrderStatus, ShipmentStatus, TrackingStatus } from '@prisma/client';

/**
 * 1. GET /api/shipping/serviceability
 * Check delivery route, rates and ETA via Shiprocket
 */
export const checkServiceability = async (req: Request, res: Response) => {
  try {
    const deliveryPostcode = String(req.query.delivery_postcode || req.query.pincode || req.body?.pincode || '').trim();
    const pickupPostcode = String(req.query.pickup_postcode || req.body?.pickup_postcode || ENV.SHIPROCKET_DEFAULT_PINCODE || '344022').trim();
    const weight = Number(req.query.weight || req.body?.weight || 0.5);
    const cod = req.query.cod === '1' || req.body?.cod === 1 ? 1 : 0;

    if (!deliveryPostcode || !/^\d{6}$/.test(deliveryPostcode)) {
      return res.status(400).json({
        success: false,
        message: 'Valid 6-digit destination pincode is required',
      });
    }

    const serviceability = await shiprocketService.checkServiceability({
      pickup_postcode: pickupPostcode,
      delivery_postcode: deliveryPostcode,
      weight,
      cod,
    });

    return res.json({ success: true, data: serviceability });
  } catch (error: any) {
    console.error('[ShiprocketController] checkServiceability error:', error.message || error);
    return res.status(500).json({ success: false, message: error.message || 'Serviceability check failed' });
  }
};

/**
 * 2. POST /api/shipping/orders/:orderId/ship
 * Create adhoc order in Shiprocket and auto-assign AWB
 */
export const shipOrderWithShiprocket = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId || req.params.id;
    const { courierId, pickupLocation, lengthCm, widthCm, heightCm, adminComment } = req.body;
    const adminEmail = (req as any).user?.email || 'admin@mewamasalaghar.com';

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        items: {
          include: {
            product: { include: { category: true } },
            variant: true,
          },
        },
        shipments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!isValidTransition(order.status, OrderStatus.SHIPPED) && order.status !== OrderStatus.PACKED) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition order from status ${order.status} to SHIPPED`,
      });
    }

    const provider = new ShiprocketShippingProvider();
    const shipmentResult = await provider.createShipment({
      ...order,
      courierId,
      pickupLocation,
      length: lengthCm,
      width: widthCm,
      height: heightCm,
    });

    const updatedOrder = await prisma.$transaction(async (tx) => {
      let shipment = order.shipments[0];
      if (shipment) {
        shipment = await tx.shipment.update({
          where: { id: shipment.id },
          data: {
            courier: shipmentResult.courier,
            awbNo: shipmentResult.awbNo,
            trackingUrl: shipmentResult.trackingUrl,
            expectedDelivery: shipmentResult.expectedDelivery,
            status: ShipmentStatus.IN_TRANSIT,
          },
        });
      } else {
        shipment = await tx.shipment.create({
          data: {
            orderId: order.id,
            courier: shipmentResult.courier,
            awbNo: shipmentResult.awbNo,
            trackingUrl: shipmentResult.trackingUrl,
            expectedDelivery: shipmentResult.expectedDelivery,
            status: ShipmentStatus.IN_TRANSIT,
          },
        });
      }

      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.SHIPPED,
          trackingNumber: shipmentResult.awbNo,
          courierName: shipmentResult.courier,
        },
        include: { shipments: true, trackingEvents: true },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: OrderStatus.SHIPPED,
          comment: adminComment || `Dispatched via Shiprocket (${shipmentResult.courier}). AWB: ${shipmentResult.awbNo}`,
          createdBy: adminEmail,
        },
      });

      await tx.trackingEvent.create({
        data: {
          orderId: order.id,
          shipmentId: shipment.id,
          status: TrackingStatus.SHIPPED,
          title: 'Order Shipped via Shiprocket',
          description: `Dispatched with AWB ${shipmentResult.awbNo}. Courier: ${shipmentResult.courier}`,
          location: 'Warehouse Balotra',
          eventTime: new Date(),
          createdBy: adminEmail,
        },
      });

      return ord;
    });

    // Notify customer
    const emailTo = order.customerEmail || (order as any).guestEmail;
    if (emailTo) {
      sendEmail({
        to: emailTo,
        subject: `Your Mewa Masala Ghar Order ${order.orderNumber} Has Been Shipped!`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #FAF6EC; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-top: 4px solid #2F5D3A; border-radius: 8px; padding: 24px;">
              <h2 style="color: #2F5D3A;">Your order is on the way!</h2>
              <p>Hi ${order.customerName},</p>
              <p>Your order <strong>${order.orderNumber}</strong> has been shipped via Shiprocket.</p>
              <div style="background: #F4EAD4; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Courier:</strong> ${shipmentResult.courier}</p>
                <p style="margin: 4px 0;"><strong>AWB Tracking No:</strong> ${shipmentResult.awbNo}</p>
                <p style="margin: 4px 0;"><strong>Estimated Delivery:</strong> ${shipmentResult.expectedDelivery?.toLocaleDateString('en-IN')}</p>
              </div>
              <p><a href="${shipmentResult.trackingUrl}" style="background: #2F5D3A; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Track Shipment Live</a></p>
            </div>
          </div>
        `,
      }).catch(console.error);
    }

    return res.json({
      success: true,
      message: 'Shipment created and dispatched via Shiprocket',
      shipment: shipmentResult,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('[ShiprocketController] shipOrder error:', error.message || error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to dispatch via Shiprocket' });
  }
};

/**
 * 3. POST /api/shipping/courier/assign/awb
 * Assign AWB explicitly to a shipment ID
 */
export const assignAwb = async (req: Request, res: Response) => {
  try {
    const { shipment_id, courier_id } = req.body;
    if (!shipment_id) {
      return res.status(400).json({ success: false, message: 'shipment_id is required' });
    }

    const data = await shiprocketService.assignAwb(Number(shipment_id), courier_id ? Number(courier_id) : undefined);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to assign AWB' });
  }
};

/**
 * 4. POST /api/shipping/courier/generate/pickup
 * Request courier pickup
 */
export const generatePickup = async (req: Request, res: Response) => {
  try {
    const { shipment_id } = req.body;
    if (!shipment_id) {
      return res.status(400).json({ success: false, message: 'shipment_id is required' });
    }

    const data = await shiprocketService.generatePickup(shipment_id);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to schedule pickup' });
  }
};

/**
 * 5. POST /api/shipping/courier/generate/label
 * Generate printable shipping label URL
 */
export const generateLabel = async (req: Request, res: Response) => {
  try {
    const { shipment_id } = req.body;
    if (!shipment_id) {
      return res.status(400).json({ success: false, message: 'shipment_id is required' });
    }

    const ids = Array.isArray(shipment_id) ? shipment_id.map(Number) : [Number(shipment_id)];
    const data = await shiprocketService.generateLabel(ids);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to generate label' });
  }
};

/**
 * 6. POST /api/shipping/manifests/generate & print
 */
export const generateManifest = async (req: Request, res: Response) => {
  try {
    const { shipment_id } = req.body;
    const ids = Array.isArray(shipment_id) ? shipment_id.map(Number) : [Number(shipment_id)];
    const data = await shiprocketService.generateManifest(ids);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to generate manifest' });
  }
};

export const printManifest = async (req: Request, res: Response) => {
  try {
    const { order_ids } = req.body;
    const ids = Array.isArray(order_ids) ? order_ids.map(Number) : [Number(order_ids)];
    const data = await shiprocketService.printManifest(ids);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to print manifest' });
  }
};

/**
 * 7. POST /api/shipping/orders/print/invoice
 */
export const printInvoice = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const orderIds = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    const data = await shiprocketService.printInvoice(orderIds);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to print invoice' });
  }
};

/**
 * 8. GET /api/shipping/track/:awbCode
 * Real-time milestone scan tracking from Shiprocket
 */
export const trackShipment = async (req: Request, res: Response) => {
  try {
    const awbCode = String(req.params.awbCode || req.query.awb || '').trim();
    if (!awbCode) {
      return res.status(400).json({ success: false, message: 'AWB code is required' });
    }

    const trackingRes = await shiprocketService.trackByAwb(awbCode);

    // Synchronize milestones to database tracking events if matching shipment exists
    const activities = trackingRes?.tracking_data?.shipment_track_activities;
    if (activities && Array.isArray(activities) && activities.length > 0) {
      const dbShipment = await prisma.shipment.findFirst({
        where: { awbNo: awbCode },
      });

      if (dbShipment) {
        for (const act of activities) {
          const actDate = new Date(act.date);
          const existing = await prisma.trackingEvent.findFirst({
            where: {
              shipmentId: dbShipment.id,
              title: act.activity || act.status,
              location: act.location,
            },
          });

          if (!existing) {
            let statusEnum: TrackingStatus = TrackingStatus.SHIPPED;
            const statusUpper = (act.status || '').toUpperCase();
            if (statusUpper.includes('DELIVERED')) statusEnum = TrackingStatus.DELIVERED;
            else if (statusUpper.includes('OUT FOR DELIVERY')) statusEnum = TrackingStatus.OUT_FOR_DELIVERY;
            else if (statusUpper.includes('RTO') || statusUpper.includes('RETURN')) statusEnum = TrackingStatus.RETURNED;
            else if (statusUpper.includes('CANCEL')) statusEnum = TrackingStatus.CANCELLED;

            await prisma.trackingEvent.create({
              data: {
                orderId: dbShipment.orderId,
                shipmentId: dbShipment.id,
                status: statusEnum,
                title: act.activity || act.status,
                description: `Shipment update: ${act.activity || act.status}`,
                location: act.location || '',
                eventTime: isNaN(actDate.getTime()) ? new Date() : actDate,
                createdBy: 'Shiprocket Live Tracker',
              },
            });
          }
        }
      }
    }

    return res.json({ success: true, tracking: trackingRes });
  } catch (error: any) {
    console.error('[ShiprocketController] trackShipment error:', error.message || error);
    return res.status(500).json({ success: false, message: error.message || 'Tracking failed' });
  }
};
