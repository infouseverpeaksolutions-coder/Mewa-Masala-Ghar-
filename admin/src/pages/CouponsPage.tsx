import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag, Plus, Check, X, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Coupon } from '../types';

export const CouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('499');
  const [maxDiscount, setMaxDiscount] = useState('200');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      return res.data?.data as Coupon[];
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/admin/coupons', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setModalOpen(false);
      setCode('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create coupon.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createCouponMutation.mutate({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderValue: parseFloat(minOrderValue),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Promotions & Coupons</h1>
          <p className="text-xs text-gray-500 mt-1">Manage marketing discount codes and promotional vouchers.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#23472C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading coupons...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Promo Code</th>
                  <th className="p-3.5">Type & Benefit</th>
                  <th className="p-3.5">Min Order Value</th>
                  <th className="p-3.5">Redemptions</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons?.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-sm text-[#2F5D3A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-gray-800">
                      {c.discountType === 'PERCENTAGE'
                        ? `${c.discountValue}% OFF (Max ₹${c.maxDiscount || 'Unlimited'})`
                        : `Flat ₹${c.discountValue} OFF`}
                    </td>
                    <td className="p-3.5 text-gray-600">₹{c.minOrderValue}</td>
                    <td className="p-3.5 font-bold text-gray-700">{c.usageCount} used</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-gray-900">Create Discount Coupon</h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="DIWALI2026"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Cap (₹, optional)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createCouponMutation.isPending}
                className="w-full py-2.5 bg-[#2F5D3A] hover:bg-[#23472C] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {createCouponMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Activate Coupon</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
