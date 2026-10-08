import React from 'react';

export interface JaaliDividerProps {
  className?: string;
  color?: string; // default rich gold #C9962C
  variant?: 'strip' | 'centered' | 'footer';
  height?: number;
}

/**
 * JaaliDivider: A thin gold lattice-pattern SVG strip inspired by the sandstone
 * jaali screens of Jodhpur and Amber forts. Used as a section divider.
 */
export const JaaliDivider: React.FC<JaaliDividerProps> = ({
  className = 'my-8 sm:my-10',
  color = '#C9962C',
  variant = 'centered',
  height = 14,
}) => {
  if (variant === 'strip' || variant === 'footer') {
    return (
      <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
        <svg
          viewBox="0 0 1200 14"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-3.5"
          aria-hidden="true"
        >
          <defs>
            <pattern id="jaaliLatticePattern" width="28" height="14" patternUnits="userSpaceOnUse">
              {/* Outer top/bottom framing lines */}
              <line x1="0" y1="0.5" x2="28" y2="0.5" stroke={color} strokeWidth="0.75" strokeOpacity="0.8" />
              <line x1="0" y1="13.5" x2="28" y2="13.5" stroke={color} strokeWidth="0.75" strokeOpacity="0.8" />
              <line x1="0" y1="2" x2="28" y2="2" stroke={color} strokeWidth="0.5" strokeDasharray="1.5 2" strokeOpacity="0.5" />
              <line x1="0" y1="12" x2="28" y2="12" stroke={color} strokeWidth="0.5" strokeDasharray="1.5 2" strokeOpacity="0.5" />

              {/* Geometric 8-point Jaali Interlocking Diamonds */}
              <path
                d="M 14 2 L 21 7 L 14 12 L 7 7 Z"
                stroke={color}
                strokeWidth="0.9"
                fill="none"
                strokeOpacity="0.85"
              />
              <path
                d="M 0 7 L 7 2 M 0 7 L 7 12 M 28 7 L 21 12"
                stroke={color}
                strokeWidth="0.9"
                strokeOpacity="0.85"
              />
              {/* Center rosette dot */}
              <circle cx="14" cy="7" r="1.5" fill="#B5472B" />
              <circle cx="0" cy="7" r="1" fill={color} />
              <circle cx="28" cy="7" r="1" fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill="url(#jaaliLatticePattern)" />
        </svg>
      </div>
    );
  }

  // Centered Variant: Regal center star medallion flanked by fading gold jaali lines
  return (
    <div
      className={`relative w-full flex items-center justify-center px-4 sm:px-8 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Left Jaali lattice wing */}
      <div className="flex-1 max-w-xs sm:max-w-md h-3 relative overflow-hidden">
        <svg
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="jaaliFadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M 0 6 L 300 6"
            stroke="url(#jaaliFadeLeft)"
            strokeWidth="1.2"
          />
          {/* Diamond micro notches */}
          {[60, 110, 160, 210, 250, 280].map((x) => (
            <polygon
              key={`L-${x}`}
              points={`${x},3 ${x + 4},6 ${x},9 ${x - 4},6`}
              stroke={color}
              strokeWidth="0.8"
              fill="none"
              strokeOpacity="0.7"
            />
          ))}
        </svg>
      </div>

      {/* Central Royal Medallion (Rajasthani 8-Point Star & Lotus Rosette) */}
      <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1 bg-[#FAF4E8] dark:bg-[#16212B] rounded-full border border-[#C9962C]/60 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D6B]" />
        <span className="w-1.5 h-1.5 rotate-45 border border-[#C9962C] bg-[#B5472B]" />

        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#C9962C]" fill="none" stroke="currentColor">
          {/* 8-point royal star */}
          <polygon
            points="12,2 14.8,7.8 21,8.8 16.5,13.2 17.5,19.5 12,16.5 6.5,19.5 7.5,13.2 3,8.8 9.2,7.8"
            fill="#C9962C"
            fillOpacity="0.3"
            stroke="#C9962C"
            strokeWidth="1.2"
          />
          {/* Terracotta center gem */}
          <circle cx="12" cy="12" r="3" fill="#B5472B" />
          <circle cx="12" cy="12" r="1.2" fill="#FAF4E8" />
        </svg>

        <span className="w-1.5 h-1.5 rotate-45 border border-[#C9962C] bg-[#B5472B]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D6B]" />
      </div>

      {/* Right Jaali lattice wing */}
      <div className="flex-1 max-w-xs sm:max-w-md h-3 relative overflow-hidden">
        <svg
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="jaaliFadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="50%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 6 L 300 6"
            stroke="url(#jaaliFadeRight)"
            strokeWidth="1.2"
          />
          {[20, 50, 90, 140, 190, 240].map((x) => (
            <polygon
              key={`R-${x}`}
              points={`${x},3 ${x + 4},6 ${x},9 ${x - 4},6`}
              stroke={color}
              strokeWidth="0.8"
              fill="none"
              strokeOpacity="0.7"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
