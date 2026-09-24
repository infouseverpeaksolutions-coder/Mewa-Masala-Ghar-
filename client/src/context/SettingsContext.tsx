import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface CompanySettings {
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  fssai: string;
  state_code: string;
  state_name: string;
  free_shipping_threshold: number;
  standard_delivery_fee: number;
  cod_charge: number;
}

const DEFAULT_SETTINGS: CompanySettings = {
  company_name: 'Mewa Masala Ghar Private Limited',
  tagline: 'Pure Indian Goodness, Rooted in Tradition',
  phone: '+91 98200 12345',
  email: 'care@mewamasalaghar.com',
  address: 'Shop 14, APMC Grain Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703',
  gstin: '27AABCM1234F1Z5',
  fssai: '10021051000123',
  state_code: '27',
  state_name: 'Maharashtra',
  free_shipping_threshold: 499,
  standard_delivery_fee: 49,
  cod_charge: 0,
};

interface SettingsContextType {
  settings: CompanySettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.data) {
        const raw = res.data.data;
        setSettings({
          company_name: raw.company_name || DEFAULT_SETTINGS.company_name,
          tagline: raw.tagline || DEFAULT_SETTINGS.tagline,
          phone: raw.phone || DEFAULT_SETTINGS.phone,
          email: raw.email || DEFAULT_SETTINGS.email,
          address: raw.address || DEFAULT_SETTINGS.address,
          gstin: raw.gstin || DEFAULT_SETTINGS.gstin,
          fssai: raw.fssai || DEFAULT_SETTINGS.fssai,
          state_code: raw.state_code || DEFAULT_SETTINGS.state_code,
          state_name: raw.state_name || DEFAULT_SETTINGS.state_name,
          free_shipping_threshold: parseInt(raw.free_shipping_threshold, 10) || DEFAULT_SETTINGS.free_shipping_threshold,
          standard_delivery_fee: parseInt(raw.standard_delivery_fee, 10) || DEFAULT_SETTINGS.standard_delivery_fee,
          cod_charge: parseInt(raw.cod_charge, 10) || 0,
        });
      }
    } catch (e) {
      console.warn('Using default settings fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
