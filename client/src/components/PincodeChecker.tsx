import React, { useState } from 'react';
import { MapPin, Truck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { PincodeInfo } from '../types';

export const PincodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<PincodeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      setInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/pincode/check', { pincode });
      if (res.data?.success) {
        setInfo(res.data.data);
      } else {
        setError(res.data.message || 'Serviceability check failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not verify pincode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6EC]/70 p-4 rounded-2xl border border-[#E7E0D0] my-4">
      <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-800">
        <MapPin className="w-4 h-4 text-[#2F5D3A]" />
        <span>Check Delivery & Cash on Delivery (COD) Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setError(null);
          }}
          placeholder="Enter 6-digit PIN code (e.g. 400703)"
          className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] transition-all"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-5 py-2.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] disabled:opacity-50 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
        </button>
      </form>

      {error && (
        <div className="mt-2.5 text-xs text-red-600 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="mt-3 text-xs space-y-1.5 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{info.message}</span>
          </div>
          <div className="text-gray-600 pl-5.5 flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <span>🚚 Delivery: <strong>{info.estimatedDays} Business Days</strong></span>
            <span>💵 COD: <strong>{info.isCodAvailable ? 'Available' : 'Prepaid Only'}</strong></span>
            <span>✨ Free shipping on ₹{info.freeDeliveryThreshold}+</span>
          </div>
        </div>
      )}
    </div>
  );
};
