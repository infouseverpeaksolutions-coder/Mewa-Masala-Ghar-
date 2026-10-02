import React from 'react';

/**
 * Authentic Rajasthani Palace Arch Frieze
 * Rendered at the top of the content container immediately below the Hero section.
 * Provides a regal stone-carved multi-foil cusped arch transition.
 */
export const RajasthaniArchFrieze: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
    <svg
      className="w-full h-8 sm:h-10 text-[#B8860B] dark:text-[#E5B85C]"
      preserveAspectRatio="none"
      viewBox="0 0 1200 40"
      fill="none"
    >
      <defs>
        <pattern id="rajasthani-frieze-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
          {/* Main Cusped Scalloped Arch */}
          <path
            d="M0,0 L80,0 L80,10 C70,10 65,18 60,18 C55,18 52,14 40,28 C28,14 25,18 20,18 C15,18 10,10 0,10 Z"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeOpacity="0.38"
          />
          {/* Inner Scalloped Filigree */}
          <path
            d="M12,0 C15,6 20,10 28,10 C34,10 38,7 40,16 C42,7 46,10 52,10 C60,10 65,6 68,0"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            strokeOpacity="0.45"
          />
          {/* Kalash / Lotus Drop */}
          <circle cx="40" cy="33" r="3" fill="currentColor" fillOpacity="0.4" />
          <line x1="40" y1="28" x2="40" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
          {/* Diamond Jali Dots */}
          <circle cx="20" cy="9" r="1.5" fill="currentColor" fillOpacity="0.3" />
          <circle cx="60" cy="9" r="1.5" fill="currentColor" fillOpacity="0.3" />
        </pattern>
      </defs>
      <rect width="1200" height="40" fill="url(#rajasthani-frieze-pattern)" />
    </svg>
  </div>
);

/**
 * Royal Ceremonial Marwar Elephant Watermark
 * Features an auspicious raised trunk, gilded Rajput howdah, embroidered saddle cloth (jhool), and ankle bells.
 */
export const RoyalMarwarElephant: React.FC<{
  className?: string;
  flip?: boolean;
}> = ({ className = 'w-36 h-32', flip = false }) => (
  <svg
    viewBox="0 0 160 140"
    fill="none"
    className={`select-none pointer-events-none text-[#B8860B] dark:text-[#E5B85C] ${
      flip ? 'transform -scale-x-100' : ''
    } ${className}`}
  >
    {/* Elephant Body */}
    <path
      d="M 25 110 C 18 100, 15 80, 20 60 C 25 35, 45 25, 80 25 C 110 25, 130 40, 138 60 C 145 75, 140 95, 132 110 L 124 125 L 112 125 L 115 95 C 112 90, 105 90, 100 95 L 98 125 L 85 125 L 88 90 C 85 86, 78 86, 74 90 L 72 125 L 58 125 L 62 95 C 58 90, 50 90, 46 95 L 44 125 L 30 125 Z"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeOpacity="0.45"
    />
    {/* Raised Trunk (Sign of Auspicious Welcome & Royalty) */}
    <path
      d="M 135 55 C 148 50, 160 36, 155 20 C 150 12, 144 14, 142 22 C 140 28, 138 40, 130 50"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />
    {/* Tusk */}
    <path d="M 128 65 Q 142 68, 148 60" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.55" />
    {/* Royal Ear with Jhumka Ornament */}
    <path
      d="M 105 40 C 90 40, 86 60, 96 75 C 102 82, 110 75, 112 55 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="currentColor"
      fillOpacity="0.08"
      strokeOpacity="0.45"
    />
    {/* Embroidered Saddle Cloth (Jhool) */}
    <rect
      x="50"
      y="45"
      width="45"
      height="36"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="3 2"
      fill="currentColor"
      fillOpacity="0.08"
      strokeOpacity="0.55"
    />
    <polygon points="72.5,52 79,63 66,63" fill="currentColor" fillOpacity="0.25" stroke="none" />
    {/* Gilded Rajput Howdah / Crest on Back */}
    <path
      d="M 60 45 L 60 33 C 60 27, 85 27, 85 33 L 85 45 Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.55"
    />
    <circle cx="72.5" cy="25" r="3.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
    {/* Ankle Bells */}
    <circle cx="37" cy="122" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="65" cy="122" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="92" cy="122" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="118" cy="122" r="2" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/**
 * Rajasthani Mandana & Pichwai Lotus Watermark
 * Auspicious 8-point royal sun / lotus medallion placed behind major sections.
 */
export const RajasthaniMandanaWatermark: React.FC<{
  className?: string;
}> = ({ className = 'w-72 h-72' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    className={`select-none pointer-events-none text-[#B8860B] dark:text-[#E5B85C] ${className}`}
  >
    {/* Concentric Step Rings (Mandana Chok) */}
    <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />
    <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
    <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.25" />
    <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.03" />
    <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
    <circle cx="100" cy="100" r="8" fill="currentColor" fillOpacity="0.3" stroke="none" />

    {/* 8-Point Rajput Royal Star Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <g key={deg} transform={`rotate(${deg} 100 100)`}>
        {/* Lotus petal cusp */}
        <path
          d="M 100 18 C 93 42, 90 60, 100 70 C 110 60, 107 42, 100 18 Z"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        {/* Ray finial */}
        <circle cx="100" cy="10" r="2" fill="currentColor" fillOpacity="0.4" />
      </g>
    ))}
  </svg>
);
