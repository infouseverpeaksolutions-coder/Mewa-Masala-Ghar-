import React, { useState, useEffect } from 'react';
import {
  Save,
  Building2,
  ShieldCheck,
  Truck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    fssai: '',
    state_code: '27',
    state_name: 'Maharashtra',
    free_shipping_threshold: '499',
    standard_delivery_fee: '49',
    cod_charge: '0',
  });

  const fetchSettings = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setForm({
          company_name: d.company_name || 'Mewa Masala Ghar Private Limited',
          tagline: d.tagline || 'Pure Indian Goodness, Rooted in Tradition',
          phone: d.phone || '+91 98200 12345',
          email: d.email || 'care@mewamasalaghar.com',
          address: d.address || 'Shop 14, APMC Grain Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703',
          gstin: d.gstin || '27AABCM1234F1Z5',
          fssai: d.fssai || '10021051000123',
          state_code: d.state_code || '27',
          state_name: d.state_name || 'Maharashtra',
          free_shipping_threshold: d.free_shipping_threshold || '499',
          standard_delivery_fee: d.standard_delivery_fee || '49',
          cod_charge: d.cod_charge || '0',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to load settings from server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.put('/admin/settings', form);
      if (res.data?.success) {
        setMessage({
          type: 'success',
          text: 'Company settings updated successfully. Live storefront, invoices, and footers now reflect these values.',
        });
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Failed to update settings' });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Network error updating settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Store & Compliance Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Dynamic business identity, tax credentials, and delivery thresholds stored in the database.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Profile */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-emerald-50 text-[#2F5D3A] rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Business Identity & Contact</h2>
              <p className="text-xs text-gray-500">
                Shown across header, announcements, footer, invoices, and customer emails
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Customer Care Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Support Email Address *
              </label>
              <input
                type="email"
                required
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Office / APMC Depot Address *
              </label>
              <textarea
                required
                rows={3}
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Legal & Tax Compliance */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Tax & Regulatory Compliance</h2>
              <p className="text-xs text-gray-500">
                Printed on official GST Tax Invoices and food packaging declarations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                GSTIN (15 Alpha-Numeric Characters) *
              </label>
              <input
                type="text"
                required
                maxLength={15}
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                FSSAI Central / State License Number *
              </label>
              <input
                type="text"
                required
                name="fssai"
                value={form.fssai}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                State Code (e.g. 27 for Maharashtra) *
              </label>
              <input
                type="text"
                required
                name="state_code"
                value={form.state_code}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                State Name *
              </label>
              <input
                type="text"
                required
                name="state_name"
                value={form.state_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Fees & Thresholds */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Shipping & Delivery Policies</h2>
              <p className="text-xs text-gray-500">
                Calculated automatically in shopping bag and checkout screen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Free Delivery Threshold (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                name="free_shipping_threshold"
                value={form.free_shipping_threshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Orders above this amount get free shipping
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Standard Delivery Charge (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                name="standard_delivery_fee"
                value={form.standard_delivery_fee}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Applied when cart is below free threshold
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Cash On Delivery Extra Fee (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                name="cod_charge"
                value={form.cod_charge}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Set to 0 for free COD across India
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#2F5D3A] hover:bg-[#254A2E] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
