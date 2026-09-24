import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

const ORDER_STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received & logged' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Stock reserved' },
  { key: 'PACKED', label: 'Packed', desc: 'Quality checked' },
  { key: 'SHIPPED', label: 'Shipped', desc: 'In transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Doorstep arrival' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Completed' },
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || searchParams.get('trackingToken') || '';
  const numParam = searchParams.get('orderNumber') || searchParams.get('orderId') || '';
  const contactParam = searchParams.get('emailOrPhone') || '';

  const [orderNumber, setOrderNumber] = useState(numParam);
  const [emailOrPhone, setEmailOrPhone] = useState(contactParam);
  const [trackingToken, setTrackingToken] = useState(tokenParam);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (payload: { trackingToken?: string; orderNumber?: string; emailOrPhone?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/orders/track', payload);
      if (res.data?.success) {
        const data = res.data.data || res.data.tracking || res.data;
        setOrder(data);
      } else {
        setError(res.data?.message || 'Unable to locate order with provided credentials.');
        setOrder(null);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to find matching order. Please check your Order Number and Email/Phone.'
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenParam) {
      fetchTracking({ trackingToken: tokenParam });
    } else if (numParam && contactParam) {
      fetchTracking({ orderNumber: numParam, emailOrPhone: contactParam });
    }
  }, [tokenParam, numParam, contactParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingToken.trim()) {
      fetchTracking({ trackingToken: trackingToken.trim() });
    } else if (orderNumber.trim() && emailOrPhone.trim()) {
      fetchTracking({ orderNumber: orderNumber.trim(), emailOrPhone: emailOrPhone.trim() });
    } else {
      setError('Please provide either your Tracking Token, or both Order Number and Email/Phone.');
    }
  };

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    if (currentStatus === 'CANCELLED' || currentStatus === 'RETURNED') return 'neutral';
    const keys = ORDER_STEPS.map((s) => s.key);
    const currIdx = keys.indexOf(currentStatus);
    const stepIdx = keys.indexOf(stepKey);
    if (stepIdx < 0 || currIdx < 0) return 'upcoming';
    if (stepIdx < currIdx) return 'completed';
    if (stepIdx === currIdx) return 'current';
    return 'upcoming';
  };

  const isTerminalCancelled = order?.status === 'CANCELLED';
  const isTerminalReturned = order?.status === 'RETURNED';

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Live Consignment Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your Order Number and registered Email/Phone, or use the instant tracking token from your dispatch email.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-6 sm:p-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Order Number (e.g. MMG-2026-XXXXXX)
            </label>
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="MMG-2026-105347"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all uppercase min-h-[44px]"
              />
              <Package className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Registered Email or 10-Digit Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="aarav@example.com or 9820012345"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all min-h-[44px]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Or Use Token
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tracking Token (from order confirmation email)
            </label>
            <input
              type="text"
              value={trackingToken}
              onChange={(e) => setTrackingToken(e.target.value)}
              placeholder="Paste 48-character secure token..."
              className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (!trackingToken && (!orderNumber || !emailOrPhone))}
            className="w-full py-3.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating Shipment...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#D9A441]">Official Shipment</span>
              <h2 className="font-serif text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
              {order.placedAt && (
                <span className="text-xs text-gray-500">
                  Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            <div className="sm:text-right">
              <span
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wide inline-flex items-center gap-1.5 ${
                  isTerminalCancelled
                    ? 'bg-red-100 text-red-800'
                    : isTerminalReturned
                    ? 'bg-amber-100 text-amber-800'
                    : order.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isTerminalCancelled && <XCircle className="w-3.5 h-3.5" />}
                {isTerminalReturned && <RotateCcw className="w-3.5 h-3.5" />}
                {!isTerminalCancelled && !isTerminalReturned && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{order.status}</span>
              </span>
              {order.totalAmount && (
                <span className="text-xs text-gray-500 block mt-1 font-semibold">
                  Total Consignment Value: ₹{Number(order.totalAmount).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {!isTerminalCancelled && !isTerminalReturned && (
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {ORDER_STEPS.map((step) => {
                  const status = getStepStatus(step.key, order.status);
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : status === 'current'
                          ? 'bg-[#2F5D3A] border-[#2F5D3A] text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {status === 'current' && <Clock className="w-4 h-4 text-white animate-pulse" />}
                        {status === 'upcoming' && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      </div>
                      <span className="text-xs font-bold block">{step.label}</span>
                      <span
                        className={`text-[10px] block mt-0.5 ${
                          status === 'current' ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipment & Courier Banner */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="p-5 bg-[#FAF6EC] rounded-2xl border border-[#E7E0D0] space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#2F5D3A] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D9A441]" />
                <span>Courier & Transit Details</span>
              </h3>
              {order.shipments.map((shipment: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Courier Partner:</span>
                    <strong className="text-gray-900 text-sm">{shipment.courier || 'Delhivery Express'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">AWB / Tracking No.:</span>
                    <strong className="text-gray-900 text-sm">{shipment.awbNo || 'Pending'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Estimated Arrival:</span>
                    <strong className="text-gray-900 text-sm">
                      {shipment.expectedDelivery
                        ? new Date(shipment.expectedDelivery).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '3-5 Business Days'}
                    </strong>
                  </div>
                  <div className="sm:text-right self-center">
                    {shipment.trackingUrl ? (
                      <a
                        href={shipment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5D3A] text-white rounded-full text-xs font-bold hover:bg-[#1F4D2E] transition-colors shadow-xs"
                      >
                        <span>Courier Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-500">Live GPS tracking active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vertical Tracking Timeline Events with Green Step Highlights */}
          {order.trackingEvents && order.trackingEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                Consignment Transit Activity Log
              </h3>
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E0D0]">
                {order.trackingEvents.map((event: any, idx: number) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={idx} className="relative group">
                      <div
                        className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          isLatest ? 'bg-[#2F5D3A] ring-4 ring-[#2F5D3A]/20' : 'bg-emerald-500'
                        }`}
                      />
                      <div className="bg-[#FAF6EC]/50 p-4 rounded-2xl border border-[#E7E0D0] space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-gray-900">{event.title || event.status}</strong>
                          {event.time && (
                            <span className="text-[11px] text-gray-500">
                              {new Date(event.time).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        {event.description && <p className="text-xs text-gray-600">{event.description}</p>}
                        {event.location && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#2F5D3A] font-semibold">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/shop"
              className="text-xs font-bold text-[#2F5D3A] hover:underline inline-flex items-center gap-1"
            >
              <span>← Return to Catalog</span>
            </Link>
            {order.orderNumber && (
              <a
                href={`http://localhost:5000/api/orders/${order.orderNumber}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Official GST Tax Invoice</span>
              </a>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
