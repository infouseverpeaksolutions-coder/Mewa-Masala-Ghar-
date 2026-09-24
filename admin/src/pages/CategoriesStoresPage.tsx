import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Store,
  Layers,
  X,
  Loader2,
  Check,
  AlertCircle,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../services/api';

export const CategoriesStoresPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  // Fetch Stores
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['admin-stores-manage'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      return res.data?.data || [];
    },
  });

  // Set default store
  React.useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  // Fetch Categories for selected store
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['admin-categories-manage', selectedStoreId],
    queryFn: async () => {
      if (!selectedStoreId) return [];
      const res = await api.get(`/admin/categories?storeId=${selectedStoreId}`);
      return res.data?.data || [];
    },
    enabled: !!selectedStoreId,
  });

  const activeStore = stores.find((s: any) => s.id === selectedStoreId);

  // Parent categories (no parentId)
  const rootCategories = categories.filter((c: any) => !c.parentId);

  // Mutation to delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories-manage'] });
    },
  });

  // Open modal for new category
  const handleOpenAdd = (parentCatId?: string) => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setParentId(parentCatId || '');
    setDescription('');
    setImage('');
    setDisplayOrder('0');
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for editing category
  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(String(cat.displayOrder || 0));
    setFormError(null);
    setModalOpen(true);
  };

  // Save Category Submit
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      const payload = {
        storeId: selectedStoreId,
        parentId: parentId || null,
        name: name.trim(),
        slug: slug.trim() || undefined,
        description,
        image,
        displayOrder: parseInt(displayOrder, 10) || 0,
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-categories-manage'] });
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">Categories & Department Stores</h1>
          <p className="text-[#8C7B65] mt-0.5">
            Organize catalog taxonomy, store theme color palettes, and parent-child hierarchy.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#23472C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stores Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map((s: any) => {
          const isSelected = s.id === selectedStoreId;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedStoreId(s.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-[#2F5D3A] ring-2 ring-[#2F5D3A]/20 shadow-md'
                  : 'bg-white/80 border-[#E6DEC8] hover:border-[#D9A441] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm text-[#2B2B2B]">{s.name}</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: s.primaryColor }}
                  title={`Store theme color: ${s.primaryColor}`}
                />
              </div>

              <p className="text-[11px] text-[#4A4A4A] line-clamp-1 mb-3">{s.tagline || s.description}</p>

              <div className="flex items-center justify-between text-[11px] text-[#8C7B65] pt-2 border-t border-gray-100">
                <span>{s._count?.categories || 0} Categories</span>
                <span>{s._count?.products || 0} Products</span>
              </div>

              {s.fssaiNumber && (
                <div className="mt-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>FSSAI: {s.fssaiNumber}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Tree for Active Store */}
      <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#2F5D3A]" />
            <span className="font-serif font-bold text-sm text-gray-900">
              Taxonomy for {activeStore?.name || 'Selected Department'}
            </span>
          </div>

          <span className="text-gray-500 text-[11px]">
            {categories.length} total categories registered
          </span>
        </div>

        {catsLoading ? (
          <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F5D3A]" />
            <span>Loading categories tree...</span>
          </div>
        ) : rootCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No categories defined for this department. Click "Add Category" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {rootCategories.map((cat: any) => {
              const children = categories.filter((c: any) => c.parentId === cat.id);
              return (
                <div key={cat.id} className="border border-[#E6DEC8] rounded-2xl p-3.5 bg-[#FAF6EC]/40 space-y-2">
                  {/* Parent Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt=""
                          className="w-10 h-10 object-cover rounded-xl border border-[#E6DEC8] bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-bold text-xs">{cat.name}</strong>
                          <span className="font-mono text-[10px] text-gray-400">/{cat.slug}</span>
                        </div>
                        <span className="text-[11px] text-[#8C7B65]">
                          Order: {cat.displayOrder} • {cat._count?.products || 0} products linked
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAdd(cat.id)}
                        className="px-2.5 py-1 bg-white border border-[#E6DEC8] hover:border-[#D9A441] text-[#2F5D3A] rounded-lg font-bold text-[11px] flex items-center gap-1"
                        title="Add child sub-category"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Subcategory</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-white"
                        title="Edit category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"? Child products will need reassigning.`)) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children Subcategories */}
                  {children.length > 0 && (
                    <div className="pl-6 border-l-2 border-[#D9A441]/40 ml-4 space-y-1.5 pt-1">
                      {children.map((sub: any) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">└</span>
                            <div>
                              <strong className="text-gray-800 font-semibold">{sub.name}</strong>
                              <span className="text-gray-400 font-mono text-[10px] ml-1.5">/{sub.slug}</span>
                              <span className="text-[10px] text-[#8C7B65] ml-2">
                                ({sub._count?.products || 0} items)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(sub)}
                              className="p-1 text-gray-400 hover:text-amber-600 rounded"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete subcategory "${sub.name}"?`)) {
                                  deleteMutation.mutate(sub.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-4">
              <h3 className="font-serif font-bold text-base text-gray-900">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Add Category'}
              </h3>
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

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Parent Category (Optional)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl font-medium"
                >
                  <option value="">None (Top-level Parent Category)</option>
                  {rootCategories
                    .filter((c: any) => c.id !== editingCategory?.id)
                    .map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCategory) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '')
                        );
                      }
                    }}
                    placeholder="e.g. Dry Fruits & Nuts"
                    className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="dry-fruits-nuts"
                    className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category overview snippet..."
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
