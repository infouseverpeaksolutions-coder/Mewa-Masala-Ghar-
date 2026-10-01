import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Filter,
  Check,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { ProductFormModal } from '../components/ProductFormModal';

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'mewa-masala-ghar' | 'jimmi-jaggu'>('mewa-masala-ghar');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Modals & Forms
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Bulk Selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // CSV Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importReport, setImportReport] = useState<any | null>(null);

  // Fetch Brands for 2-Brand Options
  const { data: brandsList = [] } = useQuery({
    queryKey: ['admin-brands-list'],
    queryFn: async () => {
      const res = await api.get('/brands');
      return res.data?.data || [];
    },
  });

  // Fetch Stores for filtering
  const { data: storesList = [] } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      return res.data?.data || [];
    },
  });

  // Fetch Categories for filtering
  const { data: categoriesList = [] } = useQuery({
    queryKey: ['admin-categories-list', selectedBrand, selectedStore],
    queryFn: async () => {
      let url = '/admin/categories';
      if (selectedStore !== 'all') {
        const s = storesList.find((st: any) => st.slug === selectedStore);
        if (s) url += `?storeId=${s.id}`;
      }
      const res = await api.get(url);
      const allCats = res.data?.data || [];
      if (selectedBrand === 'mewa-masala-ghar') {
        return allCats.filter(
          (c: any) => c.brand?.slug === 'mewa-masala-ghar' || !c.brandId || c.store?.slug === 'foods'
        );
      }
      if (selectedBrand === 'jimmi-jaggu') {
        return allCats.filter(
          (c: any) => c.brand?.slug === 'jimmi-jaggu' || c.store?.slug === 'baby' || c.store?.slug === 'care'
        );
      }
      return allCats;
    },
  });

  // Fetch Products with Brand Filter
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', selectedBrand, selectedStore, selectedCategory, statusFilter, search],
    queryFn: async () => {
      let url = '/admin/products?limit=150';
      if (selectedBrand !== 'all') url += `&brand=${selectedBrand}`;
      if (selectedStore !== 'all') url += `&store=${selectedStore}`;
      if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
      if (statusFilter !== 'all') url += `&active=${statusFilter === 'active'}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data?.data?.products as Product[];
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-brands-list'] });
    },
  });

  // Quick toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/admin/products/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  // Bulk Action Mutation
  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, ids }: { action: 'activate' | 'deactivate' | 'delete'; ids: string[] }) => {
      await Promise.all(
        ids.map((id) => {
          if (action === 'delete') return api.delete(`/admin/products/${id}`);
          return api.put(`/admin/products/${id}`, { isActive: action === 'activate' });
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-brands-list'] });
      setSelectedProductIds([]);
    },
  });

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/products/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mewa_masala_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export catalog CSV.');
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const headers = 'Store,Category,Product Name,Slug,Short Description,Description,Ingredients,Dietary Tags,Featured,BestSeller,Active,Storage Info,Shelf Life,Meta Title,Meta Description,SKU,Variant Name,Weight(g),Pack Qty,MRP,Selling Price,GST%,Stock\r\n';
    const sampleRow1 = 'foods,dry-fruits-combos,"Royal Afghan Anjeer Figs",royal-afghan-anjeer,"Handpicked premium sun-dried figs","Rich in calcium and fiber, authentic Afghan figs","100% Raw Figs","Vegan,Preservative-Free",TRUE,TRUE,TRUE,"Store in cool dry place","9 Months","Buy Royal Afghan Anjeer Online | Mewa Masala Ghar","Authentic sun dried figs online",MMG-FIG-250,"250g Pouch",250,1,450,380,12,50\r\n';
    const sampleRow2 = 'foods,dry-fruits-combos,"Royal Afghan Anjeer Figs",royal-afghan-anjeer,"Handpicked premium sun-dried figs","Rich in calcium and fiber, authentic Afghan figs","100% Raw Figs","Vegan,Preservative-Free",TRUE,TRUE,TRUE,"Store in cool dry place","9 Months","Buy Royal Afghan Anjeer Online | Mewa Masala Ghar","Authentic sun dried figs online",MMG-FIG-500,"500g Value Pack",500,1,850,720,12,35\r\n';
    const blob = new Blob([headers + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_product_import.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import CSV Submit
  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    setImportReport(null);

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const res = await api.post('/admin/products/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportReport(res.data?.data);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error processing CSV import.');
    } finally {
      setImportLoading(false);
    }
  };

  // Filter products by stock in-memory if requested
  const filteredProducts = (productsData || []).filter((p) => {
    if (stockFilter === 'all') return true;
    const totalStock = p.variants?.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0) || 0;
    if (stockFilter === 'out') return totalStock <= 0;
    if (stockFilter === 'low') return totalStock > 0 && totalStock <= 10;
    if (stockFilter === 'in') return totalStock > 10;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const mewaBrandData = brandsList.find((b: any) => b.slug === 'mewa-masala-ghar');
  const jimmiBrandData = brandsList.find((b: any) => b.slug === 'jimmi-jaggu');
  const mewaCount = mewaBrandData?._count?.products ?? 20;
  const jimmiCount = jimmiBrandData?._count?.products ?? 4;

  return (
    <div className="space-y-6">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">Products Catalog</h1>
          <p className="text-xs text-[#8C7B65] mt-0.5">
            Manage multi-brand catalog (Mewa Masala Ghar & Jimmi Jaggu), 4:5 image ratio, variants, and stock.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-[#E6DEC8] hover:border-[#D9A441] text-[#2B2B2B] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Download full catalog CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#2F5D3A]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setImportFile(null);
              setImportReport(null);
              setImportModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white border border-[#E6DEC8] hover:border-[#D9A441] text-[#2B2B2B] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormModalOpen(true);
            }}
            className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#23472C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Brand Selection: 2 Distinct Brand Options + All Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Option 1: Mewa Masala Ghar */}
        <button
          type="button"
          onClick={() => {
            setSelectedBrand('mewa-masala-ghar');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
            selectedBrand === 'mewa-masala-ghar'
              ? 'bg-[#2F5D3A] text-white border-[#2F5D3A] shadow-md ring-2 ring-[#2F5D3A]/30'
              : 'bg-white hover:bg-[#FAF6EC] border-[#E6DEC8] text-gray-800'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs ${
                selectedBrand === 'mewa-masala-ghar'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#2F5D3A]/10 text-[#2F5D3A]'
              }`}
            >
              🌿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm">Mewa Masala Ghar</span>
                {selectedBrand === 'mewa-masala-ghar' && (
                  <span className="px-1.5 py-0.2 bg-[#D9A441] text-[#2B2B2B] text-[9px] font-bold rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-[11px] mt-0.5 line-clamp-1 ${
                  selectedBrand === 'mewa-masala-ghar' ? 'text-emerald-100' : 'text-[#8C7B65]'
                }`}
              >
                Dry Fruits, Seeds, Makhana, Spices & Poshan
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
                selectedBrand === 'mewa-masala-ghar'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-50 text-[#2F5D3A] border border-emerald-200'
              }`}
            >
              {mewaCount} Items
            </span>
          </div>
        </button>

        {/* Option 2: Jimmi Jaggu */}
        <button
          type="button"
          onClick={() => {
            setSelectedBrand('jimmi-jaggu');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
            selectedBrand === 'jimmi-jaggu'
              ? 'bg-[#B97375] text-white border-[#B97375] shadow-md ring-2 ring-[#B97375]/30'
              : 'bg-white hover:bg-[#FAF6EC] border-[#E6DEC8] text-gray-800'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs ${
                selectedBrand === 'jimmi-jaggu'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#B97375]/10 text-[#B97375]'
              }`}
            >
              🍼
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm">Jimmi Jaggu</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    selectedBrand === 'jimmi-jaggu' ? 'bg-white/25 text-white' : 'bg-rose-100 text-[#B97375]'
                  }`}
                >
                  Sub-brand
                </span>
                {selectedBrand === 'jimmi-jaggu' && (
                  <span className="px-1.5 py-0.2 bg-white text-[#B97375] text-[9px] font-bold rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-[11px] mt-0.5 line-clamp-1 ${
                  selectedBrand === 'jimmi-jaggu' ? 'text-rose-100' : 'text-[#8C7B65]'
                }`}
              >
                Baby Food (Pratham Aahar), Multani Clays & Skincare
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
                selectedBrand === 'jimmi-jaggu'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-50 text-[#B97375] border border-rose-200'
              }`}
            >
              {jimmiCount} Items
            </span>
          </div>
        </button>

        {/* Option 3: All Brands Overview */}
        <button
          type="button"
          onClick={() => {
            setSelectedBrand('all');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
            selectedBrand === 'all'
              ? 'bg-[#2B2B2B] text-white border-[#2B2B2B] shadow-md ring-2 ring-gray-600/30'
              : 'bg-white hover:bg-[#FAF6EC] border-[#E6DEC8] text-gray-800'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs ${
                selectedBrand === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              🏪
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm">All Brands Combined</span>
                {selectedBrand === 'all' && (
                  <span className="px-1.5 py-0.2 bg-white text-gray-900 text-[9px] font-bold rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-[11px] mt-0.5 line-clamp-1 ${
                  selectedBrand === 'all' ? 'text-gray-300' : 'text-[#8C7B65]'
                }`}
              >
                Full inventory across MMG and Jimmi Jaggu
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
                selectedBrand === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              {mewaCount + jimmiCount} Total
            </span>
          </div>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Store select */}
          <select
            value={selectedStore}
            onChange={(e) => {
              setSelectedStore(e.target.value);
              setSelectedCategory('all');
            }}
            className="px-3 py-1.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="all">All Departments</option>
            <option value="foods">Mewa & Healthy Foods</option>
            <option value="baby">Baby & Family Nutrition</option>
            <option value="care">Personal Care & Clays</option>
          </select>

          {/* Category select (Filtered by Brand) */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="all">
              All Categories {selectedBrand !== 'all' ? `(${selectedBrand === 'jimmi-jaggu' ? 'Jimmi Jaggu' : 'Mewa Masala'})` : ''}
            </option>
            {categoriesList.map((cat: any) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="all">Stock: All</option>
            <option value="in">In Stock (&gt;10)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="all">Status: All</option>
            <option value="active">Active Published</option>
            <option value="inactive">Inactive Draft</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or brand..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#FAF6EC] border border-[#D9A441] p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2F5D3A]">{selectedProductIds.length} items selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkActionMutation.mutate({ action: 'activate', ids: selectedProductIds })}
              className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg font-bold hover:bg-emerald-50"
            >
              Activate
            </button>
            <button
              onClick={() => bulkActionMutation.mutate({ action: 'deactivate', ids: selectedProductIds })}
              className="px-3 py-1 bg-white border border-amber-300 text-amber-800 rounded-lg font-bold hover:bg-amber-50"
            >
              Deactivate
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${selectedProductIds.length} selected products?`)) {
                  bulkActionMutation.mutate({ action: 'delete', ids: selectedProductIds });
                }
              }}
              className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded-lg font-bold hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2F5D3A]" />
            <span>Loading products catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-3">
            <Package className="w-10 h-10 text-gray-300" />
            <span className="font-semibold text-gray-700 text-sm">No products found matching filters.</span>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormModalOpen(true);
              }}
              className="px-4 py-2 bg-[#2F5D3A] text-white font-bold rounded-xl text-xs"
            >
              Create New Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-[#FAF6EC] text-[#8C7B65] uppercase font-bold border-b border-[#E6DEC8]">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-[#2F5D3A] accent-[#2F5D3A]"
                    />
                  </th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Store & Category</th>
                  <th className="p-3.5">Variants</th>
                  <th className="p-3.5">Price Range</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Badges</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const primaryImg = p.images?.find((img) => img.isPrimary)?.url || p.images?.[0]?.url || '/placeholder.png';
                  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stockQty || 0), 0) || 0;
                  const prices = p.variants?.map((v: any) => v.price) || [0];
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const isSelected = selectedProductIds.includes(p.id);

                  return (
                    <tr key={p.id} className={`hover:bg-amber-50/20 ${isSelected ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(p.id)}
                          className="w-4 h-4 rounded text-[#2F5D3A] accent-[#2F5D3A]"
                        />
                      </td>

                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-12 sm:w-14 aspect-[4/5] rounded-xl overflow-hidden border border-[#E6DEC8] shrink-0 bg-white shadow-2xs relative">
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <strong className="text-gray-900 block font-serif font-bold text-xs hover:text-[#2F5D3A]">
                            {p.name}
                          </strong>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {p.brand?.slug === 'jimmi-jaggu' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FBEAE4] text-[#B97375] border border-[#B97375]/30 shadow-2xs">
                                🍼 Jimmi Jaggu
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#2F5D3A] border border-emerald-200 shadow-2xs">
                                🌿 Mewa Masala
                              </span>
                            )}
                            <span className="text-gray-400 font-mono text-[10px]">{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-gray-800 block">{p.store?.name}</span>
                        <span className="text-[11px] text-[#8C7B65]">{p.category?.name}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-gray-900">{p.variants?.length || 0} variant(s)</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-[#2F5D3A] text-xs">
                          {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] inline-block ${
                            totalStock <= 0
                              ? 'bg-red-100 text-red-800'
                              : totalStock <= 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {totalStock <= 0 ? 'Out of stock' : `${totalStock} units`}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Featured
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => toggleActiveMutation.mutate({ id: p.id, isActive: p.isActive === false })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            p.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {p.isActive !== false ? '● Active' : '○ Draft'}
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <a
                          href={`http://localhost:5173/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#2F5D3A] rounded-lg hover:bg-gray-100 inline-block cursor-pointer"
                          title="View on storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setFormModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                          title="Edit product, variants & images"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['admin-brands-list'] });
        }}
        productToEdit={editingProduct}
        storesList={storesList}
        brandsList={brandsList}
        initialBrand={selectedBrand === 'jimmi-jaggu' ? 'jimmi-jaggu' : 'mewa-masala-ghar'}
      />

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#2F5D3A]" />
                <h3 className="font-serif font-bold text-base text-gray-900">Bulk Product CSV Import</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Upload a standard UTF-8 CSV file containing products and variants. If a product slug exists, it will be updated; otherwise, a new SKU will be created.
            </p>

            <div className="p-4 bg-white rounded-2xl border border-[#E6DEC8] mb-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-800 block">Need the exact CSV layout?</span>
                <span className="text-[11px] text-gray-500">Includes all required columns and sample rows.</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCSV}
                className="px-3 py-1.5 bg-[#FAF6EC] border border-[#D9A441] text-[#2F5D3A] rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#FAF6EC]/80"
              >
                <Download className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Sample CSV</span>
              </button>
            </div>

            <form onSubmit={handleImportCSV} className="space-y-4">
              <div className="border-2 border-dashed border-[#E6DEC8] rounded-2xl p-6 text-center bg-white hover:border-[#2F5D3A] transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2F5D3A] file:text-white hover:file:bg-[#23472C]"
                />
                {importFile && (
                  <p className="mt-2 text-[11px] text-[#2F5D3A] font-semibold">
                    Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Import Validation Report */}
              {importReport && (
                <div className="p-4 bg-white rounded-2xl border border-[#E6DEC8] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-800">Processing Summary</span>
                    <span className="text-xs font-semibold text-[#2F5D3A]">
                      {importReport.imported} of {importReport.totalRows} succeeded
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 font-bold">
                      {importReport.imported} Imported / Updated
                    </div>
                    <div className="p-2 bg-red-50 rounded-xl border border-red-100 text-red-800 font-bold">
                      {importReport.failed} Failed Rows
                    </div>
                  </div>

                  {importReport.errors?.length > 0 && (
                    <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] text-red-600 bg-red-50/50 p-2.5 rounded-xl">
                      {importReport.errors.map((err: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>
                            Row {err.row} [{err.field}]: {err.reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E6DEC8] rounded-xl font-bold text-gray-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!importFile || importLoading}
                  className="px-5 py-2 bg-[#2F5D3A] text-white rounded-xl font-bold hover:bg-[#23472C] disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {importLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Start Validation & Import</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

