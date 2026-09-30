import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useTheme, ColorMode } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{
  variant?: 'navbar' | 'mobile' | 'header-compact';
}> = ({ variant = 'navbar' }) => {
  const { colorMode, setColorMode, toggleTheme, isDarkMode } = useTheme();
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

  const options: { mode: ColorMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      mode: 'light',
      label: 'Light Mode',
      desc: 'Classic Ivory & Forest Green',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      desc: 'Deep Forest Obsidian',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      mode: 'auto',
      label: 'System Auto',
      desc: 'Matches device preference',
      icon: <Monitor className="w-4 h-4 text-emerald-500" />,
    },
  ];

  // Mobile drawer 3-way segmented control
  if (variant === 'mobile') {
    return (
      <div className="w-full py-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Appearance
          </p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {colorMode === 'auto' ? 'Auto (System)' : colorMode === 'dark' ? 'Dark' : 'Light'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
          {options.map((opt) => {
            const isSelected = colorMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setColorMode(opt.mode)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2B23] text-gray-900 dark:text-white shadow-xs font-bold border border-black/5 dark:border-white/15'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {opt.icon}
                <span>{opt.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header compact 1-tap toggle (ideal for mobile navbar)
  if (variant === 'header-compact') {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-all rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer active:scale-90"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Theme is currently ${isDarkMode ? 'Dark' : 'Light'}. Tap to switch.`}
      >
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500 transition-transform duration-300 hover:rotate-45" />
        )}
      </button>
    );
  }

  // Default navbar variant: 1-click toggle with dropdown chevron for System Auto
  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <div className="inline-flex items-center rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-0.5 transition-colors">
        {/* Direct 1-Click Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-all rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer active:scale-90"
          aria-label={`Currently ${colorMode === 'auto' ? 'System Auto' : isDarkMode ? 'Dark' : 'Light'}. Click to switch to ${isDarkMode ? 'Light' : 'Dark'}.`}
          title={`Currently ${colorMode === 'auto' ? 'System Auto (' + (isDarkMode ? 'Dark' : 'Light') + ')' : isDarkMode ? 'Dark Mode' : 'Light Mode'}. Click to switch.`}
        >
          {colorMode === 'auto' ? (
            <div className="relative">
              <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400' : 'bg-amber-400'}`} />
            </div>
          ) : isDarkMode ? (
            <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
          )}
        </button>

        {/* Small dropdown chevron to choose System Auto or explicit mode */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          aria-label="Theme options menu"
          title="Choose Light, Dark, or System mode"
        >
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#18221B] rounded-2xl shadow-xl border border-[#E7E0D0] dark:border-[#2A3B2F] py-2 z-50 animate-in fade-in duration-150 backdrop-blur-md">
          <div className="px-3 py-1 border-b border-gray-100 dark:border-white/5 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Appearance
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {colorMode === 'auto' ? 'Auto' : colorMode === 'dark' ? 'Dark' : 'Light'}
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
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'text-[#1F4D2E] dark:text-[#8ED9A0] bg-[#FAF6EC] dark:bg-[#1F2E23]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-black/5 dark:bg-white/5">
                    {opt.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-xs leading-none">{opt.label}</p>
                    <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#1F4D2E] dark:text-[#8ED9A0] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
