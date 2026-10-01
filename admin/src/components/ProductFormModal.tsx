import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Star,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Globe,
  Upload,
} from 'lucide-react';
import api from '../services/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any | null;
  storesList: any[];
  brandsList?: any[];
  initialBrand?: string;
}

const DIETARY_OPTIONS = [
  'Vegan',
  'Gluten-Free',
  '100% Organic',
  'Keto-Friendly',
  'Sugar-Free',
  'Jain Friendly',
  'Preservative-Free',
  'Rich in Protein',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  storesList,
  brandsList: propBrandsList = [],
  initialBrand = 'mewa-masala-ghar',
}) => {
  const isEditing = !!productToEdit;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Brands State
  const [brands, setBrands] = useState<any[]>(propBrandsList);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>(initialBrand);
  const [brandId, setBrandId] = useState<string>('');

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [storeId, setStoreId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [hsnCode, setHsnCode] = useState('0801');
  const [gstRate, setGstRate] = useState(12);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [storageInfo, setStorageInfo] = useState('Store in an airtight container in a cool, dry place away from direct sunlight.');
  const [shelfLife, setShelfLife] = useState('9 Months from packaging date');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Images state
  const [images, setImages] = useState<{ url: string; altText: string; isPrimary: boolean }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants state
  const [variants, setVariants] = useState<any[]>([
    {
      id: undefined,
      name: '250g Pouch',
      weightGrams: 250,
      packQty: 1,
      sku: `MMG-${Date.now().toString().slice(-6)}-1`,
      mrp: 350,
      price: 299,
      gstPercent: 12,
      stockQty: 50,
      isDefault: true,
      isActive: true,
    },
  ]);

  // Sync Brands from prop or API
  useEffect(() => {
    if (propBrandsList && propBrandsList.length > 0) {
      setBrands(propBrandsList);
    } else {
      api.get('/brands')
        .then((res) => {
          if (res.data?.data) setBrands(res.data.data);
        })
        .catch(() => {});
    }
  }, [propBrandsList, isOpen]);

  // Categories dynamically filtered for the active brand
  const activeBrandObj = brands.find((b) => b.slug === selectedBrandSlug);
  const availableCategories: any[] = React.useMemo(() => {
    if (activeBrandObj?.categories && activeBrandObj.categories.length > 0) {
      return activeBrandObj.categories;
    }
    if (selectedBrandSlug === 'jimmi-jaggu') {
      const babyStore = storesList.find((s) => s.slug === 'baby');
      const careStore = storesList.find((s) => s.slug === 'care');
      return [
        ...(babyStore?.categories || []),
        ...(careStore?.categories || []),
      ];
    } else {
      const foodsStore = storesList.find((s) => s.slug === 'foods');
      return foodsStore?.categories || storesList.flatMap((s) => s.categories || []);
    }
  }, [activeBrandObj, selectedBrandSlug, storesList]);

  // Handle switching between the 2 brands in the form
  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrandSlug(brandSlug);
    const targetBrand = brands.find((b) => b.slug === brandSlug);
    if (targetBrand) {
      setBrandId(targetBrand.id);
      const bCats = targetBrand.categories || [];
      if (bCats.length > 0) {
        setCategoryId(bCats[0].id);
        if (bCats[0].storeId) {
          setStoreId(bCats[0].storeId);
        }
      }
    } else {
      if (brandSlug === 'jimmi-jaggu') {
        const babyStore = storesList.find((s) => s.slug === 'baby') || storesList.find((s) => s.slug === 'care');
        if (babyStore) {
          setStoreId(babyStore.id);
          if (babyStore.categories?.length > 0) setCategoryId(babyStore.categories[0].id);
        }
      } else {
        const foodsStore = storesList.find((s) => s.slug === 'foods');
        if (foodsStore) {
          setStoreId(foodsStore.id);
          if (foodsStore.categories?.length > 0) setCategoryId(foodsStore.categories[0].id);
        }
      }
    }
  };

  // Sync state on open or productToEdit change
  useEffect(() => {
    if (productToEdit) {
      const pBrandSlug =
        productToEdit.brand?.slug ||
        (productToEdit.brandId === brands.find((b) => b.slug === 'jimmi-jaggu')?.id ? 'jimmi-jaggu' : 'mewa-masala-ghar');

      setSelectedBrandSlug(pBrandSlug);
      setBrandId(productToEdit.brandId || productToEdit.brand?.id || '');
      setStoreId(productToEdit.storeId || '');
      setCategoryId(productToEdit.categoryId || '');
      setName(productToEdit.name || '');
      setSlug(productToEdit.slug || '');
      setHsnCode(productToEdit.hsnCode || '0801');
      setGstRate(productToEdit.gstRate || 12);
      setShortDescription(productToEdit.shortDescription || '');
      setDescription(productToEdit.description || '');
      setIngredients(productToEdit.ingredients || '');
      setStorageInfo(productToEdit.storageInfo || 'Store in airtight container in a cool, dry place.');
      setShelfLife(productToEdit.shelfLife || '9 Months from packaging date');
      setIsFeatured(Boolean(productToEdit.isFeatured));
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsActive(productToEdit.isActive !== undefined ? Boolean(productToEdit.isActive) : true);
      setDietaryTags(Array.isArray(productToEdit.dietaryTags) ? productToEdit.dietaryTags : []);
      setMetaTitle(productToEdit.metaTitle || '');
      setMetaDescription(productToEdit.metaDescription || '');

      if (productToEdit.images && productToEdit.images.length > 0) {
        setImages(
          productToEdit.images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || `${productToEdit.name} view ${idx + 1}`,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          }))
        );
      } else {
        setImages([]);
      }

      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setVariants(
          productToEdit.variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            weightGrams: v.weightGrams,
            packQty: v.packQty || 1,
            sku: v.sku,
            mrp: v.mrp,
            price: v.price,
            gstPercent: v.gstPercent || 12,
            stockQty: v.stockQty !== undefined ? v.stockQty : 50,
            isDefault: v.isDefault,
            isActive: v.isActive !== undefined ? v.isActive : true,
          }))
        );
      }
    } else {
      // Default new product
      const startBrand = initialBrand === 'jimmi-jaggu' ? 'jimmi-jaggu' : 'mewa-masala-ghar';
      setSelectedBrandSlug(startBrand);
      const bObj = brands.find((b) => b.slug === startBrand);
      if (bObj) {
        setBrandId(bObj.id);
        const bCats = bObj.categories || [];
        if (bCats.length > 0) {
          setCategoryId(bCats[0].id);
          if (bCats[0].storeId) setStoreId(bCats[0].storeId);
        }
      } else if (storesList && storesList.length > 0) {
        setStoreId(storesList[0].id);
        if (storesList[0].categories?.length > 0) {
          setCategoryId(storesList[0].categories[0].id);
        }
      }

      setName('');
      setSlug('');
      setHsnCode(startBrand === 'jimmi-jaggu' ? '3304' : '0801');
      setGstRate(startBrand === 'jimmi-jaggu' ? 18 : 12);
      setShortDescription('');
      setDescription('');
      setIngredients('');
      setStorageInfo('Store in an airtight container in a cool, dry place away from direct sunlight.');
      setShelfLife('9 Months from packaging date');
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsActive(true);
      setDietaryTags(startBrand === 'jimmi-jaggu' ? ['100% Organic', 'Cruelty-Free', 'Preservative-Free'] : ['Vegan', '100% Organic']);
      setMetaTitle('');
      setMetaDescription('');
      setImages([
        {
          url: startBrand === 'jimmi-jaggu' ? '/jimmi-jaggu/cat_care.png' : 'https://images.unsplash.com/photo-1508061252445-5350f3777130?auto=format&fit=crop&w=800&q=80',
          altText: 'Product primary front photo',
          isPrimary: true,
        },
      ]);
      setVariants([
        {
          name: startBrand === 'jimmi-jaggu' ? '200g Eco Jar' : '250g Pouch',
          weightGrams: startBrand === 'jimmi-jaggu' ? 200 : 250,
          packQty: 1,
          sku: `${startBrand === 'jimmi-jaggu' ? 'JJ' : 'MMG'}-${Date.now().toString().slice(-6)}-1`,
          mrp: 399,
          price: 349,
          gstPercent: startBrand === 'jimmi-jaggu' ? 18 : 12,
          stockQty: 50,
          isDefault: true,
          isActive: true,
        },
      ]);
    }
    setErrorMessage(null);
  }, [productToEdit, isOpen, storesList, brands, initialBrand]);

  // Handle Image File Upload directly via /api/upload
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
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
            altText: `${name || 'Product'} view ${prev.length + 1}`,
            isPrimary: prev.length === 0,
          },
        ]);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image file. Please verify file format and size.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Auto slug generation on name change
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generated);
      const brandName = selectedBrandSlug === 'jimmi-jaggu' ? 'Jimmi Jaggu' : 'Mewa Masala Ghar';
      setMetaTitle(`${val} | Buy Online | ${brandName}`);
      setMetaDescription(`Order authentic ${val} fresh from ${brandName}. Purity guaranteed with fast India-wide delivery.`);
    }
  };

  // Toggle dietary tag
  const toggleDietaryTag = (tag: string) => {
    if (dietaryTags.includes(tag)) {
      setDietaryTags(dietaryTags.filter((t) => t !== tag));
    } else {
      setDietaryTags([...dietaryTags, tag]);
    }
  };

  // Add Variant
  const handleAddVariant = () => {
    const nextIndex = variants.length + 1;
    setVariants([
      ...variants,
      {
        name: '500g Value Pack',
        weightGrams: 500,
        packQty: 1,
        sku: `MMG-${Date.now().toString().slice(-6)}-${nextIndex}`,
        mrp: 650,
        price: 549,
        gstPercent: gstRate,
        stockQty: 30,
        isDefault: false,
        isActive: true,
      },
    ]);
  };

  // Auto Generate Combos (2-pack, 4-pack, 6-pack)
  const handleGenerateCombos = () => {
    if (variants.length === 0) return;
    const base = variants[0];
    const baseWeight = base.weightGrams || 250;
    const basePrice = base.price || 299;
    const baseMrp = base.mrp || 350;

    const pack2 = {
      name: `Pack of 2 (${baseWeight}g x 2)`,
      weightGrams: baseWeight * 2,
      packQty: 2,
      sku: `${base.sku}-P2`,
      mrp: baseMrp * 2,
      price: Math.round(basePrice * 2 * 0.95), // 5% combo discount
      gstPercent: gstRate,
      stockQty: 25,
      isDefault: false,
      isActive: true,
    };

    const pack4 = {
      name: `Family Pack of 4 (${baseWeight}g x 4)`,
      weightGrams: baseWeight * 4,
      packQty: 4,
      sku: `${base.sku}-P4`,
      mrp: baseMrp * 4,
      price: Math.round(basePrice * 4 * 0.90), // 10% combo discount
      gstPercent: gstRate,
      stockQty: 15,
      isDefault: false,
      isActive: true,
    };

    const pack6 = {
      name: `Mega Hamper Pack of 6 (${baseWeight}g x 6)`,
      weightGrams: baseWeight * 6,
      packQty: 6,
      sku: `${base.sku}-P6`,
      mrp: baseMrp * 6,
      price: Math.round(basePrice * 6 * 0.85), // 15% combo discount
      gstPercent: gstRate,
      stockQty: 10,
      isDefault: false,
      isActive: true,
    };

    setVariants([...variants, pack2, pack4, pack6]);
  };

  // Update variant row
  const updateVariantRow = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // Remove variant row
  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) {
      alert('A product must have at least one variant.');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([
      ...images,
      {
        url: newImageUrl.trim(),
        altText: `${name} view ${images.length + 1}`,
        isPrimary: images.length === 0,
      },
    ]);
    setNewImageUrl('');
  };

  // Image Order Move
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
  };

  // Make Image Primary
  const makeImagePrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(updated);
  };

  // Remove Image
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  // Handle Form Submit
  const handleSubmit = async (publishStatus: boolean) => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }

    const finalCategoryId = categoryId || availableCategories[0]?.id;
    const finalStoreId = storeId || availableCategories.find(c => c.id === finalCategoryId)?.storeId || storesList[0]?.id;

    if (!finalStoreId || !finalCategoryId) {
      setErrorMessage('Please select both a Store and a Category.');
      return;
    }
    if (variants.length === 0) {
      setErrorMessage('At least one product variant is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        brandId: brandId || undefined,
        storeId: finalStoreId,
        categoryId: finalCategoryId,
        name: name.trim(),
        slug: slug.trim() || undefined,
        hsnCode,
        gstRate: Number(gstRate),
        shortDescription,
        description: description.trim() || `${name} premium authentic selection.`,
        ingredients,
        storageInfo,
        shelfLife,
        isFeatured,
        isBestSeller,
        isActive: publishStatus,
        dietaryTags,
        metaTitle,
        metaDescription,
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          displayOrder: idx,
        })),
        variants: variants.map((v, idx) => ({
          id: v.id,
          name: v.name,
          weightGrams: v.weightGrams ? parseInt(v.weightGrams, 10) : null,
          packQty: v.packQty ? parseInt(v.packQty, 10) : 1,
          sku: v.sku || `MMG-${Date.now().toString().slice(-6)}-${idx + 1}`,
          mrp: parseFloat(v.mrp) || parseFloat(v.price),
          price: parseFloat(v.price),
          gstPercent: parseFloat(v.gstPercent) || gstRate,
          stockQty: parseInt(v.stockQty, 10) || 50,
          isDefault: idx === 0,
          isActive: v.isActive !== undefined ? v.isActive : true,
        })),
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
      <div className="relative bg-[#FAF6EC] border border-[#E6DEC8] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-6 sticky top-0 bg-[#FAF6EC] z-10">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#2B2B2B]">
              {isEditing ? `Edit SKU: ${productToEdit.name}` : 'Create New Catalog Product'}
            </h2>
            <p className="text-xs text-[#8C7B65]">
              Configure brand association, multi-pack variants, inventory, 4:5 image gallery, GST, and SEO tags.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <div className="space-y-6 text-xs">
          {/* Section 1: Brand & Classification (2 Options for Both Brands) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">1. Brand & Category Classification</h3>
              <span className="text-[11px] text-[#8C7B65] font-medium">Select Brand to see brand-specific categories</span>
            </div>

            {/* Brand Selection: 2 Distinct Options */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Select Brand *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Brand Option 1: Mewa Masala Ghar */}
                <button
                  type="button"
                  onClick={() => handleBrandChange('mewa-masala-ghar')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    selectedBrandSlug === 'mewa-masala-ghar'
                      ? 'bg-emerald-50/80 border-[#2F5D3A] ring-2 ring-[#2F5D3A]/25 shadow-xs'
                      : 'bg-[#FAF6EC] border-[#E6DEC8] hover:border-emerald-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2F5D3A] text-white flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs">
                    🌿
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-xs">Mewa Masala Ghar</span>
                      {selectedBrandSlug === 'mewa-masala-ghar' && (
                        <span className="px-1.5 py-0.2 bg-[#2F5D3A] text-white text-[9px] font-bold rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8C7B65] mt-0.5 leading-snug">
                      Dry Fruits, Seeds, Makhana, Spices & Poshan
                    </p>
                  </div>
                </button>

                {/* Brand Option 2: Jimmi Jaggu */}
                <button
                  type="button"
                  onClick={() => handleBrandChange('jimmi-jaggu')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    selectedBrandSlug === 'jimmi-jaggu'
                      ? 'bg-[#FBEAE4]/80 border-[#B97375] ring-2 ring-[#B97375]/25 shadow-xs'
                      : 'bg-[#FAF6EC] border-[#E6DEC8] hover:border-[#B97375]/50 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#B97375] text-white flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs">
                    🍼
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-xs">Jimmi Jaggu (Sub-brand)</span>
                      {selectedBrandSlug === 'jimmi-jaggu' && (
                        <span className="px-1.5 py-0.2 bg-[#B97375] text-white text-[9px] font-bold rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8C7B65] mt-0.5 leading-snug">
                      Baby Care (Pratham Aahar), Multani Collection & Skincare
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Category & Store Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Category * ({availableCategories.length} available)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    const newCatId = e.target.value;
                    setCategoryId(newCatId);
                    const found = availableCategories.find((c: any) => c.id === newCatId);
                    if (found?.storeId) setStoreId(found.storeId);
                  }}
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-medium text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                >
                  {availableCategories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Department / Store *</label>
                <select
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-medium text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                >
                  {storesList?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Basic Details & India Compliance */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">2. Product Information & Tax</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Royal Jumbo Cashews W-240"
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="royal-jumbo-cashews-w-240"
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-mono text-xs"
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
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">GST Tax Rate (%) *</label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl font-medium"
                >
                  <option value={0}>0% (Exempt)</option>
                  <option value={5}>5% (Whole Raw Spices)</option>
                  <option value={12}>12% (Dry Fruits, Makhana, Seeds)</option>
                  <option value={18}>18% (Baby Care, Clays, Processed Mixes)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Short Tagline Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Handpicked supreme quality, naturally sun-dried and cholesterol free"
                className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe product harvesting, flavor profile, nutritional benefits, culinary uses..."
                className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ingredients</label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="100% Raw Cashews (No Additives)"
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Storage Info</label>
                <input
                  type="text"
                  value={storageInfo}
                  onChange={(e) => setStorageInfo(e.target.value)}
                  placeholder="Store in airtight glass container"
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Shelf Life</label>
                <input
                  type="text"
                  value={shelfLife}
                  onChange={(e) => setShelfLife(e.target.value)}
                  placeholder="9 Months from mfg"
                  className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Variant Table & Combo Builder */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">3. Product Variants & Combo Packs</h3>
                <p className="text-[11px] text-[#8C7B65]">
                  Manage SKU codes, pack weights, MRP, selling price, and stock levels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateCombos}
                  className="px-3 py-1.5 bg-[#FAF6EC] border border-[#D9A441] text-[#2F5D3A] rounded-xl font-bold text-[11px] hover:bg-[#FAF6EC]/80 flex items-center gap-1.5"
                  title="Auto create 2-pack, 4-pack, and 6-pack variants with savings discount"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Generate Combo Packs (2, 4, 6)</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 bg-[#2F5D3A] text-white rounded-xl font-bold text-[11px] hover:bg-[#23472C] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-[#FAF6EC] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-2.5">Pack Label</th>
                    <th className="p-2.5">Weight (g)</th>
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">MRP (₹)</th>
                    <th className="p-2.5">Price (₹)</th>
                    <th className="p-2.5">Stock</th>
                    <th className="p-2.5 text-center">Active</th>
                    <th className="p-2.5 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => updateVariantRow(idx, 'name', e.target.value)}
                          placeholder="250g Pack"
                          className="w-36 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={v.weightGrams || ''}
                          onChange={(e) => updateVariantRow(idx, 'weightGrams', e.target.value)}
                          placeholder="250"
                          className="w-20 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
                          className="w-32 px-2 py-1 bg-white border border-gray-300 rounded-lg font-mono text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={v.mrp}
                          onChange={(e) => updateVariantRow(idx, 'mrp', e.target.value)}
                          className="w-20 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariantRow(idx, 'price', e.target.value)}
                          className="w-20 px-2 py-1 bg-white border border-[#2F5D3A] rounded-lg font-bold text-[#2F5D3A] text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={v.stockQty}
                          onChange={(e) => updateVariantRow(idx, 'stockQty', e.target.value)}
                          className="w-20 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={v.isActive}
                          onChange={(e) => updateVariantRow(idx, 'isActive', e.target.checked)}
                          className="w-4 h-4 text-[#2F5D3A] rounded accent-[#2F5D3A]"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Image Uploader & 4:5 Aspect Ratio Gallery */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">4. Product Gallery & Images</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Main Website 4:5 Ratio Display
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7B65] mt-0.5">
                  Upload image files directly or paste web URLs. Each product image displays in 4:5 aspect ratio across the storefront.
                </p>
              </div>

              {/* Upload image button */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="px-3.5 py-2 bg-[#FAF6EC] border border-[#D9A441] text-[#2F5D3A] hover:bg-amber-100/60 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F5D3A]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>Upload Image File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Paste URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                placeholder="Or paste image URL (e.g. /foods/dry-fruits/almonds.jpg or https://...)..."
                className="flex-1 px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#2F5D3A] text-white rounded-xl font-bold hover:bg-[#23472C] flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
            </div>

            {images.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-[#E6DEC8] rounded-2xl text-center text-gray-400 flex flex-col items-center gap-2">
                <ImageIcon className="w-9 h-9 text-gray-300" />
                <span className="font-semibold text-xs text-gray-600">No images added yet.</span>
                <span className="text-[11px] text-gray-400">Click &quot;Upload Image File&quot; or paste an image URL above to preview.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-[#FAF6EC] p-2.5 rounded-2xl border transition-all ${
                      img.isPrimary ? 'border-[#D9A441] ring-2 ring-[#D9A441]/25 shadow-xs' : 'border-[#E6DEC8]'
                    }`}
                  >
                    {/* 4:5 Aspect Ratio Preview Container */}
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={img.altText}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 bg-black/65 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                        4:5 Ratio
                      </span>
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-[#D9A441] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-white" /> Primary
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <input
                        type="text"
                        value={img.altText}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[idx].altText = e.target.value;
                          setImages(updated);
                        }}
                        placeholder="Alt description"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
                      />

                      <div className="flex items-center justify-between text-gray-500 pt-1">
                        <button
                          type="button"
                          onClick={() => makeImagePrimary(idx)}
                          className={`flex items-center gap-1 text-[10px] font-bold cursor-pointer ${
                            img.isPrimary ? 'text-[#D9A441]' : 'hover:text-gray-900'
                          }`}
                          title="Set as primary thumbnail"
                        >
                          <Star className={`w-3.5 h-3.5 ${img.isPrimary ? 'fill-[#D9A441]' : ''}`} />
                          <span>{img.isPrimary ? 'Primary' : 'Make Star'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                            title="Move earlier"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'down')}
                            disabled={idx === images.length - 1}
                            className="p-1 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                            title="Move later"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 hover:text-red-600 cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Badges & Dietary Tags */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">5. Badges & Dietary Tags</h3>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#2F5D3A] rounded accent-[#2F5D3A]"
                />
                <span>Mark as Featured Product (Homepage Spotlight)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 text-[#D9A441] rounded accent-[#D9A441]"
                />
                <span>Mark as Bestseller (Top Seller Badge)</span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">Dietary & Quality Tags</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((tag) => {
                  const selected = dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selected
                          ? 'bg-[#2F5D3A] text-white border-[#2F5D3A]'
                          : 'bg-[#FAF6EC] text-gray-700 border-[#E6DEC8] hover:border-[#D9A441]'
                      }`}
                    >
                      {tag} {selected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 6: SEO Preview & Meta Tags */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#2F5D3A]">6. Search Engine Optimization (SEO)</h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Meta Title</label>
                <span className="text-[11px] text-gray-400">{metaTitle.length}/60 characters</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. Royal Afghani Anjeer Figs | Mewa Masala Ghar"
                className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Meta Description</label>
                <span className="text-[11px] text-gray-400">{metaDescription.length}/160 characters</span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Buy pure organic dry fruits online at Mewa Masala Ghar. Fresh APMC stock delivered right to your home."
                className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E6DEC8] rounded-xl text-xs"
              />
            </div>

            {/* Google Search Mock Preview */}
            <div className="p-4 bg-[#FAF6EC] rounded-2xl border border-[#E6DEC8]">
              <span className="text-[10px] font-bold text-[#8C7B65] uppercase tracking-wider block mb-1">
                Google Search Result Snippet Preview
              </span>
              <div className="font-sans">
                <span className="text-xs text-[#202124] block truncate">
                  https://mewamasalaghar.com/products/{slug || 'product-slug'}
                </span>
                <span className="text-sm font-semibold text-[#1a0dab] block hover:underline cursor-pointer">
                  {metaTitle || name || 'Product Name | Mewa Masala Ghar'}
                </span>
                <p className="text-xs text-[#4d5156] mt-0.5 leading-snug line-clamp-2">
                  {metaDescription || description || 'Handpicked organic natural dry fruits, spices and wellness products.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
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
            onClick={() => handleSubmit(false)}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 text-xs flex items-center gap-1.5"
          >
            <span>Save as Draft (Inactive)</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="px-6 py-2.5 bg-[#2F5D3A] text-white font-bold rounded-xl hover:bg-[#23472C] text-xs flex items-center gap-2 shadow-md"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isEditing ? 'Update & Publish' : 'Publish SKU'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
