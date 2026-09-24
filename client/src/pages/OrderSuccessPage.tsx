import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { CheckCircle2, FileText, ArrowRight, Package, Printer, Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import api from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const { id, orderNo } = useParams<{ id?: string; orderNo?: string }>();
  const orderIdentifier = orderNo || id;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-success', orderIdentifier],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderIdentifier}`);
      return res.data?.data || res.data?.order;
    },
    enabled: !!orderIdentifier,
  });

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2F5D3A', '#D9A441', '#5DB4D6', '#FAF6EC'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-amber-50 rounded-full mx-auto mb-4 border border-[#E7E0D0]" />
        <div className="h-6 bg-amber-100/60 rounded w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-amber-100/60 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF6EC] border border-[#E7E0D0] flex items-center justify-center mx-auto mb-4 text-[#2F5D3A]">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900">Order Received</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 mb-6">
          Thank you! Your order has been placed in our system.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-[#2F5D3A] text-white text-xs font-bold rounded-full hover:bg-[#1F4D2E] shadow-sm transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const shippingAddr = order.shippingAddressSnapshot || order.shippingAddress || {};
  const invoiceUrl = `http://localhost:5000/api/orders/${order.id}/invoice`;
  const trackingUrl = `/track-order?token=${order.trackingToken || ''}&orderNumber=${order.orderNumber}`;

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-6 sm:p-10 text-center">
        {/* Brand Logo */}
        <Link to="/" className="inline-block mb-4 transition-transform hover:scale-102">
          <img src="/logo.png" alt="Mewa Masala Ghar" className="h-16 w-auto mx-auto drop-shadow-xs" />
        </Link>

        {/* Success Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#2F5D3A] flex items-center justify-center mx-auto mb-4 shadow-soft">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Order Confirmed & Logged
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1 mb-2">
          Thank You for Choosing Purity!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
          Your consignment <strong className="text-gray-900 font-bold">{order.orderNumber}</strong> is now reserved and being prepared in our FSSAI-certified APMC facility.
        </p>

        {/* GST Invoice Callout Banner */}
        <div className="p-4 sm:p-5 bg-[#FAF6EC] rounded-2xl border border-[#E7E0D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 text-left shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-[#D9A441]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official GST Tax Invoice</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900 block mt-0.5">
              Invoice #{order.invoiceNumber || 'Generated'}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              Total Amount: <strong>₹{Number(order.totalAmount).toFixed(2)}</strong> • {order.paymentMethod === 'COD' ? 'Cash on Delivery (Pending)' : 'Paid Online (Razorpay)'}
            </span>
          </div>

          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 shrink-0 shadow-xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tax Invoice</span>
          </a>
        </div>

        {/* Ordered Items */}
        <div className="border-t border-gray-100 pt-6 text-left mb-8">
          <h3 className="font-serif font-bold text-base text-gray-900 mb-3">
            Ordered Consignment Items ({order.items?.length || 0})
          </h3>
          <div className="divide-y divide-gray-100 border border-[#E7E0D0] rounded-2xl overflow-hidden shadow-xs">
            {order.items?.map((item: any) => (
              <div key={item.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
                <div>
                  <strong className="text-gray-900 block text-xs sm:text-sm">{item.productName || item.product?.name}</strong>
                  <span className="text-gray-500">
                    {item.variantName || item.variant?.name} • Qty: {item.quantity} (HSN: {item.hsnCode || '0801'})
                  </span>
                </div>
                <span className="font-serif font-bold text-gray-900 text-sm">
                  ₹{(Number(item.total) || Number(item.unitPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address Snapshot */}
        <div className="bg-[#FAF6EC]/60 p-4 sm:p-5 rounded-2xl text-left text-xs text-gray-600 mb-8 border border-[#E7E0D0]">
          <strong className="text-gray-900 block text-xs mb-1 font-bold">Consignment Delivering To:</strong>
          <p className="font-semibold text-gray-800">{order.customerName}</p>
          <p>{shippingAddr.addressLine}</p>
          {shippingAddr.landmark && <p>Landmark: {shippingAddr.landmark}</p>}
          <p>
            {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.pincode}
          </p>
          <p className="mt-1 text-gray-500">Phone: {order.customerPhone} • Email: {order.customerEmail}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/shop"
            className="px-7 py-3.5 bg-[#2F5D3A] text-white text-xs font-bold rounded-full hover:bg-[#1F4D2E] transition-all shadow-md active:scale-98"
          >
            Continue Shopping
          </Link>
          <Link
            to={trackingUrl}
            className="px-7 py-3.5 bg-white border border-[#E7E0D0] text-gray-800 text-xs font-bold rounded-full hover:bg-[#FAF6EC] transition-all inline-flex items-center gap-2 shadow-xs active:scale-98"
          >
            <Truck className="w-4 h-4 text-[#2F5D3A]" />
            <span>Track Consignment</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};
