import React from 'react';

export const LeafIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-4 h-4', color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20.5 3.5C14.5 3 7.5 7.5 5 14C8 13.5 12 13 15 10C17.5 7.5 19.5 5 20.5 3.5Z"
      fill={color}
      opacity="0.9"
    />
    <path
      d="M3.5 20.5C5 18 8.5 13.5 14 11C13 14 10 18.5 3.5 20.5Z"
      fill={color}
      opacity="0.6"
    />
    <path
      d="M3.5 20.5C6.5 16.5 11.5 12.5 20.5 3.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const LotusIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 4C13 7.5 14.5 12 12 17C9.5 12 11 7.5 12 4Z"
      fill={color}
    />
    <path
      d="M12 17C14.5 15.5 19 14 20 8.5C17.5 9 14.5 12.5 12 17Z"
      fill={color}
      opacity="0.8"
    />
    <path
      d="M12 17C9.5 15.5 5 14 4 8.5C6.5 9 9.5 12.5 12 17Z"
      fill={color}
      opacity="0.8"
    />
    <path
      d="M7 17.5C10 19 14 19 17 17.5C15 20 9 20 7 17.5Z"
      fill={color}
      opacity="0.9"
    />
  </svg>
);

export const MotherChildIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.8" />
    <circle cx="16.5" cy="11.5" r="2" stroke={color} strokeWidth="1.5" />
    <path
      d="M6.5 19C6.5 15.5 9 13 12 13C12.8 13 13.5 13.2 14.2 13.6C14.1 14.5 14.4 15.4 15 16C15.8 16.8 16.9 17.1 18 17C17.5 18.8 15.5 20 12 20C8.5 20 6.5 19 6.5 19Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Trust Icons
export const VegIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <LeafIcon className="w-3.5 h-3.5" color={color} />
  </div>
);

export const NoColoursIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
      <path d="M10 2v4.5L4.5 17a3 3 0 0 0 2.5 5h10a3 3 0 0 0 2.5-5L14 6.5V2" />
      <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
    </svg>
  </div>
);

export const RoastedIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  </div>
);

export const QualityBadgeIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
      <circle cx="12" cy="10" r="6" />
      <path d="M8.5 15l-1.5 6 5-3 5 3-1.5-6" />
    </svg>
  </div>
);

export const DeliveryTruckIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
      <rect x="1" y="4" width="14" height="11" rx="1" />
      <polygon points="15 7 19 7 22 10 22 15 15 15 15 7" />
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  </div>
);

// Jaali / Scallop Decorative Pattern Border Strip for top of footer and section divides
export const JaaliBorder: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-3',
  color = '#2F5D3A',
}) => (
  <svg
    viewBox="0 0 1200 12"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <pattern id="jaaliPattern" width="24" height="12" patternUnits="userSpaceOnUse">
        <path
          d="M0 0 C6 8 18 8 24 0 L24 12 L0 12 Z"
          fill={color}
        />
        <circle cx="12" cy="4" r="1.5" fill="#D9A441" opacity="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="12" fill="url(#jaaliPattern)" />
  </svg>
);

// Botanical leaves corner illustration
export const CornerLeaves: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-24 h-24',
  color = '#2F5D3A',
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 90C25 70 50 60 90 55C80 40 60 25 35 25C15 45 10 70 10 90Z"
      fill={color}
      opacity="0.15"
    />
    <path
      d="M20 90C35 65 65 45 95 30C75 25 45 35 25 50C15 65 18 80 20 90Z"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.4"
    />
    <path
      d="M25 85C45 60 70 45 90 40"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
    />
  </svg>
);

// Brand Logo Badge (official brand badge matching trademark logo)
export const BrandLogoBadge: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-12 sm:h-14 w-auto',
    lg: 'h-16 sm:h-20 w-auto',
  };

  return (
    <img
      src="/logo.png"
      alt="Mewa Masala Ghar"
      className={`${sizeClasses[size]} object-contain drop-shadow-xs transition-transform duration-200 hover:scale-[1.02] ${className}`}
      loading="eager"
      onError={(e) => {
        e.currentTarget.src = '/logo.jpg';
      }}
    />
  );
};

// Royal Indian Mandala Motif (Traditional filigree watermark for banners and luxury accents)
export const RoyalMandala: React.FC<{ className?: string; color?: string; opacity?: number }> = ({
  className = 'w-48 h-48',
  color = '#D9A441',
  opacity = 0.25,
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* Concentric rings */}
    <circle cx="100" cy="100" r="92" stroke={color} strokeWidth="1" strokeDasharray="2 3" />
    <circle cx="100" cy="100" r="84" stroke={color} strokeWidth="1.2" />
    <circle cx="100" cy="100" r="76" stroke={color} strokeWidth="0.8" />
    <circle cx="100" cy="100" r="54" stroke={color} strokeWidth="1" />
    <circle cx="100" cy="100" r="32" stroke={color} strokeWidth="1.2" />
    <circle cx="100" cy="100" r="14" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
    <circle cx="100" cy="100" r="4" fill={color} />

    {/* Center 8-petal core */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <g key={`core-${angle}`} transform={`rotate(${angle} 100 100)`}>
        <path
          d="M100 86 C96 92 96 96 100 100 C104 96 104 92 100 86 Z"
          fill={color}
          fillOpacity="0.4"
          stroke={color}
          strokeWidth="0.8"
        />
        <circle cx="100" cy="80" r="2" fill={color} />
      </g>
    ))}

    {/* Intermediate 16-point lotus petals */}
    {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle) => (
      <g key={`petal-${angle}`} transform={`rotate(${angle} 100 100)`}>
        <path
          d="M100 46 C94 60 92 70 100 76 C108 70 106 60 100 46 Z"
          stroke={color}
          strokeWidth="0.9"
          fill="none"
        />
        <circle cx="100" cy="62" r="1.5" fill={color} opacity="0.7" />
      </g>
    ))}

    {/* Outer 8 grand royal cusped petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <g key={`outer-${angle}`} transform={`rotate(${angle} 100 100)`}>
        <path
          d="M100 12 C90 32 84 50 100 54 C116 50 110 32 100 12 Z"
          stroke={color}
          strokeWidth="1.2"
          fill={color}
          fillOpacity="0.08"
        />
        <path
          d="M94 28 Q100 18 106 28"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
        />
        <circle cx="100" cy="22" r="2.5" fill={color} />
        {/* Diamond jali accents */}
        <polygon points="100,6 102.5,10 100,14 97.5,10" stroke={color} strokeWidth="0.7" fill="none" />
      </g>
    ))}
  </svg>
);

// Traditional Cusped Arch Flourish for banner corners & luxury dividers
export const IndianArchFlourish: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-24 h-24',
  color = '#D9A441',
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cusped arch framing lines */}
    <path
      d="M0 0 L100 0 C100 35 85 65 60 82 C45 92 25 98 0 100 L0 0 Z"
      fill={color}
      fillOpacity="0.04"
    />
    <path
      d="M5 0 C5 30 20 60 45 75 C60 84 80 92 100 95"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M0 15 C20 18 45 35 55 55 C65 75 80 90 100 100"
      stroke={color}
      strokeWidth="1.2"
      strokeDasharray="2 3"
      opacity="0.4"
    />
    {/* Lotus bud accent */}
    <path
      d="M32 32 C28 26 28 20 32 15 C36 20 36 26 32 32 Z"
      fill={color}
      opacity="0.5"
    />
    <circle cx="32" cy="12" r="1.5" fill={color} opacity="0.6" />
  </svg>
);

// Flour / Mortar icon for stone-ground flour in trust row
export const FlourIcon: React.FC<{ className?: string; color?: string }> = ({ className = 'w-6 h-6', color = '#2F5D3A' }) => (
  <div className={`${className} rounded-full border-2 flex items-center justify-center p-1`} style={{ borderColor: color, color }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
      <path d="M4 10a8 8 0 0 0 16 0H4z" />
      <path d="M12 2v8" />
      <path d="M7 19h10" />
      <path d="M9 14v5" />
      <path d="M15 14v5" />
    </svg>
  </div>
);

// Botanical Leaf Sprig pointing inward right
export const BranchFlourishLeft: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-10',
  color = '#2F5D3A',
}) => (
  <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 25 Q 45 22 95 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
    <path d="M25 24 Q 28 14 36 18 Q 30 25 25 24 Z" fill={color} opacity="0.65" />
    <path d="M40 22 Q 44 10 54 15 Q 46 23 40 22 Z" fill={color} opacity="0.65" />
    <path d="M60 19 Q 65 7 75 12 Q 68 20 60 19 Z" fill={color} opacity="0.65" />
    <path d="M80 17 Q 85 6 95 11 Q 88 18 80 17 Z" fill={color} opacity="0.65" />
    <path d="M30 24 Q 34 32 42 28 Q 36 22 30 24 Z" fill={color} opacity="0.65" />
    <path d="M50 21 Q 55 31 64 26 Q 57 20 50 21 Z" fill={color} opacity="0.65" />
    <path d="M70 18 Q 75 27 84 23 Q 77 17 70 18 Z" fill={color} opacity="0.65" />
  </svg>
);

// Botanical Leaf Sprig pointing inward left (mirrored)
export const BranchFlourishRight: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-10',
  color = '#2F5D3A',
}) => (
  <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} transform -scale-x-100`}>
    <path d="M5 25 Q 45 22 95 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
    <path d="M25 24 Q 28 14 36 18 Q 30 25 25 24 Z" fill={color} opacity="0.65" />
    <path d="M40 22 Q 44 10 54 15 Q 46 23 40 22 Z" fill={color} opacity="0.65" />
    <path d="M60 19 Q 65 7 75 12 Q 68 20 60 19 Z" fill={color} opacity="0.65" />
    <path d="M80 17 Q 85 6 95 11 Q 88 18 80 17 Z" fill={color} opacity="0.65" />
    <path d="M30 24 Q 34 32 42 28 Q 36 22 30 24 Z" fill={color} opacity="0.65" />
    <path d="M50 21 Q 55 31 64 26 Q 57 20 50 21 Z" fill={color} opacity="0.65" />
    <path d="M70 18 Q 75 27 84 23 Q 77 17 70 18 Z" fill={color} opacity="0.65" />
  </svg>
);

// Section Title Leaf Accent
export const SectionLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-4 h-4',
  color = '#2F5D3A',
}) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block ml-1.5 align-middle ${className}`}>
    <path d="M17 3C11 3 7 7 5 12C8 11.5 11 11 13 8.5C15 6.5 16.5 4.5 17 3Z" fill={color} opacity="0.9" />
    <path d="M3 17C4.5 15 7.5 11.5 12 9.5C11 12 8.5 15.5 3 17Z" fill={color} opacity="0.6" />
    <path d="M3 17C5.5 13.5 9.5 10.5 17 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Authentic Rajasthani Royal Section Divider (Lotus & Gold Filigree Accents)
export const RajasthaniDivider: React.FC<{ className?: string }> = ({ className = 'my-2 sm:my-4' }) => (
  <div className={`flex items-center justify-center gap-3 px-4 ${className} select-none pointer-events-none`}>
    <div className="h-px flex-1 max-w-[70px] sm:max-w-[140px] bg-gradient-to-r from-transparent via-[#D9A441]/30 to-[#D9A441]/75" />
    <div className="flex items-center gap-2 text-[#D9A441]">
      <span className="w-1 h-1 rounded-full bg-[#D9A441]/60" />
      <span className="w-1.5 h-1.5 rotate-45 border border-[#D9A441] bg-[#D9A441]/20" />
      {/* Royal 8-point star / Lotus rosette */}
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D9A441]" fill="none" stroke="currentColor" strokeWidth="1.4">
        <polygon points="12,2 14.5,8 21,9.5 16,14.5 17.5,21 12,17.5 6.5,21 8,14.5 3,9.5 9.5,8" fill="currentColor" fillOpacity="0.25" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className="w-1.5 h-1.5 rotate-45 border border-[#D9A441] bg-[#D9A441]/20" />
      <span className="w-1 h-1 rounded-full bg-[#D9A441]/60" />
    </div>
    <div className="h-px flex-1 max-w-[70px] sm:max-w-[140px] bg-gradient-to-l from-transparent via-[#D9A441]/30 to-[#D9A441]/75" />
  </div>
);

