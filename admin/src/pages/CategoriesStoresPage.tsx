import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Store,
  ShoppingBag,
  Baby,
} from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';

// Mewa Masala Ghar store IDs (foods store)
const MEWA_STORE_ID = 'cmu8ago75000ktdb58dx4yrx8';
// Jimmi Jaggu store - dedicated store + legacy baby/care stores
const JIMMI_STORE_SLUG = 'jimmi-jaggu';
const JIMMI_STORE_IDS = ['cmv3jfivv0000mf0x0njfn59r', 'cmu8ago7b000ltdb56djoibkp', 'cmu8ago7g000mtdb5aqmugwk1'];

export const CategoriesStoresPage: React.FC = () => {
  const queryClient = useQueryClient();
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
  const [selectedStore, setSelectedStore] = useState<'mewa' | 'jimmi'>('mewa');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const categoryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle System File Upload
  const handleCategoryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data?.data?.url) {
        setImage(res.data.data.url);
      } else {
        setFormError('Failed to upload image.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error uploading image from computer.');
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Fetch stores
  const { data: stores = [] } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      return res.data?.data || [];
    },
  });

  // Fetch All Categories
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['admin-categories-manage'],
    queryFn: async () => {
      const res = await api.get('/admin/categories');
      return res.data?.data || [];
    },
  });

  // Helper to determine if a category belongs to Jimmi Jaggu
  const isJimmiCategory = (c: any) => {
    return (
      c.brand?.slug === 'jimmi-jaggu' ||
      c.store?.slug === 'jimmi-jaggu' ||
      c.store?.slug === 'baby' ||
      c.store?.slug === 'care' ||
      (c.storeId && JIMMI_STORE_IDS.includes(c.storeId)) ||
      (c.slug && (c.slug.includes('baby') || c.slug.includes('skincare') || c.slug.includes('personal-care')))
    );
  };

  const mewaRootCategories = categories.filter((c: any) => !c.parentId && !isJimmiCategory(c));
  const jimmiRootCategories = categories.filter((c: any) => !c.parentId && isJimmiCategory(c));

  // Mutation to delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories-manage'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
    },
  });

  // Open modal for new category
  const handleOpenAdd = (storeType: 'mewa' | 'jimmi' = 'mewa', parentCatId?: string) => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setParentId(parentCatId || '');
    setDescription('');
    setImage('');
    setDisplayOrder('0');
    setSelectedStore(storeType);
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
    setSelectedStore(isJimmiCategory(cat) ? 'jimmi' : 'mewa');
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

    // Determine storeId based on selected store
    let storeId: string | undefined;
    if (selectedStore === 'jimmi') {
      const jimmiStore = stores.find((s: any) => s.slug === 'jimmi-jaggu') ||
                         stores.find((s: any) => s.slug === 'baby') ||
                         stores.find((s: any) => s.slug === 'care');
      storeId = jimmiStore?.id;
    } else {
      const foodsStore = stores.find((s: any) => s.slug === 'foods');
      storeId = foodsStore?.id;
    }

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        storeId,
        selectedStore,
        storeSlug: selectedStore === 'jimmi' ? 'jimmi-jaggu' : 'foods',
        brandSlug: selectedStore === 'jimmi' ? 'jimmi-jaggu' : 'mewa-masala-ghar',
        parentId: parentId?.trim() ? parentId.trim() : null,
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        displayOrder: parseInt(displayOrder, 10) || 0,
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-categories-manage'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  // Reusable category tree renderer
  const renderCategorySection = (
    title: string,
    rootCats: any[],
    icon: React.ReactNode,
    headerColor: string,
    badgeColor: string,
    storeType: 'mewa' | 'jimmi'
  ) => (
    <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className={`px-6 py-4 border-b border-[#E6DEC8] flex items-center justify-between ${headerColor}`}>
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <span className="font-serif font-bold text-sm text-gray-900">{title}</span>
            <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeColor}`}>
              {rootCats.length} categories
            </span>
          </div>
        </div>
        <button
          onClick={() => handleOpenAdd(storeType)}
          className="px-3 py-1.5 bg-white border border-[#E6DEC8] hover:border-[#2F5D3A] text-[#2F5D3A] rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {/* Category List */}
      <div className="p-5 space-y-3">
        {catsLoading ? (
          <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F5D3A]" />
            <span>Loading...</span>
          </div>
        ) : rootCats.length === 0 ? (
          <div
            onClick={() => handleOpenAdd(storeType)}
            className="p-8 text-center text-gray-400 border-2 border-dashed border-[#E6DEC8] rounded-2xl cursor-pointer hover:border-[#2F5D3A] hover:text-[#2F5D3A] transition-all"
          >
            <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="font-medium text-xs">No categories yet — click to add one</p>
          </div>
        ) : (
          rootCats.map((cat: any) => {
            const children = categories.filter((c: any) => c.parentId === cat.id);
            return (
              <div key={cat.id} className="border border-[#E6DEC8] rounded-2xl p-3.5 bg-[#FAF6EC]/40 space-y-2">
                {/* Parent Category Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img
                        src={resolveImageUrl(cat.image)}
                        alt={cat.name}
                        className="w-10 h-10 object-cover rounded-xl border border-[#E6DEC8] bg-white shrink-0 shadow-2xs"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-400 shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-900 font-bold text-xs">{cat.name}</strong>
                        <span className="font-mono text-[10px] text-gray-400">/{cat.slug}</span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-[#4A4A4A] line-clamp-1 mt-0.5">{cat.description}</p>
                      )}
                      <span className="text-[11px] text-[#8C7B65] mt-0.5 block">
                        Order: {cat.displayOrder} • {cat._count?.products || 0} products linked
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setParentId(cat.id);
                        handleOpenAdd(storeType, cat.id);
                      }}
                      className="px-2.5 py-1 bg-white border border-[#E6DEC8] hover:border-[#D9A441] text-[#2F5D3A] rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Add child sub-category"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Subcategory</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-white cursor-pointer"
                      title="Edit category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"? Linked products will need reassigning.`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white cursor-pointer"
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
                          {sub.image && (
                            <img
                              src={resolveImageUrl(sub.image)}
                              alt={sub.name}
                              className="w-7 h-7 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )}
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
                            className="p-1 text-gray-400 hover:text-amber-600 rounded cursor-pointer"
                            title="Edit subcategory"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete subcategory "${sub.name}"?`)) {
                                deleteMutation.mutate(sub.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                            title="Delete subcategory"
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
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">Categories</h1>
          <p className="text-[#8C7B65] mt-0.5">
            Manage product categories for Mewa Masala Ghar and Jimmi Jaggu stores separately.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenAdd('mewa')}
            className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#23472C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E6DEC8] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#2F5D3A]" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Mewa Masala Ghar</p>
            <p className="font-bold text-gray-900 text-base">{mewaRootCategories.length} categories</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6DEC8] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Baby className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Jimmi Jaggu</p>
            <p className="font-bold text-gray-900 text-base">{jimmiRootCategories.length} categories</p>
          </div>
        </div>
      </div>

      {/* Mewa Masala Ghar Section */}
      {renderCategorySection(
        'Mewa Masala Ghar Categories',
        mewaRootCategories,
        <ShoppingBag className="w-4 h-4 text-[#2F5D3A]" />,
        'bg-green-50/50',
        'bg-green-100 text-green-800',
        'mewa'
      )}

      {/* Jimmi Jaggu Section */}
      {renderCategorySection(
        'Jimmi Jaggu Categories',
        jimmiRootCategories,
        <Baby className="w-4 h-4 text-purple-600" />,
        'bg-purple-50/50',
        'bg-purple-100 text-purple-800',
        'jimmi'
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-4">
              <h3 className="font-serif font-bold text-base text-gray-900">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
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

              {/* Store Selector — Which store does this category belong to? */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Add Category to Which Store? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStore('mewa')}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 font-bold text-xs cursor-pointer transition-all ${
                      selectedStore === 'mewa'
                        ? 'border-[#2F5D3A] bg-green-50 text-[#2F5D3A]'
                        : 'border-[#E6DEC8] bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Mewa Masala Ghar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStore('jimmi')}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 font-bold text-xs cursor-pointer transition-all ${
                      selectedStore === 'jimmi'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-[#E6DEC8] bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Baby className="w-4 h-4 shrink-0" />
                    <span>Jimmi Jaggu</span>
                  </button>
                </div>
              </div>

              {/* Parent Category (optional) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Parent Category (Optional)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl font-medium"
                >
                  <option value="">None (Top-level Parent Category)</option>
                  {(selectedStore === 'mewa' ? mewaRootCategories : jimmiRootCategories)
                    .filter((c: any) => c.id !== editingCategory?.id)
                    .map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Category Name */}
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
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of items in this category..."
                  className="w-full px-3 py-2 bg-white border border-[#E6DEC8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* System Image Upload */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Image (Upload from Computer)</label>
                <input
                  type="file"
                  ref={categoryFileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleCategoryFileUpload}
                  className="hidden"
                />

                {image ? (
                  <div className="p-3 bg-[#FAF6EC] border border-[#E6DEC8] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(image)}
                        alt="Uploaded preview"
                        className="w-16 h-16 object-cover rounded-xl border border-[#E6DEC8] bg-white shrink-0 shadow-xs"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div>
                        <span className="font-bold text-gray-900 block text-xs">Image uploaded</span>
                        <span className="text-[11px] text-gray-500 font-mono break-all">{image}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => categoryFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-3 py-1.5 bg-white border border-[#2F5D3A] text-[#2F5D3A] hover:bg-[#2F5D3A]/5 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-[#E6DEC8] hover:border-[#2F5D3A] rounded-2xl bg-white/70 hover:bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-[#2F5D3A]" />
                        <span className="font-bold text-gray-700 text-xs">Uploading from your system...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] group-hover:bg-[#2F5D3A]/10 text-[#2F5D3A] flex items-center justify-center transition-colors">
                          <Upload className="w-5 h-5 text-[#2F5D3A]" />
                        </div>
                        <span className="font-bold text-gray-800 text-xs">
                          Click to Upload Image from Computer
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Supports PNG, JPG, WEBP (Max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E6DEC8] rounded-xl font-bold text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F5D3A] text-white rounded-xl font-bold hover:bg-[#23472C] cursor-pointer"
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

export const CategoriesPage = CategoriesStoresPage;
