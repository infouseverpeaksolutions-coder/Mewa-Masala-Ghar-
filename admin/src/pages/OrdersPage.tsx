import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  FileText,
  Truck,
  Check,
  X,
  Loader2,
  AlertCircle,
  Eye,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ExternalLink,
  Send,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';

const VALID_NEXT_STATUSES: Record<string, string[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

const ALL_STATUSES = [
  'PLACED',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  
  // Modals state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [liveTrackingData, setLiveTrackingData] = useState<any | null>(null);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);

  // Status update form states
  const [newStatus, setNewStatus] = useState<string>('CONFIRMED');
  const [courierName, setCourierName] = useState<string>('Shiprocket Express');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shiprocket dispatch state
  const [isShippingShiprocket, setIsShippingShiprocket] = useState(false);
  const [shippingNotice, setShippingNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', selectedStatus, search],
    queryFn: async () => {
      let url = '/admin/orders?limit=100';
      if (selectedStatus !== 'ALL') url += `&status=${selectedStatus}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data?.data?.orders as Order[];
    },
  });

  // Query single order details when viewing
  const handleOpenViewDetails = async (order: Order) => {
    setViewingOrder(order);
    setShippingNotice(null);
    setLiveTrackingData(null);
    try {
      const res = await api.get(`/admin/orders/${order.id}`);
      if (res.data?.success && res.data?.data) {
        setViewingOrder(res.data.data);
      }
    } catch (e) {
      // Keep basic order data from list if detail fetch fails
    }
  };

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, courierName, trackingNumber, comment }: any) => {
      await api.put(`/admin/orders/${id}/status`, {
        status,
        courierName,
        trackingNumber: trackingNumber || (status === 'SHIPPED' ? `AWB-${Date.now().toString().slice(-8)}` : undefined),
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingOrder(null);
      setErrorMsg(null);
      if (viewingOrder) {
        handleOpenViewDetails(viewingOrder);
      }
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'Failed to update order status');
    },
  });

  // 1-Click Shiprocket Dispatch
  const handleShiprocketDispatch = async (orderId: string) => {
    setIsShippingShiprocket(true);
    setShippingNotice(null);
    try {
      const res = await api.post(`/admin/orders/${orderId}/ship-shiprocket`, {
        pickupLocation: 'work',
      });
      if (res.data?.success) {
        const awb = res.data?.data?.awb_code || res.data?.shipment?.awbNo || 'Assigned';
        const courier = res.data?.data?.courier_name || res.data?.shipment?.courier || 'Courier Assigned';
        setShippingNotice({
          type: 'success',
          text: `Successfully dispatched with Shiprocket! AWB: ${awb} (${courier})`,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        handleOpenViewDetails({ ...viewingOrder!, id: orderId });
      } else {
        setShippingNotice({
          type: 'error',
          text: res.data?.message || 'Shiprocket order creation failed.',
        });
      }
    } catch (err: any) {
      setShippingNotice({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Error communicating with Shiprocket API.',
      });
    } finally {
      setIsShippingShiprocket(false);
    }
  };

  // Fetch Live Shiprocket Tracking
  const handleFetchLiveTracking = async (awbCode: string) => {
    setIsFetchingTracking(true);
    try {
      const res = await api.get(`/shipping/track/${awbCode}`);
      if (res.data?.success) {
        setLiveTrackingData(res.data.data);
      }
    } catch (err) {
      // non-blocking
    } finally {
      setIsFetchingTracking(false);
    }
  };

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    const validOptions = VALID_NEXT_STATUSES[order.status] || [];
    setNewStatus(validOptions.length > 0 ? validOptions[0] : order.status);
    setCourierName(order.courierName || 'Shiprocket Express');
    setTrackingNumber(order.trackingNumber || `AWB-${Date.now().toString().slice(-8)}`);
    setComment('');
    setErrorMsg(null);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateStatusMutation.mutate({
      id: editingOrder.id,
      status: newStatus,
      courierName,
      trackingNumber,
      comment,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Orders & Shipments</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer orders, track Shiprocket courier deliveries, and view invoices.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
          >
            <option value="ALL">All Orders</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Name, or Phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F5D3A]" />
            <span>Loading orders and shipments...</span>
          </div>
        ) : !ordersData || ordersData.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No orders found matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-[#FAF6EC] text-gray-700 uppercase font-semibold border-b border-[#E6DEC8]">
                <tr>
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Customer & Contact</th>
                  <th className="p-3.5">Delivery Destination</th>
                  <th className="p-3.5">Items & Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Order Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersData.map((o) => {
                  const addr = o.shippingAddressSnapshot || o.shippingAddress || {};
                  const isPaid = o.paymentStatus === 'PAID';
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-gray-900 block">{o.orderNumber}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <strong className="text-gray-900 block">{o.customerName}</strong>
                        <span className="text-gray-500 text-[11px]">{o.customerPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-gray-800">
                          {addr.city || 'Balotra'}, {addr.state || 'Rajasthan'}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">{addr.pincode || '344022'}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block text-sm">₹{Number(o.totalAmount).toFixed(2)}</span>
                        <span className="text-[11px] text-gray-500">{o.items?.length || 1} item(s)</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-gray-100 text-gray-800 mr-1.5">
                          {o.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.paymentStatus === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY'
                              ? 'bg-sky-100 text-sky-800'
                              : o.status === 'CANCELLED' || o.status === 'RETURNED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenViewDetails(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#183B23] hover:bg-[#234c30] text-white rounded-lg text-xs font-semibold shadow-xs"
                          title="View Order & Track Shipment"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Track</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                          title="Update Status"
                        >
                          Update
                        </button>
                        <a
                          href={`http://localhost:5000/api/orders/${o.id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold"
                          title="Download GST Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL: View Order Details & Track Shipment */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setViewingOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl z-10 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-[#183B23] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2F5D3A] flex items-center justify-center text-[#D9A441] border border-[#D9A441]/40">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-white leading-tight">
                    Order {viewingOrder.orderNumber}
                  </h2>
                  <span className="text-xs text-[#FAF6EC]/80">
                    Placed on {new Date(viewingOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF6EC] text-[#183B23]">
                  {viewingOrder.status}
                </span>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              {shippingNotice && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-2 ${
                    shippingNotice.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{shippingNotice.text}</span>
                </div>
              )}

              {/* Grid: Customer Info & Delivery Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">
                    Customer Information
                  </span>
                  <p className="font-semibold text-gray-900 text-sm">{viewingOrder.customerName}</p>
                  <p className="text-gray-600">📞 Phone: {viewingOrder.customerPhone}</p>
                  <p className="text-gray-600">✉️ Email: {viewingOrder.customerEmail || 'N/A'}</p>
                  {viewingOrder.customerGstin && (
                    <p className="text-gray-600 font-mono">GSTIN: {viewingOrder.customerGstin}</p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">
                    Shipping & Delivery Address
                  </span>
                  {(() => {
                    const a = viewingOrder.shippingAddressSnapshot || viewingOrder.shippingAddress || {};
                    return (
                      <div className="space-y-1">
                        <p className="font-medium text-gray-800">
                          {a.addressLine || a.street || a.address || 'Address on file'}
                        </p>
                        {a.landmark && <p className="text-gray-500">Landmark: {a.landmark}</p>}
                        <p className="text-gray-800 font-semibold">
                          {a.city || 'Balotra'}, {a.state || 'Rajasthan'} - {a.pincode || '344022'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Shipment & Shiprocket Tracking Panel */}
              <div className="p-5 bg-[#FAF6EC] rounded-2xl border border-[#E6DEC8] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#2F5D3A]" />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-gray-900">Shiprocket Logistics & Tracking</h3>
                      <p className="text-[11px] text-gray-500">
                        Live Waybill assignment, pickup scheduling, and transit milestone monitoring.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Ship via Shiprocket button if not yet shipped */}
                    {viewingOrder.status !== 'SHIPPED' &&
                      viewingOrder.status !== 'DELIVERED' &&
                      viewingOrder.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleShiprocketDispatch(viewingOrder.id)}
                          disabled={isShippingShiprocket}
                          className="px-3.5 py-2 bg-[#2F5D3A] hover:bg-[#23472C] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          {isShippingShiprocket ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Ship via Shiprocket</span>
                        </button>
                      )}

                    {viewingOrder.shipments?.[0]?.awbNo && (
                      <button
                        onClick={() => handleFetchLiveTracking(viewingOrder.shipments![0].awbNo!)}
                        disabled={isFetchingTracking}
                        className="px-3 py-1.5 bg-white border border-[#2F5D3A] text-[#2F5D3A] hover:bg-[#2F5D3A]/5 font-bold rounded-xl text-xs flex items-center gap-1"
                      >
                        {isFetchingTracking ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        <span>Track Live Status</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Shipment Details Card */}
                {viewingOrder.shipments && viewingOrder.shipments.length > 0 ? (
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                    {viewingOrder.shipments.map((s, idx) => (
                      <div key={s.id || idx} className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                          <div>
                            <span className="text-[11px] text-gray-500">Courier Partner:</span>
                            <span className="font-bold text-gray-900 ml-1.5">{s.courier || 'Shiprocket Express'}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-500">AWB Code:</span>
                            <span className="font-mono font-bold text-[#2F5D3A] ml-1.5">{s.awbNo || 'Pending'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-sky-100 text-sky-800 uppercase">
                            {s.status}
                          </span>
                        </div>

                        {/* Tracking Events timeline */}
                        {s.trackingEvents && s.trackingEvents.length > 0 ? (
                          <div className="space-y-2 pt-1">
                            <span className="font-bold text-gray-700 block text-[11px]">Milestones & Scans:</span>
                            <div className="relative pl-4 space-y-3 border-l-2 border-[#2F5D3A]/30">
                              {s.trackingEvents.map((evt, eIdx) => (
                                <div key={evt.id || eIdx} className="relative">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F5D3A] absolute -left-[21px] top-1" />
                                  <div className="text-[11px] font-bold text-gray-900">{evt.title}</div>
                                  <div className="text-[10px] text-gray-500">
                                    {evt.description} {evt.location ? `• ${evt.location}` : ''}
                                  </div>
                                  <div className="text-[9px] text-gray-400 font-mono">
                                    {new Date(evt.eventTime).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500 italic">
                            Awaiting initial courier scan from pickup warehouse (work / 344022).
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white/70 rounded-xl border border-gray-200 text-center text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-700">No consignment booked yet</p>
                    <p className="text-[11px]">
                      Click "Ship via Shiprocket" above to automatically generate the consignment, obtain the AWB, and book courier pickup.
                    </p>
                  </div>
                )}

                {/* Real-time Tracking Result from Shiprocket Live API */}
                {liveTrackingData && (
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-800 block text-xs">
                      Live Telemetry from Shiprocket Network:
                    </span>
                    <pre className="text-[10px] bg-gray-50 p-2.5 rounded-lg overflow-x-auto text-gray-700 font-mono">
                      {JSON.stringify(liveTrackingData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Order Items Table */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">
                  Ordered Products ({viewingOrder.items?.length || 0})
                </span>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Item Name & SKU</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewingOrder.items?.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="p-2.5">
                            <span className="font-bold text-gray-900 block">{item.productName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              SKU: {item.sku} {item.variantName ? `• ${item.variantName}` : ''}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                          <td className="p-2.5 text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
                          <td className="p-2.5 text-right font-bold">
                            ₹{Number(item.total || item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Billing Summary */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 max-w-sm ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(viewingOrder.subtotal || 0).toFixed(2)}</span>
                </div>
                {Number(viewingOrder.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{Number(viewingOrder.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>
                    {Number(viewingOrder.shippingAmount || 0) === 0
                      ? 'FREE'
                      : `₹${Number(viewingOrder.shippingAmount).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (Inclusive):</span>
                  <span>₹{Number(viewingOrder.gstAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t border-gray-200">
                  <span>Total Payable:</span>
                  <span className="text-[#2F5D3A]">₹{Number(viewingOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <a
                href={`http://localhost:5000/api/orders/${viewingOrder.id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200"
              >
                <FileText className="w-4 h-4" />
                <span>Print GST Tax Invoice</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewingOrder);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status & Courier Transition Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditingOrder(null)} className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">Update Order Status</h3>
                <span className="text-xs text-gray-400 font-mono">
                  {editingOrder.orderNumber} (Current: <strong>{editingOrder.status}</strong>)
                </span>
              </div>
              <button onClick={() => setEditingOrder(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Next Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold"
                >
                  {(VALID_NEXT_STATUSES[editingOrder.status] && VALID_NEXT_STATUSES[editingOrder.status].length > 0
                    ? VALID_NEXT_STATUSES[editingOrder.status]
                    : ALL_STATUSES
                  ).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {(newStatus === 'SHIPPED' || editingOrder.status === 'SHIPPED') && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Shiprocket Express / Delhivery"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">AWB / Waybill Number *</label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. SR-2026-999888"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Note / Transition Comment</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Verified packaging seal and handover"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={updateStatusMutation.isPending}
                className="w-full py-2.5 bg-[#2F5D3A] hover:bg-[#23472C] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Confirm Status Transition</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
