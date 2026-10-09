import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Upload,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api';

const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any | null;
  storesList?: any[];
  brandsList?: any[];
  initialBrand?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  storesList = [],
  brandsList: propBrandsList = [],
  initialBrand = 'mewa-masala-ghar',
}) => {
  const isEditing = !!productToEdit;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Categories list from API
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  // Primary Requested Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<string | number>('299');
  const [mrp, setMrp] = useState<string | number>('350');
  const [description, setDescription] = useState('');

  // Image Upload State (From System ONLY, NO URL)
  const [images, setImages] = useState<{ url: string; altText: string; isPrimary: boolean }[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Optional / Advanced Settings State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [weightGrams, setWeightGrams] = useState<string | number>('250');
  const [stockQty, setStockQty] = useState<string | number>('50');
  const [hsnCode, setHsnCode] = useState('0801');
  const [gstRate, setGstRate] = useState<number>(12);
  const [shortDescription, setShortDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [slug, setSlug] = useState('');

  // Fetch all categories for the dropdown
  useEffect(() => {
    if (isOpen) {
      api.get('/admin/categories')
        .then((res) => {
          if (res.data?.data) {
            setCategoriesList(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Load existing product data if editing, or set clean defaults
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategoryId(productToEdit.categoryId || '');
      setDescription(productToEdit.description || '');
      setShortDescription(productToEdit.shortDescription || '');
      setSlug(productToEdit.slug || '');
      setHsnCode(productToEdit.hsnCode || '0801');
      setGstRate(productToEdit.gstRate || 12);
      setIsFeatured(Boolean(productToEdit.isFeatured));
      setIsBestSeller(Boolean(productToEdit.isBestSeller));

      const primaryVar = productToEdit.variants?.[0];
      setPrice(primaryVar?.price !== undefined ? primaryVar.price : 299);
      setMrp(primaryVar?.mrp !== undefined ? primaryVar.mrp : 350);
      setStockQty(primaryVar?.stockQty !== undefined ? primaryVar.stockQty : 50);
      setWeightGrams(primaryVar?.weightGrams !== undefined ? primaryVar.weightGrams : 250);

      if (productToEdit.images && productToEdit.images.length > 0) {
        setImages(
          productToEdit.images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || `${productToEdit.name} image`,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          }))
        );
      } else {
        setImages([]);
      }
    } else {
      // Clean blank state for adding new product
      setName('');
      setCategoryId(categoriesList[0]?.id || '');
      setPrice('299');
      setMrp('350');
      setDescription('');
      setShortDescription('');
      setSlug('');
      setWeightGrams('250');
      setStockQty('50');
      setHsnCode('0801');
      setGstRate(12);
      setIsFeatured(false);
      setIsBestSeller(false);
      setImages([]);
    }
    setErrorMessage(null);
  }, [productToEdit, isOpen, categoriesList]);

  // Handle System File Upload (NO URL, Direct from Computer)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.data?.url) {
        const uploadedUrl = res.data.data.url;
        setImages((prev) => [
          ...prev,
          {
            url: uploadedUrl,
            altText: `${name || 'Product'} image ${prev.length + 1}`,
            isPrimary: prev.length === 0,
          },
        ]);
      } else {
        setErrorMessage('Failed to upload image file.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error uploading file from system.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const makeImagePrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Submit Handler
  const handleSubmit = async (publishStatus: boolean) => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Please select a category from the dropdown.');
      return;
    }

    const numericPrice = parseFloat(String(price));
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage('Please enter a valid product price.');
      return;
    }

    const selectedCat = categoriesList.find((c) => c.id === categoryId);
    const resolvedStoreId = selectedCat?.storeId || storesList[0]?.id;

    setLoading(true);

    try {
      const payload: any = {
        name: name.trim(),
        categoryId,
        storeId: resolvedStoreId,
        brandId: selectedCat?.brandId || undefined,
        price: numericPrice,
        mrp: parseFloat(String(mrp)) || numericPrice,
        description: description.trim() || `${name.trim()} - Premium authentic selection.`,
        shortDescription: shortDescription.trim() || undefined,
        slug: slug.trim() || undefined,
        hsnCode: hsnCode || '0801',
        gstRate: Number(gstRate) || 12,
        isFeatured,
        isBestSeller,
        isActive: publishStatus,
        stockQty: parseInt(String(stockQty), 10) || 50,
        weightGrams: parseInt(String(weightGrams), 10) || 250,
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText || `${name.trim()} view ${idx + 1}`,
          isPrimary: img.isPrimary,
          displayOrder: idx,
        })),
        variants: [
          {
            id: productToEdit?.variants?.[0]?.id || undefined,
            name: `${name.trim()} Standard Pack`,
            weightGrams: parseInt(String(weightGrams), 10) || 250,
            packQty: 1,
            sku: productToEdit?.variants?.[0]?.sku || `MMG-${Date.now().toString().slice(-6)}-1`,
            mrp: parseFloat(String(mrp)) || numericPrice,
            price: numericPrice,
            gstPercent: Number(gstRate) || 12,
            stockQty: parseInt(String(stockQty), 10) || 50,
            isDefault: true,
            isActive: true,
          },
        ],
      };

      if (isEditing) {
        await api.put(`/admin/products/${productToEdit.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save product. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-[#8C7B65] mt-0.5">
              Enter product name, select category, set price, add description, and upload product image.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-5 text-xs">
          {/* 1. Product Name */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div>
              <label className="block font-bold text-gray-800 mb-1.5 text-xs">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Jumbo Cashews W-240"
                className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
              />
            </div>

            {/* 2. Category Dropdown List */}
            <div>
              <label className="block font-bold text-gray-800 mb-1.5 text-xs">
                Product Category (Choose which category to add to) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-medium text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
              >
                <option value="">-- Select Category from Dropdown --</option>
                {categoriesList.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.store?.name ? `(${c.store.name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Price & MRP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1.5 text-xs">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="299"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5 text-xs">
                  Original MRP (₹) (Optional strikethrough price)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="350"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. Product Description */}
            <div>
              <label className="block font-bold text-gray-800 mb-1.5 text-xs">
                Product Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter complete product description, benefits, taste profile, and details..."
                className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
              />
            </div>
          </div>

          {/* 5. Product Image Upload from Computer (NO URL) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block font-bold text-gray-800 text-xs">
                  Product Image (Upload from Computer)
                </label>
                <p className="text-[11px] text-[#8C7B65] mt-0.5">
                  Select photo directly from your system or device. No web URL required.
                </p>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/jpg,image/avif"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-4 py-2 bg-[#FAF6EC] border border-[#D9A441] text-[#2F5D3A] hover:bg-amber-100/70 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 self-start sm:self-auto cursor-pointer"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F5D3A]" />
                    <span>Uploading from system...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>Upload Image from Computer</span>
                  </>
                )}
              </button>
            </div>

            {/* Images Preview Gallery */}
            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-[#E6DEC8] hover:border-[#2F5D3A] rounded-2xl text-center bg-[#FAF6EC]/40 hover:bg-[#FAF6EC] cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DEC8] text-[#2F5D3A] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 text-[#2F5D3A]" />
                </div>
                <span className="font-bold text-gray-800 text-xs">
                  Click here to upload product image from computer
                </span>
                <span className="text-[11px] text-gray-400">
                  Supports JPG, PNG, WEBP, AVIF (Max 5MB)
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-[#FAF6EC] p-2.5 rounded-2xl border transition-all ${
                      img.isPrimary ? 'border-[#D9A441] ring-2 ring-[#D9A441]/25 shadow-xs' : 'border-[#E6DEC8]'
                    }`}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                      <img
                        src={resolveImageUrl(img.url)}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (img.url && !target.src.includes('localhost:5000') && !img.url.startsWith('http')) {
                            target.src = `http://localhost:5000${img.url.startsWith('/') ? '' : '/'}${img.url}`;
                          }
                        }}
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 bg-[#D9A441] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-white" /> Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => makeImagePrimary(idx)}
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          img.isPrimary ? 'text-[#D9A441]' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${img.isPrimary ? 'fill-[#D9A441]' : ''}`} />
                        <span>{img.isPrimary ? 'Main' : 'Make Main'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional: Advanced Details Accordion */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between text-left font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>More Product Details (Weight, Stock, HSN, Tax Rate)</span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-5 pt-0 border-t border-[#E6DEC8] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Package Weight (Grams)</label>
                    <input
                      type="number"
                      value={weightGrams}
                      onChange={(e) => setWeightGrams(e.target.value)}
                      placeholder="250"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Stock Quantity (Units)</label>
                    <input
                      type="number"
                      value={stockQty}
                      onChange={(e) => setStockQty(e.target.value)}
                      placeholder="50"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">HSN Code</label>
                    <input
                      type="text"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      placeholder="0801"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">GST Tax Rate (%)</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5% (Whole Raw Spices)</option>
                      <option value={12}>12% (Dry Fruits, Makhana, Seeds)</option>
                      <option value={18}>18% (Processed Foods / Skincare)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-[#2F5D3A] rounded accent-[#2F5D3A]"
                    />
                    <span>Mark as Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="w-4 h-4 text-[#D9A441] rounded accent-[#D9A441]"
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-[#E6DEC8] flex items-center justify-end gap-3 sticky bottom-0 bg-[#FAF6EC] z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#E6DEC8] text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="px-6 py-2.5 bg-[#2F5D3A] text-white font-bold rounded-xl hover:bg-[#23472C] text-xs flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
