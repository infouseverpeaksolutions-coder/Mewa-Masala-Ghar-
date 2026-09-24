import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Tag,
  Check,
  X,
  AlertCircle,
  Loader2,
  Package,
} from 'lucide-react';
import api from '../services/api';

export const CombosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [items, setItems] = useState<{ productVariantId: string; quantity: number }[]>([]);

  // Fetch Bundles
  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ['admin-bundles'],
    queryFn: async () => {
      const res = await api.get('/admin/bundles');
      return res.data?.data || [];
    },
  });

  // Fetch Products with variants for combo builder item picker
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products-picker'],
    queryFn: async () => {
      const res = await api.get('/admin/products?limit=100');
      return res.data?.data?.products || [];
    },
  });

  // Delete Bundle Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/bundles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingBundle(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setMrp('');
    setItems([]);
    setFormError(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (bundle: any) => {
    setEditingBundle(bundle);
    setName(bundle.name);
    setSlug(bundle.slug);
    setDescription(bundle.description || '');
    setPrice(String(bundle.price));
    setMrp(String(bundle.mrp));
    setItems(
      bundle.items?.map((it: any) => ({
        productVariantId: it.productVariantId,
        quantity: it.quantity || 1,
      })) || []
    );
    setFormError(null);
    setModalOpen(true);
  };

  // Add Item to Combo
  const handleAddItem = (variantId: string) => {
    if (!variantId) return;
    const existing = items.find((it) => it.productVariantId === variantId);
    if (existing) {
      setItems(items.map((it) => (it.productVariantId === variantId ? { ...it, quantity: it.quantity + 1 } : it)));
    } else {
      setItems([...items, { productVariantId: variantId, quantity: 1 }]);
    }
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Compute MRP sum of chosen variants
  const calculatedMrp = items.reduce((acc, it) => {
    for (const p of products) {
      const v = p.variants?.find((vr: any) => vr.id === it.productVariantId);
      if (v) return acc + (v.mrp || v.price) * it.quantity;
    }
    return acc;
  }, 0);

  const calculatedSellingSum = items.reduce((acc, it) => {
    for (const p of products) {
      const v = p.variants?.find((vr: any) => vr.id === it.productVariantId);
      if (v) return acc + v.price * it.quantity;
    }
    return acc;
  }, 0);

  // Auto fill MRP when items change if MRP empty
  React.useEffect(() => {
    if (calculatedMrp > 0 && !editingBundle && !mrp) {
      setMrp(String(calculatedMrp));
      setPrice(String(Math.round(calculatedSellingSum * 0.9))); // 10% combo discount default
    }
  }, [calculatedMrp, calculatedSellingSum, editingBundle, mrp]);

  const bundlePriceNum = parseFloat(price) || 0;
  const bundleMrpNum = parseFloat(mrp) || calculatedMrp;
  const savings = Math.max(0, bundleMrpNum - bundlePriceNum);
  const discountPercent = bundleMrpNum > 0 ? Math.round((savings / bundleMrpNum) * 100) : 0;

  // Submit Combo
  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Combo name is required.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setFormError('Valid combo price is required.');
      return;
    }
    if (items.length === 0) {
      setFormError('Please select at least 1 product variant for this combo.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description,
        price: parseFloat(price),
        mrp: parseFloat(mrp) || calculatedMrp,
        items,
      };

      if (editingBundle) {
        await api.put(`/admin/bundles/${editingBundle.id}`, payload);
      } else {
        await api.post('/admin/bundles', payload);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save combo.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">Combos, Bundles & Hampers</h1>
          <p className="text-[#8C7B65] mt-0.5">
            Create multi-item gift boxes, healthy snack packs, and festive wellness hampers with custom discount pricing.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#23472C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Combo Hamper</span>
        </button>
      </div>

      {/* Combos Table */}
      <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F5D3A]" />
            <span>Loading combo hampers...</span>
          </div>
        ) : bundles.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Layers className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-semibold text-gray-700">No combo hampers created yet.</p>
            <p className="text-[11px]">Click "Create Combo Hamper" to build value bundles.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#FAF6EC] text-[#8C7B65] uppercase font-bold border-b border-[#E6DEC8]">
                <tr>
                  <th className="p-3.5">Combo Name</th>
                  <th className="p-3.5">Items Included</th>
                  <th className="p-3.5">MRP Sum</th>
                  <th className="p-3.5">Combo Price</th>
                  <th className="p-3.5">Customer Savings</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bundles.map((b: any) => {
                  const comboSavings = Math.max(0, b.mrp - b.price);
                  const discountPct = b.mrp > 0 ? Math.round((comboSavings / b.mrp) * 100) : 0;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5">
                        <strong className="text-gray-900 block font-serif font-bold text-xs">{b.name}</strong>
                        <span className="text-gray-400 font-mono text-[10px]">/{b.slug}</span>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="space-y-1">
                          {b.items?.map((it: any) => (
                            <div key={it.id} className="text-[11px] text-gray-700 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded bg-[#FAF6EC] border border-[#E6DEC8] text-[#2F5D3A] font-bold text-[9px] flex items-center justify-center">
                                {it.quantity}x
                              </span>
                              <span>
                                {it.productVariant?.product?.name} ({it.productVariant?.name})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 text-gray-400 line-through">₹{b.mrp}</td>

                      <td className="p-3.5 font-bold text-xs text-[#2F5D3A]">₹{b.price}</td>

                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                          <Tag className="w-3 h-3 text-emerald-700" />
                          <span>
                            Save ₹{comboSavings} ({discountPct}% OFF)
                          </span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {b.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete combo "${b.name}"?`)) {
                              deleteMutation.mutate(b.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Combo Builder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D9A441]" />
                <h3 className="font-serif font-bold text-base text-gray-900">
                  {editingBundle ? `Edit Combo: ${editingBundle.name}` : 'Combo & Hamper Builder'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCombo} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Combo Hamper Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingBundle) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '')
                        );
                      }
                    }}
                    placeholder="e.g. Royal Trio Nut Hamper"
                    className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="royal-trio-nut-hamper"
                    className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Luxurious assortment of handpicked nuts and dry fruits in premium packaging..."
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl"
                />
              </div>

              {/* Items Picker */}
              <div className="p-4 bg-white rounded-2xl border border-[#E6DEC8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Select Components for this Combo</span>
                  <span className="text-[11px] text-[#8C7B65]">{items.length} items added</span>
                </div>

                <div className="flex gap-2">
                  <select
                    id="variant-picker"
                    className="flex-1 px-3 py-1.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-medium"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a product variant to include...
                    </option>
                    {products.map((p: any) =>
                      p.variants?.map((v: any) => (
                        <option key={v.id} value={v.id}>
                          {p.name} — {v.name} (MRP ₹{v.mrp} / ₹{v.price})
                        </option>
                      ))
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      const selectEl = document.getElementById('variant-picker') as HTMLSelectElement;
                      if (selectEl?.value) {
                        handleAddItem(selectEl.value);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#2F5D3A] text-white rounded-xl font-bold flex items-center gap-1 hover:bg-[#23472C]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {items.length > 0 && (
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mt-2">
                    {items.map((it, idx) => {
                      let foundProdName = '';
                      let foundVariantName = '';
                      let variantPrice = 0;

                      for (const p of products) {
                        const vr = p.variants?.find((v: any) => v.id === it.productVariantId);
                        if (vr) {
                          foundProdName = p.name;
                          foundVariantName = vr.name;
                          variantPrice = vr.price;
                          break;
                        }
                      }

                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#FAF6EC]/30">
                          <div>
                            <strong className="text-gray-900 block">{foundProdName}</strong>
                            <span className="text-gray-500 text-[10px]">
                              {foundVariantName} (₹{variantPrice} ea)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-[11px]">Qty:</span>
                              <input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx].quantity = parseInt(e.target.value, 10) || 1;
                                  setItems(updated);
                                }}
                                className="w-14 px-2 py-0.5 bg-white border border-gray-300 rounded text-center font-bold"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pricing & Savings Preview */}
              <div className="p-4 bg-white rounded-2xl border border-[#E6DEC8] space-y-3">
                <span className="font-bold text-gray-800 block">Pricing & Savings Engine</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Calculated MRP (₹) <span className="font-normal text-gray-400">(Individual sum)</span>
                    </label>
                    <input
                      type="number"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      placeholder={String(calculatedMrp)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Discounted Combo Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 799"
                      className="w-full px-3 py-2 bg-white border border-[#2F5D3A] rounded-xl font-bold text-[#2F5D3A]"
                    />
                  </div>
                </div>

                {bundleMrpNum > 0 && bundlePriceNum > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold">Customer Discount:</span>
                    </div>
                    <span className="font-bold text-sm">
                      ₹{savings} ({discountPercent}% OFF total retail)
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E6DEC8] rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F5D3A] text-white rounded-xl font-bold hover:bg-[#23472C]"
                >
                  Save Combo Hamper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
