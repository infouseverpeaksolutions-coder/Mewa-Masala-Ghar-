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
    bgColor: '#F3E2C3',      // Rajasthani Parchment
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

export type ColorMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  activeStore: StoreType;
  setActiveStore: (store: StoreType) => void;
  currentTheme: StoreThemeInfo;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleTheme: () => void;
  cycleColorMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStore, setActiveStoreState] = useState<StoreType>(() => {
    const saved = localStorage.getItem('mmg_active_store');
    return (saved as StoreType) || 'foods';
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('mmg_theme_mode');
    return (saved as ColorMode) || 'auto';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('mmg_theme_mode') as ColorMode | null;
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const setActiveStore = (store: StoreType) => {
    setActiveStoreState(store);
    localStorage.setItem('mmg_active_store', store);
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('mmg_theme_mode', mode);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      setColorMode('light');
    } else {
      setColorMode('dark');
    }
  };

  const cycleColorMode = () => {
    if (colorMode === 'light') {
      setColorMode('dark');
    } else if (colorMode === 'dark') {
      setColorMode('auto');
    } else {
      setColorMode('light');
    }
  };

  // Synchronize store theme class (e.g. theme-foods, theme-baby, theme-care)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-foods', 'theme-baby', 'theme-care');
    const themeClass = STORE_THEMES[activeStore]?.themeClass || 'theme-foods';
    root.classList.add(themeClass);
  }, [activeStore]);

  // Synchronize dark / light / auto mode with system theme listener
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const evaluateTheme = () => {
      let activeIsDark = false;
      if (colorMode === 'dark') {
        activeIsDark = true;
      } else if (colorMode === 'light') {
        activeIsDark = false;
      } else {
        // 'auto' mode: match system
        activeIsDark = mediaQuery.matches;
      }

      setIsDarkMode(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    evaluateTheme();

    const handleSystemChange = () => {
      if (colorMode === 'auto') {
        evaluateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [colorMode]);

  const currentTheme = STORE_THEMES[activeStore] || STORE_THEMES.foods;

  return (
    <ThemeContext.Provider
      value={{
        activeStore,
        setActiveStore,
        currentTheme,
        colorMode,
        setColorMode,
        toggleTheme,
        cycleColorMode,
        isDarkMode,
      }}
    >
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
