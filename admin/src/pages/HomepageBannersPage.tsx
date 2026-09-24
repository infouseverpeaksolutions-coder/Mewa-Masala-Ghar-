import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Sliders,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import api from '../services/api';
import { Banner } from '../types';

const STUDIO_PRESETS = [
  {
    name: 'Royal Dry Fruits',
    url: '/banners/hero_slide_dryfruits.png',
    defaultTitle: 'Royal Handpicked Dry Fruits, Nuts & Festive Combos',
    defaultSubtitle:
      'Direct from APMC Mandi — California Badam, King W240 Kaju, Afghan Anjeer & Walnuts packed fresh with zero preservatives.',
    defaultCta: 'Shop Royal Mewa',
    defaultLink: '/foods',
  },
  {
    name: 'Wholesome Super Seeds',
    url: '/banners/hero_slide_seeds.png',
    defaultTitle: 'Wholesome Nutrient-Rich Super Seeds & Vitality Mixes',
    defaultSubtitle:
      'High in Plant Protein, Omega-3 & Essential Fiber — Slow-roasted flax, raw chia, jumbo pumpkin & sunflower seeds.',
    defaultCta: 'Shop Super Seeds',
    defaultLink: '/shop?store=foods&category=seeds-mixes',
  },
  {
    name: 'Sprouted Baby Food',
    url: '/banners/hero_slide_baby_poshan.png',
    defaultTitle: 'Traditional Sprouted Baby Food & Wholesome Daily Poshan',
    defaultSubtitle:
      'Ayurvedic & Motherly Care — Sprouted Ragi & Badam Pratham Aahaar for infants, nourishing blends for family vitality.',
    defaultCta: 'Shop Baby & Poshan',
    defaultLink: '/baby-nutrition',
  },
  {
    name: 'Pregnancy Care',
    url: '/banners/hero_slide_pregnancy.png',
    defaultTitle: 'Doctor-Curated Ayurvedic Pregnancy Care & Maternal Nutrition',
    defaultSubtitle:
      'Nutrient-dense care for mother and baby — Organic dry fruit laddoo flour, natural plant iron, calcium and minerals.',
    defaultCta: 'Shop Pregnancy Care',
    defaultLink: '/baby-nutrition',
  },
  {
    name: 'Natural Clays & Skincare',
    url: '/banners/hero_slide_personal_care.png',
    defaultTitle: 'Export Grade Volcanic Clays, Mineral Mud & Herbal Care',
    defaultSubtitle:
      'Ancient Earth Radiance — Ultra-fine 300-mesh Multani Mitti, French Rose Pink Clay, and mineral-rich Dead Sea Mud.',
    defaultCta: 'Shop Personal Care',
    defaultLink: '/personal-care',
  },
];

export const HomepageBannersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [linkUrl, setLinkUrl] = useState('/');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const res = await api.get('/admin/banners');
      return res.data?.data || [];
    },
  });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Create / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        subtitle,
        ctaText,
        linkUrl,
        imageUrl,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive,
      };

      if (editingBanner) {
        return await api.put(`/admin/banners/${editingBanner.id}`, payload);
      } else {
        return await api.post('/admin/banners', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      setModalOpen(false);
      setEditingBanner(null);
      showSuccess(editingBanner ? 'Banner updated successfully!' : 'New hero banner created!');
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || 'Failed to save banner.');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      setDeleteConfirmId(null);
      showSuccess('Banner slide deleted successfully.');
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || 'Failed to delete banner.');
    },
  });

  // Toggle Active Mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await api.put(`/admin/banners/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      showSuccess('Banner visibility updated.');
    },
  });

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setCtaText('Shop Now');
    setLinkUrl('/foods');
    setImageUrl('/banners/hero_slide_dryfruits.png');
    setDisplayOrder(String(banners.length + 1));
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setCtaText(b.ctaText || 'Shop Now');
    setLinkUrl(b.linkUrl || '/');
    setImageUrl(b.imageUrl);
    setDisplayOrder(String(b.displayOrder));
    setIsActive(b.isActive);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.data?.url) {
        setImageUrl(res.data.data.url);
        showSuccess('Image uploaded successfully!');
      }
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyPreset = (preset: typeof STUDIO_PRESETS[0]) => {
    setImageUrl(preset.url);
    if (!title) setTitle(preset.defaultTitle);
    if (!subtitle) setSubtitle(preset.defaultSubtitle);
    if (ctaText === 'Shop Now') setCtaText(preset.defaultCta);
    if (linkUrl === '/') setLinkUrl(preset.defaultLink);
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast Notifications */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-[#2F5D3A] text-white px-5 py-3 rounded-xl shadow-xl border border-[#D9A441] animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-red-800 text-white px-5 py-3 rounded-xl shadow-xl border border-red-400 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-red-300" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF6EC] rounded-xl text-[#2F5D3A]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#2F5D3A]">Hero Banner & Homepage Manager</h1>
          </div>
          <p className="text-sm text-[#7A6B58]">
            Customize the storefront hero carousel slides, headings, subheadings, CTA buttons, and background imagery in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#FAF6EC] text-[#2F5D3A] border border-[#E6DEC8] rounded-xl text-sm font-semibold hover:bg-[#F2ECE0] transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Storefront</span>
          </a>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#23472C] transition-all flex items-center gap-2 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 text-[#D9A441]" />
            <span>Add New Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] flex items-center justify-center text-[#2F5D3A] font-bold text-xl">
            {banners.length}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A6B58]">Total Hero Slides</div>
            <div className="text-lg font-bold text-[#2F5D3A]">Configured Banners</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl">
            {activeCount}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Currently Active</div>
            <div className="text-lg font-bold text-[#2F5D3A]">Visible on Homepage</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] flex items-center justify-center text-[#D9A441]">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A6B58]">Display Sequence</div>
            <div className="text-lg font-bold text-[#2F5D3A]">Ordered by Rank (1 → N)</div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E6DEC8] bg-[#FAF6EC]/50 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#2F5D3A]">Active Hero Slides & Sequencing</h2>
          <span className="text-xs text-[#7A6B58]">Drag or adjust display order to resequence slides</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-[#7A6B58] space-y-3">
            <div className="w-8 h-8 border-3 border-[#2F5D3A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-[#7A6B58] space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-base font-bold text-[#2F5D3A]">No hero banners created yet</p>
              <p className="text-sm text-[#7A6B58]">Create your first banner slide to display on the storefront.</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Slide</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E6DEC8]">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`p-6 transition-all hover:bg-[#FAF6EC]/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                  !banner.isActive ? 'opacity-60 bg-gray-50/50' : ''
                }`}
              >
                {/* Visual Thumbnail & Order */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col items-center justify-center w-8 text-xs font-bold text-[#7A6B58]">
                    <span>#{banner.displayOrder}</span>
                  </div>

                  <div className="relative w-52 h-24 rounded-xl overflow-hidden border border-[#E6DEC8] bg-[#FAF6EC] shadow-xs group">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] text-white font-medium truncate max-w-full">
                        {banner.ctaText || 'Shop Now'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-[#2F5D3A] line-clamp-1">{banner.title}</h3>
                    {banner.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <Eye className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                        <EyeOff className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#7A6B58] line-clamp-2 leading-relaxed">
                    {banner.subtitle || 'No subtitle provided.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#7A6B58] pt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#D9A441]">
                      CTA: {banner.ctaText || 'Shop Now'}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-xs font-mono text-[11px] text-gray-500">
                      Link: {banner.linkUrl || '/'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => toggleMutation.mutate({ id: banner.id, isActive: !banner.isActive })}
                    title={banner.isActive ? 'Hide Slide' : 'Show Slide'}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      banner.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => openEditModal(banner)}
                    title="Edit Slide"
                    className="p-2.5 rounded-xl border border-[#E6DEC8] bg-white text-[#2F5D3A] hover:bg-[#FAF6EC] hover:border-[#D9A441] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(banner.id)}
                    title="Delete Slide"
                    className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900">Confirm Banner Deletion</h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this hero banner slide? This will immediately remove it from the storefront carousel.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
              >
                Yes, Delete Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-[#E6DEC8] shadow-2xl my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-4">
              <div className="space-y-0.5">
                <h2 className="text-xl font-serif font-bold text-[#2F5D3A]">
                  {editingBanner ? 'Edit Hero Banner Slide' : 'Create New Hero Banner Slide'}
                </h2>
                <p className="text-xs text-[#7A6B58]">
                  Configure slide text, background photo, CTA button label, and destination link.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-[#FAF6EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Studio Presets Quick-Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6B58]">
                Quick Presets (Studio Backgrounds)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STUDIO_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      imageUrl === preset.url
                        ? 'border-[#2F5D3A] bg-[#FAF6EC] font-bold text-[#2F5D3A] shadow-xs'
                        : 'border-[#E6DEC8] bg-white text-gray-600 hover:bg-[#FAF6EC]/50'
                    }`}
                  >
                    <div className="font-semibold truncate">{preset.name}</div>
                    <div className="text-[10px] text-[#7A6B58] truncate">{preset.url.split('/').pop()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
                  Main Headline (Title) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Handpicked Dry Fruits, Nuts & Festive Combos"
                  required
                  className="w-full px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* Subtitle */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
                  Detailed Sub-Headline (Description)
                </label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Direct from APMC Mandi — California Badam, King W240 Kaju, Afghan Anjeer & Walnuts packed fresh with zero preservatives."
                  className="w-full px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* CTA Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Shop Royal Mewa"
                  className="w-full px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* Target Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">Destination Link</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /foods, /baby-nutrition, /shop?combo=true"
                  className="w-full px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* Image URL & Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
                  Banner Image Source (URL or File Upload) *
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. /banners/hero_slide_dryfruits.png or https://..."
                    required
                    className="flex-1 px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                  />
                  <label className="px-4 py-3 bg-[#FAF6EC] border border-[#E6DEC8] hover:bg-[#F2ECE0] text-[#2F5D3A] rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
                  Display Order (Sequencing)
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF6EC]/50 border border-[#E6DEC8] rounded-xl text-sm focus:outline-hidden focus:border-[#2F5D3A] focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F5D3A]"></div>
                </label>
                <span className="text-sm font-semibold text-[#2F5D3A]">
                  {isActive ? 'Slide is Active & Visible' : 'Slide is Inactive (Hidden)'}
                </span>
              </div>
            </div>

            {/* Live Preview Canvas */}
            <div className="space-y-2 border-t border-[#E6DEC8] pt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6B58]">
                Real-Time Visual Preview (Live Layout)
              </label>
              <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden border-2 border-[#E6DEC8] shadow-inner bg-[#FAF6EC]">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                {/* Foreground Overlay Simulation */}
                <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-6 sm:px-12 max-w-xl space-y-2 text-left">
                  <h3 className="font-serif font-bold text-white text-base sm:text-2xl leading-tight drop-shadow-md">
                    {title || 'Headline will appear here'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/95 line-clamp-2 drop-shadow-sm">
                    {subtitle || 'Detailed sub-headline text will appear here.'}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C88E2D] text-white text-xs font-bold rounded-full shadow-md">
                      {ctaText || 'Shop Now'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E6DEC8] pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title || !imageUrl || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="px-6 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#23472C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saveMutation.isPending ? 'Saving...' : editingBanner ? 'Update Slide' : 'Create Slide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomepageBannersPage;
