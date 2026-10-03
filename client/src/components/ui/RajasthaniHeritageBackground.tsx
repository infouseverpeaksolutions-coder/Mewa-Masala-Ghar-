import React from 'react';

/**
 * RajasthaniHeritageBackground
 * =========================================================================
 * Full-page decorative Rajasthani Heritage Background canvas matching
 * the reference image aesthetic, composition, and exact user color palette:
 * 
 * - Main parchment: #F3E2C3
 * - Light areas:    #F7E8CC
 * - Deep Green:     #2F5D3A
 * - Terracotta:     #A6533B
 * - Deep Red:       #963F2F
 * - Mustard Gold:   #C69232
 * - Heritage Brown: #5A3825
 * - Brand Gold:     #D9A441
 * =========================================================================
 */

// 1. Traditional Rajasthani Woman carrying brass matkas (left margin art)
export const RajasthaniWomanSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 110 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none drop-shadow-xs ${className || 'w-20 sm:w-24 h-auto'}`}
  >
    {/* Stacked Brass Matkas (Pots) on Head */}
    {/* Top small brass katori/lota */}
    <ellipse cx="55" cy="14" rx="7" ry="4.5" fill="#D9A441" stroke="#5A3825" strokeWidth="0.8" />
    <path d="M49 14 C49 8, 61 8, 61 14" fill="#C69232" stroke="#5A3825" strokeWidth="0.8" />
    {/* Middle brass matka */}
    <ellipse cx="55" cy="24" rx="12" ry="7.5" fill="#D9A441" stroke="#5A3825" strokeWidth="0.8" />
    <path d="M44 24 C44 17, 66 17, 66 24 Z" fill="#C69232" stroke="#5A3825" strokeWidth="0.8" />
    <ellipse cx="55" cy="22" rx="6" ry="2" fill="#FAF1DE" fillOpacity="0.6" />
    {/* Base large brass ghaada */}
    <ellipse cx="55" cy="39" rx="16" ry="10" fill="#D9A441" stroke="#5A3825" strokeWidth="0.9" />
    <path d="M40 39 C40 30, 70 30, 70 39 Z" fill="#C69232" stroke="#5A3825" strokeWidth="0.8" />
    <ellipse cx="55" cy="36" rx="8" ry="2.5" fill="#FAF1DE" fillOpacity="0.6" />

    {/* Head, Odhani (Veil / Dupatta) & Jewelry */}
    <ellipse cx="55" cy="54" rx="7" ry="9" fill="#F7E8CC" stroke="#5A3825" strokeWidth="0.7" />
    {/* Borla (forehead ornament) */}
    <circle cx="55" cy="48" r="1.5" fill="#963F2F" />
    {/* Odhani draped around face and shoulders */}
    <path
      d="M48 45 C42 50, 40 65, 36 85 C34 95, 32 120, 28 145 C35 135, 42 105, 45 85 C46 75, 48 55, 48 45 Z"
      fill="#963F2F"
      stroke="#5A3825"
      strokeWidth="0.75"
    />
    <path
      d="M62 45 C68 50, 70 65, 74 85 C76 95, 78 120, 82 145 C75 135, 68 105, 65 85 C64 75, 62 55, 62 45 Z"
      fill="#963F2F"
      stroke="#5A3825"
      strokeWidth="0.75"
    />
    {/* Odhani golden gota border */}
    <path d="M48 45 C42 50, 40 65, 36 85" stroke="#D9A441" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M62 45 C68 50, 70 65, 74 85" stroke="#D9A441" strokeWidth="1.2" strokeLinecap="round" />

    {/* Choli (Bodice) */}
    <path d="M47 62 L63 62 L66 84 L44 84 Z" fill="#2F5D3A" stroke="#5A3825" strokeWidth="0.8" />
    {/* Bangles / Chooda on arms */}
    <path d="M46 68 C38 60, 38 42, 44 38" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M64 68 C72 60, 72 42, 66 38" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />

    {/* Traditional Ghagra (Flared Skirt) with Multi-tier Bandhani Motifs */}
    <path
      d="M44 84 Q30 115 18 165 C32 172, 78 172, 92 165 Q80 115 66 84 Z"
      fill="#963F2F"
      stroke="#5A3825"
      strokeWidth="0.9"
    />
    {/* Tier 1 - Gold embroidery band */}
    <path d="M37 105 Q55 110 73 105" stroke="#D9A441" strokeWidth="1.4" fill="none" />
    {/* Tier 2 - Terracotta Chevron Band */}
    <path d="M30 128 Q55 135 80 128" stroke="#A6533B" strokeWidth="2" strokeDasharray="3 2" fill="none" />
    {/* Tier 3 - Deep Green Peacock Motif Band */}
    <path d="M24 148 Q55 156 86 148" stroke="#2F5D3A" strokeWidth="2.2" strokeDasharray="4 2.5" fill="none" />
    {/* Bottom Hem Gota Patti (Wide Gold Border) */}
    <path
      d="M18 165 C32 172, 78 172, 92 165 L94 172 C78 179, 32 179, 16 172 Z"
      fill="#D9A441"
      stroke="#5A3825"
      strokeWidth="0.8"
    />
    {/* Small Payal (Anklet) & Jutti Tips */}
    <circle cx="46" cy="178" r="1.5" fill="#5A3825" />
    <circle cx="64" cy="178" r="1.5" fill="#5A3825" />
  </svg>
);

// 2. Decorated Rajasthani Camels Pair (right margin art)
export const DecoratedCamelsPair: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 130 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none drop-shadow-xs ${className || 'w-24 sm:w-28 h-auto'}`}
  >
    {/* Background Smaller Camel */}
    <g opacity="0.75" transform="translate(42, -5) scale(0.72)">
      {/* Camel Body */}
      <path
        d="M20 70 Q 25 50 35 48 Q 45 46 50 35 Q 55 20 62 10 Q 66 5 72 8 Q 74 12 70 18 Q 66 26 62 42 Q 70 45 80 40 Q 95 35 105 45 Q 115 55 110 75 Q 102 85 85 85 L 80 115 L 75 115 L 75 85 L 45 85 L 42 115 L 37 115 L 38 80 L 25 78 Z"
        fill="#A6533B"
      />
      {/* Small saddle */}
      <rect x="68" y="44" width="22" height="18" rx="3" fill="#963F2F" />
      <line x1="68" y1="53" x2="90" y2="53" stroke="#D9A441" strokeWidth="1.5" />
    </g>

    {/* Foreground Large Decorated Rajasthani Camel */}
    {/* Legs */}
    <path d="M38 72 L36 106 L41 106 L44 74" fill="#8B452D" />
    <path d="M48 72 L46 108 L51 108 L54 74" fill="#A6533B" />
    <path d="M82 72 L80 108 L85 108 L88 74" fill="#A6533B" />
    <path d="M92 72 L90 106 L95 106 L98 74" fill="#8B452D" />
    {/* Main Torso with Hump */}
    <path
      d="M26 62 C28 54 36 50 46 48 C50 48 56 42 60 28 C64 14 70 4 78 5 C83 6 85 10 82 16 C78 24 74 36 70 48 C76 49 84 43 92 40 C102 38 112 46 112 58 C112 70 104 76 88 76 L36 76 C28 76 24 70 26 62 Z"
      fill="#A6533B"
      stroke="#5A3825"
      strokeWidth="0.8"
    />
    {/* Tail */}
    <path d="M26 64 C22 70 20 80 22 86" stroke="#5A3825" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="22" cy="87" r="1.5" fill="#5A3825" />

    {/* Decorated Saddle (Jhul) with vibrant Rajasthani textile pattern */}
    <path
      d="M62 48 L98 48 C100 48 102 52 101 58 L98 70 C97 73 94 75 91 75 L68 75 C65 75 63 73 62 70 Z"
      fill="#963F2F"
      stroke="#5A3825"
      strokeWidth="0.8"
    />
    <rect x="66" y="52" width="28" height="15" rx="2" fill="#2F5D3A" />
    <circle cx="73" cy="59.5" r="3" fill="#D9A441" />
    <circle cx="87" cy="59.5" r="3" fill="#D9A441" />
    <circle cx="80" cy="59.5" r="2" fill="#FAF1DE" />
    {/* Hanging Tassels (Ghungroo) */}
    <line x1="66" y1="75" x2="66" y2="80" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="66" cy="81" r="1.2" fill="#963F2F" />
    <line x1="74" y1="75" x2="74" y2="80" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="74" cy="81" r="1.2" fill="#963F2F" />
    <line x1="82" y1="75" x2="82" y2="80" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="82" cy="81" r="1.2" fill="#963F2F" />
    <line x1="90" y1="75" x2="90" y2="80" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="90" cy="81" r="1.2" fill="#963F2F" />
    <line x1="97" y1="75" x2="97" y2="80" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="97" cy="81" r="1.2" fill="#963F2F" />

    {/* Neck Ornaments (Gorbandh) */}
    <path d="M68 32 Q 74 38 78 30" stroke="#D9A441" strokeWidth="1.5" fill="none" />
    <path d="M65 39 Q 72 45 76 37" stroke="#963F2F" strokeWidth="1.5" fill="none" />
    <path d="M63 46 Q 70 52 74 44" stroke="#2F5D3A" strokeWidth="1.5" fill="none" />

    {/* Halter & Bridle */}
    <path d="M82 8 L76 16 L84 14 Z" fill="#963F2F" />
    <path d="M78 5 Q 73 9 75 16" stroke="#D9A441" strokeWidth="0.8" fill="none" />
  </svg>
);

// 3. Desert Dunes Camel Caravan (left lower margin)
export const CaravanCamelsSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 140 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-85 ${className || 'w-28 sm:w-32 h-auto'}`}
  >
    {/* Desert Dune Curve */}
    <path d="M0 65 Q 40 58 80 62 Q 115 65 140 58 L 140 70 L 0 70 Z" fill="#A6533B" fillOpacity="0.25" />

    {/* Driver leading caravan */}
    <circle cx="16" cy="38" r="3" fill="#5A3825" />
    <path d="M16 41 L16 56 L13 65 M16 56 L19 65" stroke="#5A3825" strokeWidth="1.2" />
    <path d="M16 44 L22 49" stroke="#5A3825" strokeWidth="1.2" />
    <line x1="22" y1="49" x2="35" y2="40" stroke="#5A3825" strokeWidth="0.75" strokeDasharray="2 1.5" />

    {/* Lead Camel */}
    <g transform="translate(34, 18) scale(0.42)">
      <path
        d="M26 62 C28 54 36 50 46 48 C50 48 56 42 60 28 C64 14 70 4 78 5 C83 6 85 10 82 16 C78 24 74 36 70 48 C76 49 84 43 92 40 C102 38 112 46 112 58 C112 70 104 76 88 76 L36 76 C28 76 24 70 26 62 Z"
        fill="#5A3825"
      />
      <rect x="36" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="46" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="80" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="90" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="65" y="46" width="26" height="22" rx="3" fill="#A6533B" />
    </g>

    {/* Reins between Camels */}
    <path d="M72 40 Q 82 46 92 40" stroke="#5A3825" strokeWidth="0.7" strokeDasharray="2 1.5" fill="none" />

    {/* Second Camel */}
    <g transform="translate(86, 21) scale(0.38)">
      <path
        d="M26 62 C28 54 36 50 46 48 C50 48 56 42 60 28 C64 14 70 4 78 5 C83 6 85 10 82 16 C78 24 74 36 70 48 C76 49 84 43 92 40 C102 38 112 46 112 58 C112 70 104 76 88 76 L36 76 C28 76 24 70 26 62 Z"
        fill="#5A3825"
      />
      <rect x="36" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="46" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="80" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="90" y="74" width="6" height="34" fill="#5A3825" />
      <rect x="65" y="46" width="26" height="22" rx="3" fill="#A6533B" />
    </g>
  </svg>
);

// 4. Sandstone Fort Ramparts & Chhatri Silhouette (right lower margin)
export const FortPalaceSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 130 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none drop-shadow-xs ${className || 'w-28 sm:w-32 h-auto'}`}
  >
    {/* Base Sandstone Rampart Wall */}
    <path d="M0 110 L130 110 L130 75 L0 75 Z" fill="#A6533B" fillOpacity="0.85" />
    {/* Fortress Merlons (Kangeras) */}
    <rect x="0" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="14" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="28" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="42" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="56" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="70" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="84" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="98" y="68" width="8" height="7" fill="#A6533B" />
    <rect x="112" y="68" width="8" height="7" fill="#A6533B" />

    {/* Central Royal Chhatri (Pavilion Dome) */}
    {/* Pillars */}
    <rect x="52" y="42" width="3" height="26" fill="#5A3825" />
    <rect x="64" y="42" width="3" height="26" fill="#5A3825" />
    <rect x="76" y="42" width="3" height="26" fill="#5A3825" />
    {/* Chhatri Cornice (Chhajja) */}
    <path d="M46 42 Q 65 38 84 42 L 86 44 L 44 44 Z" fill="#5A3825" />
    {/* Fluted Cupola Dome */}
    <path d="M48 38 C 50 20, 80 20, 82 38 Z" fill="#A6533B" stroke="#5A3825" strokeWidth="0.8" />
    {/* Kalash & Finial Spire */}
    <ellipse cx="65" cy="18" rx="2.5" ry="3.5" fill="#D9A441" />
    <line x1="65" y1="18" x2="65" y2="10" stroke="#D9A441" strokeWidth="1.2" />
    <circle cx="65" cy="9" r="1.2" fill="#963F2F" />
    {/* Royal Pennant Flag */}
    <path d="M65 11 L74 14 L65 17 Z" fill="#963F2F" />

    {/* Left Smaller Bastion Turret */}
    <rect x="12" y="54" width="22" height="15" fill="#8B452D" />
    <path d="M10 54 Q 23 48 36 54 Z" fill="#5A3825" />
    <ellipse cx="23" cy="46" rx="9" ry="6" fill="#A6533B" />
    <line x1="23" y1="40" x2="23" y2="34" stroke="#D9A441" strokeWidth="1" />

    {/* Right Architectural Jharokha Arch */}
    <rect x="94" y="50" width="24" height="18" fill="#8B452D" />
    <path d="M96 64 C96 55 106 52 106 52 C106 52 116 55 116 64 Z" fill="#FAF1DE" fillOpacity="0.4" />
  </svg>
);

// 5. Traditional Mandala / Rosette Edge Watermark
export const MandalaEdgeArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-20 sm:w-24 h-20 sm:h-24 pointer-events-none select-none ${className}`}
  >
    <circle cx="45" cy="45" r="40" stroke="#A6533B" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 2" />
    <circle cx="45" cy="45" r="32" stroke="#D9A441" strokeWidth="1" strokeOpacity="0.45" />
    <circle cx="45" cy="45" r="22" stroke="#2F5D3A" strokeWidth="0.75" strokeOpacity="0.3" />
    <circle cx="45" cy="45" r="8" fill="#FAF1DE" fillOpacity="0.7" stroke="#5A3825" strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="45" cy="45" r="3" fill="#D9A441" fillOpacity="0.8" />
    {/* 8-Petal Rosette */}
    <g stroke="#963F2F" strokeWidth="0.8" strokeOpacity="0.4" fill="#A6533B" fillOpacity="0.08">
      <path d="M45 13 C48 24 48 30 45 37 C42 30 42 24 45 13 Z" />
      <path d="M45 77 C48 66 48 60 45 53 C42 60 42 66 45 77 Z" />
      <path d="M13 45 C24 48 30 48 37 45 C30 42 24 42 13 45 Z" />
      <path d="M77 45 C66 48 60 48 53 45 C60 42 66 42 77 45 Z" />
      <path d="M22 22 C33 27 38 31 40 39 C31 38 27 33 22 22 Z" />
      <path d="M68 68 C57 63 52 59 50 51 C59 52 63 57 68 68 Z" />
      <path d="M68 22 C63 33 59 38 51 40 C52 31 57 27 68 22 Z" />
      <path d="M22 68 C27 57 31 52 39 50 C38 59 33 63 22 68 Z" />
    </g>
  </svg>
);

// 6. Corner Jharokha Arch Spandrel with Hanging Brass Lanterns & Silk Tassels
export const CornerJharokhaBracket: React.FC<{ isRight?: boolean }> = ({ isRight = false }) => (
  <svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute top-0 ${isRight ? 'right-0 -scale-x-100' : 'left-0'} w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 pointer-events-none select-none z-20`}
  >
    {/* Cusped Jharokha Corner Spandrel */}
    <path
      d="M0,0 L140,0 C112,0 82,14 62,38 C42,62 30,92 24,140 L0,140 Z"
      fill="#FAF1DE"
      fillOpacity="0.85"
      stroke="#A6533B"
      strokeWidth="1.2"
    />
    <path
      d="M0,0 L130,0 C102,0 74,12 54,34 C36,58 26,86 20,130 L0,130 Z"
      stroke="#D9A441"
      strokeWidth="0.9"
      strokeDasharray="2.5 2"
      fill="none"
    />

    {/* Lotus Rosette Corner Medallion */}
    <circle cx="36" cy="36" r="8" fill="#A6533B" fillOpacity="0.35" />
    <circle cx="36" cy="36" r="4.5" fill="#D9A441" />
    <circle cx="36" cy="36" r="1.8" fill="#FAF1DE" />

    {/* Hanging Brass Lantern 1 (Outer edge) */}
    <g transform="translate(19, 58)">
      <line x1="0" y1="0" x2="0" y2="26" stroke="#5A3825" strokeWidth="1" strokeDasharray="2 1.5" />
      <polygon points="0,26 -5,33 5,33" fill="#D9A441" />
      <rect x="-6" y="33" width="12" height="14" rx="2" fill="#FAF1DE" stroke="#A6533B" strokeWidth="0.8" />
      <circle cx="0" cy="40" r="3" fill="#D9A441" />
      <polygon points="-6,47 0,53 6,47" fill="#D9A441" />
      {/* Miniature Bell & Silk Tassel */}
      <circle cx="0" cy="55" r="1.5" fill="#963F2F" />
      <line x1="0" y1="56" x2="0" y2="64" stroke="#2F5D3A" strokeWidth="1.4" />
      <circle cx="0" cy="65" r="1" fill="#C69232" />
    </g>

    {/* Hanging Brass Lantern 2 (Inner edge) */}
    <g transform="translate(76, 14)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#5A3825" strokeWidth="1" strokeDasharray="2 1.5" />
      <path d="M-4,20 Q0,18 4,20 L3,29 Q0,31 -3,29 Z" fill="#D9A441" stroke="#5A3825" strokeWidth="0.6" />
      <circle cx="0" cy="31" r="1.5" fill="#963F2F" />
      {/* Silk Tassel */}
      <path d="M-2.5,33 L0,42 L2.5,33 Z" fill="#A6533B" />
    </g>
  </svg>
);

/**
 * Main Exported Component
 */
export const RajasthaniHeritageBackground: React.FC = () => {
  return (
    <>
      {/* 1. Continuous Textile Block-Print Borders */}
      <div className="rajasthani-page-border-top" />
      <div className="rajasthani-page-border-bottom" />
      <div className="hidden sm:block rajasthani-page-border-left" />
      <div className="hidden sm:block rajasthani-page-border-right" />

      {/* 2. Top Corner Jharokha Arch Spandrels & Lanterns (Framing Hero transition) */}
      <div className="hidden md:block">
        <CornerJharokhaBracket isRight={false} />
        <CornerJharokhaBracket isRight={true} />
      </div>

      {/* 3. Subtle Mandala Watermarks in Background (z-0, low opacity, never covers content) */}
      <div className="hidden 2xl:block absolute left-6 top-[280px] z-0 opacity-20 pointer-events-none">
        <MandalaEdgeArt />
      </div>
      <div className="hidden 2xl:block absolute right-6 top-[280px] z-0 opacity-20 pointer-events-none">
        <MandalaEdgeArt className="-scale-x-100" />
      </div>
      <div className="hidden 2xl:block absolute left-6 top-[1800px] z-0 opacity-20 pointer-events-none">
        <MandalaEdgeArt />
      </div>
      <div className="hidden 2xl:block absolute right-6 top-[1800px] z-0 opacity-20 pointer-events-none">
        <MandalaEdgeArt className="-scale-x-100" />
      </div>

      {/* 4. Lower Rajasthani Heritage Atmosphere Scene (Fort, Camel, Brass Vessels & Dry Fruits) */}
      <div className="rajasthani-lower-heritage-scene" />
    </>
  );
};
