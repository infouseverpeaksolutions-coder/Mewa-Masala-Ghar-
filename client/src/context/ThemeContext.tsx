import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoreType = 'foods' | 'baby' | 'care';

interface StoreThemeInfo {
  slug: StoreType;
  name: string;
  tagline: string;
  themeClass: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
}

export const STORE_THEMES: Record<StoreType, StoreThemeInfo> = {
  foods: {
    slug: 'foods',
    name: 'Mewa & Healthy Foods',
    tagline: 'Pure Dry Fruits, Seeds, Makhana & Stone-Ground Spices',
    themeClass: 'theme-foods',
    primaryColor: '#2F5D3A', // Deep Forest Green
    accentColor: '#D9A441',  // Gold
    bgColor: '#FAF6EC',      // Ivory
  },
  baby: {
    slug: 'baby',
    name: 'Baby & Family Nutrition',
    tagline: 'Wholesome First Foods & Age-Specific Poshan Formulations',
    themeClass: 'theme-baby',
    primaryColor: '#2C8CAE', // Sky Blue
    accentColor: '#F4A261',  // Peach
    bgColor: '#F4F9FB',
  },
  care: {
    slug: 'care',
    name: 'Personal Care & Natural Clays',
    tagline: 'Triple-Sifted Multani Mitti, Pink Clay & Dead Sea Minerals',
    themeClass: 'theme-care',
    primaryColor: '#B85966', // Rose
    accentColor: '#C7926B',  // Sand
    bgColor: '#FDF7F7',
  },
};

interface ThemeContextType {
  activeStore: StoreType;
  setActiveStore: (store: StoreType) => void;
  currentTheme: StoreThemeInfo;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStore, setActiveStoreState] = useState<StoreType>(() => {
    const saved = localStorage.getItem('mmg_active_store');
    return (saved as StoreType) || 'foods';
  });

  const setActiveStore = (store: StoreType) => {
    setActiveStoreState(store);
    localStorage.setItem('mmg_active_store', store);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-foods', 'theme-baby', 'theme-care');
    const themeClass = STORE_THEMES[activeStore]?.themeClass || 'theme-foods';
    root.classList.add(themeClass);
  }, [activeStore]);

  const currentTheme = STORE_THEMES[activeStore] || STORE_THEMES.foods;

  return (
    <ThemeContext.Provider value={{ activeStore, setActiveStore, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
