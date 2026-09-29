import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ColorMode } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ variant?: 'navbar' | 'mobile' | 'compact' }> = ({
  variant = 'navbar',
}) => {
  const { colorMode, setColorMode, isDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ColorMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      mode: 'auto',
      label: 'System',
      icon: <Monitor className="w-4 h-4 text-emerald-500" />,
    },
  ];

  if (variant === 'mobile') {
    return (
      <div className="w-full py-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
          Appearance
        </p>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
          {options.map((opt) => {
            const isSelected = colorMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setColorMode(opt.mode)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2B23] text-gray-900 dark:text-white shadow-xs font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Active trigger icon
  const getActiveIcon = () => {
    if (colorMode === 'auto') {
      return <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    return isDarkMode ? (
      <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-600" />
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer"
        aria-label="Theme options"
        title={`Theme: ${colorMode === 'auto' ? 'System (Auto)' : colorMode === 'dark' ? 'Dark' : 'Light'}`}
      >
        {getActiveIcon()}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#18221B] rounded-2xl shadow-xl border border-[#E7E0D0] dark:border-[#2A3B2F] py-1.5 z-50 animate-in fade-in duration-150 backdrop-blur-md">
          <div className="px-3 py-1 border-b border-gray-100 dark:border-white/5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Theme Mode
            </span>
          </div>
          {options.map((opt) => {
            const isSelected = colorMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setColorMode(opt.mode);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#1F4D2E] dark:text-[#8ED9A0] bg-[#FAF6EC] dark:bg-[#1F2E23]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
