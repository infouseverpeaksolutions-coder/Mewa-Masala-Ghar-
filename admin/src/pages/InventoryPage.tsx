import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Save, AlertTriangle, Check, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';

export const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [priceUpdates, setPriceUpdates] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const res = await api.get('/products?limit=100');
      return res.data?.data?.products as Product[];
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ variantId, stock, price }: any) => {
      await api.put(`/admin/variants/${variantId}/stock`, { stock, price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      setSuccessMessage('Inventory successfully updated.');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  // Flatten variants
  const variantsList = (products || []).flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productName: p.name,
      storeName: p.store?.name,
      hsnCode: p.hsnCode,
    }))
  );

  const filteredVariants = variantsList.filter(
    (v) =>
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveVariant = (variantId: string, currentStock: number, currentPrice: number) => {
    const stock = stockUpdates[variantId] !== undefined ? stockUpdates[variantId] : currentStock;
    const price = priceUpdates[variantId] !== undefined ? priceUpdates[variantId] : currentPrice;
    updateVariantMutation.mutate({ variantId, stock, price });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Inventory & Stock Adjustments</h1>
          <p className="text-xs text-gray-500 mt-1">Manage physical warehouse inventory levels and variant pricing.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or Product..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading inventory items...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">SKU Code</th>
                  <th className="p-3.5">Product & Variant</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Selling Price (₹)</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5 text-right">Quick Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVariants.map((v) => {
                  const baseStock = v.stockQty ?? v.stock ?? 0;
                  const currentStockVal = stockUpdates[v.id] !== undefined ? stockUpdates[v.id] : baseStock;
                  const currentPriceVal = priceUpdates[v.id] !== undefined ? priceUpdates[v.id] : v.price;
                  const isModified =
                    (stockUpdates[v.id] !== undefined && stockUpdates[v.id] !== baseStock) ||
                    (priceUpdates[v.id] !== undefined && priceUpdates[v.id] !== v.price);

                  return (
                    <tr key={v.id} className="hover:bg-gray-50/60">
                      <td className="p-3.5 font-mono font-bold text-gray-900">{v.sku}</td>
                      <td className="p-3.5">
                        <strong className="text-gray-900 block">{v.productName}</strong>
                        <span className="text-[11px] text-gray-500">{v.name} (HSN: {v.hsnCode})</span>
                      </td>
                      <td className="p-3.5 text-gray-600">{v.storeName}</td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          value={currentPriceVal}
                          onChange={(e) =>
                            setPriceUpdates({ ...priceUpdates, [v.id]: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-[#2F5D3A]"
                        />
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={currentStockVal}
                            onChange={(e) =>
                              setStockUpdates({ ...stockUpdates, [v.id]: parseInt(e.target.value, 10) || 0 })
                            }
                            className={`w-20 px-2 py-1 rounded-lg text-xs font-bold border ${
                              currentStockVal <= 10
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            }`}
                          />
                          {currentStockVal <= 10 && (
                            <span className="text-[10px] font-bold text-amber-700">Low</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          disabled={!isModified || updateVariantMutation.isPending}
                          onClick={() => handleSaveVariant(v.id, baseStock, v.price)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto ${
                            isModified
                              ? 'bg-[#2F5D3A] hover:bg-[#23472C] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
