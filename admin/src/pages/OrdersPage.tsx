import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, FileText, Truck, Check, X, Loader2, AlertCircle } from 'lucide-react';
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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Status update states
  const [newStatus, setNewStatus] = useState<string>('CONFIRMED');
  const [courierName, setCourierName] = useState<string>('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus, search],
    queryFn: async () => {
      let url = '/admin/orders?limit=100';
      if (selectedStatus !== 'ALL') url += `&status=${selectedStatus}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data?.data?.orders as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, courierName, trackingNumber, comment }: any) => {
      await api.put(`/admin/orders/${id}/status`, {
        status,
        courierName,
        trackingNumber: trackingNumber || (status === 'SHIPPED' ? `DEL-${Date.now().toString().slice(-8)}` : undefined),
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingOrder(null);
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'Failed to update order status');
    },
  });

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    const validOptions = VALID_NEXT_STATUSES[order.status] || [];
    setNewStatus(validOptions.length > 0 ? validOptions[0] : order.status);
    setCourierName(order.courierName || 'Delhivery Express');
    setTrackingNumber(order.trackingNumber || `DEL-${Date.now().toString().slice(-8)}`);
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
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Customer Orders & Consignments</h1>
        <p className="text-xs text-gray-500 mt-1">
          Track lifecycle transitions, assign courier AWB waybills, and generate GST invoices.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Status:</span>
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

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Delivery State</th>
                  <th className="p-3.5">Items & Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Invoice & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersData?.map((o) => {
                  const addr = o.shippingAddressSnapshot || o.shippingAddress || {};
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-gray-900 block">{o.orderNumber}</span>
                        <span className="text-[10px] text-gray-400">{o.invoiceNumber || 'No Invoice'}</span>
                      </td>
                      <td className="p-3.5">
                        <strong className="text-gray-900 block">{o.customerName}</strong>
                        <span className="text-gray-500 text-[11px]">{o.customerPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <span>{addr.city || 'Mumbai'}, {addr.state || 'Maharashtra'}</span>
                        <span className="text-[10px] text-gray-400 block font-mono">{addr.pincode || '400703'}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block">₹{Number(o.totalAmount).toFixed(2)}</span>
                        <span className="text-[11px] text-gray-500">{o.items?.length || 0} item(s)</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-gray-100 text-gray-800">
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            o.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : o.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
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
                          <span>GST Invoice</span>
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

      {/* Edit Status & Courier Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditingOrder(null)} className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">Update Shipment</h3>
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
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                    >
                      <option value="Delhivery Express">Delhivery Express</option>
                      <option value="BlueDart Express">BlueDart Express</option>
                      <option value="DTDC India">DTDC India</option>
                      <option value="Ekart Logistics">Ekart Logistics</option>
                      <option value="India Post Speed Post">India Post Speed Post</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">AWB / Waybill Number *</label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. DEL-2026-999888"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Note / Comment</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Verified tamper-evident tape applied"
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
