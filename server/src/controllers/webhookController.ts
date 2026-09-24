import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/db';
import { ENV } from '../config/env';
import { sendEmail } from '../config/email';
import { isValidTransition, COURIER_STATUS_MAP } from '../services/shippingService';
import { OrderStatus, PaymentStatus, ShipmentStatus, TrackingStatus } from '@prisma/client';

export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        
        // Use rawBody if available, otherwise fallback to stringified body
        const payload = (req as any).rawBody || JSON.stringify(req.body);
        const secret = ENV.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid Razorpay signature');
            return res.status(400).send('Invalid signature');
        }

        const { event, payload: eventPayload } = req.body;

        if (event === 'payment.captured' || event === 'order.paid') {
            const paymentEntity = eventPayload.payment?.entity || eventPayload.order?.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const razorpayPaymentId = paymentEntity.id;

            let order = await prisma.order.findFirst({
                where: {
                    OR: [
                        { razorpayOrderId: razorpayOrderId } as any,
                        { payments: { some: { razorpayOrderId: razorpayOrderId } } }
                    ]
                },
                include: { items: true, payments: true }
            });

            if (!order) {
                return res.status(200).send('Order not found');
            }

            if (order.paymentStatus === PaymentStatus.PAID) {
                return res.status(200).send('OK');
            }

            const newStatus = order.status === OrderStatus.PENDING ? OrderStatus.PLACED : order.status;

            await prisma.$transaction(async (tx) => {
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: PaymentStatus.PAID,
                        status: newStatus
                    }
                });

                const existingPayment = order.payments.find(p => p.razorpayOrderId === razorpayOrderId);
                if (existingPayment) {
                    await tx.payment.update({
                        where: { id: existingPayment.id },
                        data: { status: PaymentStatus.PAID, razorpayPaymentId }
                    });
                } else {
                    await tx.payment.create({
                        data: {
                            orderId: order.id,
                            method: 'RAZORPAY',
                            status: PaymentStatus.PAID,
                            amount: paymentEntity.amount / 100,
                            transactionId: razorpayPaymentId,
                            razorpayOrderId,
                            razorpayPaymentId
                        }
                    });
                }

                if (newStatus === OrderStatus.PLACED && order.status !== OrderStatus.PLACED) {
                    await tx.orderStatusHistory.create({
                        data: {
                            orderId: order.id,
                            status: OrderStatus.PLACED,
                            comment: 'Payment successful, order placed',
                            createdBy: 'System'
                        }
                    });

                    await tx.trackingEvent.create({
                        data: {
                            orderId: order.id,
                            status: TrackingStatus.PLACED,
                            title: 'Order Placed',
                            description: 'Your order has been successfully placed.',
                            eventTime: new Date(),
                            createdBy: 'System'
                        }
                    });
                }
            });

            await sendEmail({
                to: order.customerEmail,
                subject: 'Order Confirmation - Mewa Masala Ghar',
                html: `<div style="background-color: #FAF6EC; padding: 20px;">
                    <h1 style="color: #2F5D3A;">Order Confirmed</h1>
                    <p style="color: #D9A441;">Thank you for your order!</p>
                    <p>Order Number: ${order.orderNumber}</p>
                </div>`
            });

        } else if (event === 'payment.failed') {
            const paymentEntity = eventPayload.payment.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const razorpayPaymentId = paymentEntity.id;

            let order = await prisma.order.findFirst({
                where: {
                    OR: [
                        { razorpayOrderId: razorpayOrderId } as any,
                        { payments: { some: { razorpayOrderId: razorpayOrderId } } }
                    ]
                },
                include: { items: true, payments: true }
            });

            if (!order) {
                return res.status(200).send('OK');
            }

            if (order.paymentStatus === PaymentStatus.FAILED) {
                return res.status(200).send('OK');
            }

            await prisma.$transaction(async (tx) => {
                await tx.order.update({
                    where: { id: order.id },
                    data: { paymentStatus: PaymentStatus.FAILED }
                });

                for (const item of order.items) {
                    if ((item as any).variantId) {
                        await tx.productVariant.update({
                            where: { id: (item as any).variantId },
                            data: { stockQty: { increment: item.quantity } }
                        });
                    }
                }

                if ((order as any).couponId) {
                    await tx.coupon.update({
                        where: { id: (order as any).couponId },
                        data: { usageCount: { decrement: 1 } }
                    });
                }

                const existingPayment = order.payments.find(p => p.razorpayOrderId === razorpayOrderId);
                if (existingPayment) {
                    await tx.payment.update({
                        where: { id: existingPayment.id },
                        data: { status: PaymentStatus.FAILED, razorpayPaymentId }
                    });
                } else {
                    await tx.payment.create({
                        data: {
                            orderId: order.id,
                            method: 'RAZORPAY',
                            status: PaymentStatus.FAILED,
                            amount: paymentEntity.amount / 100,
                            transactionId: razorpayPaymentId,
                            razorpayOrderId,
                            razorpayPaymentId
                        }
                    });
                }
            });
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Razorpay Webhook Error:', error);
        return res.status(200).send('Webhook Error');
    }
};

export const shippingWebhook = async (req: Request, res: Response) => {
    try {
        const { awb_no, status, location, description, event_time } = req.body;

        const shipment = await prisma.shipment.findFirst({
            where: { awbNo: awb_no },
            include: { order: true }
        });

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        const mappedStatus = (COURIER_STATUS_MAP as any)[status] || ShipmentStatus.IN_TRANSIT;

        await prisma.$transaction(async (tx) => {
            await tx.shipment.update({
                where: { id: shipment.id },
                data: { status: mappedStatus }
            });

            let trackingStatus: TrackingStatus = TrackingStatus.SHIPPED;
            if (mappedStatus === ShipmentStatus.OUT_FOR_DELIVERY) trackingStatus = TrackingStatus.OUT_FOR_DELIVERY;
            if (mappedStatus === ShipmentStatus.DELIVERED) trackingStatus = TrackingStatus.DELIVERED;
            if (mappedStatus === ShipmentStatus.RETURNED) trackingStatus = TrackingStatus.RETURNED;
            if (mappedStatus === ShipmentStatus.CANCELLED) trackingStatus = TrackingStatus.CANCELLED;

            await tx.trackingEvent.create({
                data: {
                    orderId: shipment.orderId,
                    shipmentId: shipment.id,
                    status: trackingStatus,
                    title: `Shipment ${status}`,
                    description: description || `Shipment is ${status}`,
                    location: location || '',
                    eventTime: event_time ? new Date(event_time) : new Date(),
                    createdBy: 'Courier Webhook'
                }
            });

            let newOrderStatus: OrderStatus | null = null;
            if (mappedStatus === ShipmentStatus.OUT_FOR_DELIVERY) newOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
            else if (mappedStatus === ShipmentStatus.DELIVERED) newOrderStatus = OrderStatus.DELIVERED;
            else if (mappedStatus === ShipmentStatus.RETURNED) newOrderStatus = OrderStatus.RETURNED;

            if (newOrderStatus && isValidTransition(shipment.order.status, newOrderStatus)) {
                await tx.order.update({
                    where: { id: shipment.orderId },
                    data: { status: newOrderStatus }
                });

                await tx.orderStatusHistory.create({
                    data: {
                        orderId: shipment.orderId,
                        status: newOrderStatus,
                        comment: `Status updated via courier webhook to ${newOrderStatus}`,
                        createdBy: 'Courier Webhook'
                    }
                });
            }
        });

        await sendEmail({
            to: shipment.order.customerEmail,
            subject: `Order Update - ${status}`,
            html: `<div style="background-color: #FAF6EC; padding: 20px;">
                <h1 style="color: #2F5D3A;">Order Status Update</h1>
                <p style="color: #D9A441;">Your order is now: ${status}</p>
                <p>Location: ${location || 'N/A'}</p>
                <p>${description || ''}</p>
            </div>`
        });

        return res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Shipping Webhook Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const courier = req.body.courier || req.body.courierName;
        const awbNo = req.body.awbNo || req.body.trackingNumber;
        const { status, comment, trackingUrl, expectedDelivery } = req.body;
        const adminEmail = (req as any).user?.email || 'admin@mewamasalaghar.com';

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { shipments: true }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!isValidTransition(order.status, status)) {
            return res.status(400).json({ success: false, message: 'Invalid status transition' });
        }

        if (status === OrderStatus.SHIPPED && (!courier || !awbNo)) {
            return res.status(400).json({ success: false, message: 'Courier and AWB No are required for SHIPPED status' });
        }

        const updatedOrder = await prisma.$transaction(async (tx) => {
            if (status === OrderStatus.SHIPPED) {
                const existingShipment = order.shipments[0];
                if (existingShipment) {
                    await tx.shipment.update({
                        where: { id: existingShipment.id },
                        data: {
                            courier,
                            awbNo,
                            trackingUrl,
                            expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : existingShipment.expectedDelivery,
                            status: ShipmentStatus.IN_TRANSIT
                        }
                    });
                } else {
                    await tx.shipment.create({
                        data: {
                            orderId: order.id,
                            courier,
                            awbNo,
                            trackingUrl,
                            expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : undefined,
                            status: ShipmentStatus.IN_TRANSIT
                        }
                    });
                }
            }

            const newOrder = await tx.order.update({
                where: { id: order.id },
                data: { status },
                include: { statusHistory: true, trackingEvents: true, shipments: true }
            });

            await tx.orderStatusHistory.create({
                data: {
                    orderId: order.id,
                    status,
                    comment: comment || `Order status updated to ${status}`,
                    createdBy: adminEmail
                }
            });

            await tx.trackingEvent.create({
                data: {
                    orderId: order.id,
                    status: status as unknown as TrackingStatus,
                    title: `Order ${status}`,
                    description: comment || `Your order has been ${status.toLowerCase()}`,
                    eventTime: new Date(),
                    createdBy: adminEmail
                }
            });

            return newOrder;
        });

        let emailTitle = '';
        switch (status) {
            case OrderStatus.CONFIRMED: emailTitle = 'Your order has been confirmed'; break;
            case OrderStatus.PACKED: emailTitle = 'Your order has been packed'; break;
            case OrderStatus.SHIPPED: emailTitle = 'Your order has been shipped'; break;
            case OrderStatus.OUT_FOR_DELIVERY: emailTitle = 'Your order is out for delivery'; break;
            case OrderStatus.DELIVERED: emailTitle = 'Your order has been delivered'; break;
            case OrderStatus.CANCELLED: emailTitle = 'Your order has been cancelled'; break;
            default: emailTitle = `Your order status is now ${status}`;
        }

        let shippingInfo = '';
        if (status === OrderStatus.SHIPPED) {
            shippingInfo = `
                <p>Courier: ${courier}</p>
                <p>AWB Number: ${awbNo}</p>
                ${trackingUrl ? `<p>Track your order: <a href="${trackingUrl}">${trackingUrl}</a></p>` : ''}
            `;
        }

        await sendEmail({
            to: order.customerEmail,
            subject: `Order Update - Mewa Masala Ghar`,
            html: `<div style="background-color: #FAF6EC; padding: 20px;">
                <h1 style="color: #2F5D3A;">${emailTitle}</h1>
                <p style="color: #D9A441;">Order Number: ${order.orderNumber}</p>
                ${shippingInfo}
                <p>${comment ? `Note: ${comment}` : ''}</p>
            </div>`
        });

        return res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Admin Update Order Status Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const adminGetOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const { status, paymentStatus, paymentMethod, search } = req.query;

        let where: any = {};
        if (status) where.status = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;
        
        if (paymentMethod) {
            where.payments = { some: { method: paymentMethod } };
        }

        if (search) {
            where.OR = [
                { orderNumber: { contains: search as string, mode: 'insensitive' } },
                { customerName: { contains: search as string, mode: 'insensitive' } },
                { customerEmail: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { items: true } },
                    statusHistory: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                }
            }),
            prisma.order.count({ where })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                orders,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin Get Orders Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const adminGetOrderDetail = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                },
                payments: true,
                shipments: {
                    include: {
                        trackingEvents: {
                            orderBy: { eventTime: 'desc' }
                        }
                    }
                },
                trackingEvents: {
                    orderBy: { eventTime: 'desc' }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Admin Get Order Detail Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
