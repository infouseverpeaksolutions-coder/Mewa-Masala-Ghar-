import React from 'react';

/**
 * Royal Rajasthani Jharokha Arch & Hanging Bells
 * Placed immediately below the Hero section.
 * Hand-crafted vector SVG that scales crisp to any screen resolution without blur.
 */
export const RoyalJharokhaArch: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden select-none pointer-events-none -mt-1 mb-2 sm:mb-6 ${className}`}>
      <svg
        className="w-full h-20 sm:h-28 lg:h-36"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gradient for Arch Cornice */}
          <linearGradient id="royalCorniceGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" stopOpacity="0.8" />
            <stop offset="20%" stopColor="#D9A441" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFF4D0" stopOpacity="1" />
            <stop offset="80%" stopColor="#D9A441" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0.8" />
          </linearGradient>

          {/* Bronze Bell Gradient */}
          <linearGradient id="royalBellBronze" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5B85C" />
            <stop offset="65%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#6E480C" />
          </linearGradient>

          {/* Diya Lamp Warm Ambient Glow */}
          <radialGradient id="royalLampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFECA8" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#D9A441" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top Stone Cornice Molding */}
        <rect x="0" y="0" width="1440" height="12" fill="url(#royalCorniceGold)" />
        <line x1="0" y1="12" x2="1440" y2="12" stroke="#8F3E44" strokeWidth="1.8" />

        {/* Palace Dentils / Merlons along top cornice */}
        <path
          d="
            M0,12 
            L0,19 L15,19 L15,12 L30,12 L30,19 L45,19 L45,12 L60,12 L60,19 L75,19 L75,12 L90,12 L90,19 L105,19 L105,12 L120,12 L120,19 L135,19 L135,12 L150,12
            L150,19 L165,19 L165,12 L180,12 L180,19 L195,19 L195,12 L210,12 L210,19 L225,19 L225,12 L240,12 L240,19 L255,19 L255,12 L270,12 L270,19 L285,19 L285,12 L300,12
            L300,19 L315,19 L315,12 L330,12 L330,19 L345,19 L345,12 L360,12 L360,19 L375,19 L375,12 L390,12 L390,19 L405,19 L405,12 L420,12 L420,19 L435,19 L435,12 L450,12
            L450,19 L465,19 L465,12 L480,12 L480,19 L495,19 L495,12 L510,12 L510,19 L525,19 L525,12 L540,12 L540,19 L555,19 L555,12 L570,12 L570,19 L585,19 L585,12 L600,12
            L600,19 L615,19 L615,12 L630,12 L630,19 L645,19 L645,12 L660,12 L660,19 L675,19 L675,12 L690,12 L690,19 L705,19 L705,12 L720,12 L720,19 L735,19 L735,12 L750,12
            L750,19 L765,19 L765,12 L780,12 L780,19 L795,19 L795,12 L810,12 L810,19 L825,19 L825,12 L840,12 L840,19 L855,19 L855,12 L870,12 L870,19 L885,19 L885,12 L900,12
            L900,19 L915,19 L915,12 L930,12 L930,19 L945,19 L945,12 L960,12 L960,19 L975,19 L975,12 L990,12 L990,19 L1005,19 L1005,12 L1020,12 L1020,19 L1035,19 L1035,12 L1050,12
            L1050,19 L1065,19 L1065,12 L1080,12 L1080,19 L1095,19 L1095,12 L1110,12 L1110,19 L1125,19 L1125,12 L1140,12 L1140,19 L1155,19 L1155,12 L1170,12 L1170,19 L1185,19 L1185,12 L1200,12
            L1200,19 L1215,19 L1215,12 L1230,12 L1230,19 L1245,19 L1245,12 L1260,12 L1260,19 L1275,19 L1275,12 L1290,12 L1290,19 L1305,19 L1305,12 L1320,12 L1320,19 L1335,19 L1335,12 L1350,12
            L1350,19 L1365,19 L1365,12 L1380,12 L1380,19 L1395,19 L1395,12 L1410,12 L1410,19 L1425,19 L1425,12 L1440,12
          "
          fill="#B8860B"
          fillOpacity="0.32"
        />

        {/* Multi-foil Scalloped Jharokha Arch Curves */}
        <path
          d="
            M0,19 
            C120,19 180,62 240,62 
            C300,62 360,19 480,19 
            C600,19 660,72 720,72 
            C780,72 840,19 960,19 
            C1080,19 1140,62 1200,62 
            C1260,62 1320,19 1440,19
          "
          stroke="#B8860B"
          strokeWidth="2.8"
          fill="none"
        />

        <path
          d="
            M0,22 
            C120,22 180,66 240,66 
            C300,66 360,22 480,22 
            C600,22 660,76 720,76 
            C780,76 840,22 960,22 
            C1080,22 1140,66 1200,66 
            C1260,66 1320,22 1440,22
          "
          stroke="#D9A441"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Center Grand Lotus Crest & Hanging Brass Lamp/Bell (X: 720) */}
        <g transform="translate(720, 74)">
          {/* Hanging Brass Chain */}
          <line x1="0" y1="0" x2="0" y2="40" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="0" cy="42" r="3.5" fill="url(#royalBellBronze)" />
          {/* Hanging Bell / Ghungroo */}
          <path d="M-8,46 Q0,44 8,46 L5,58 Q0,60 -5,58 Z" fill="url(#royalBellBronze)" stroke="#D9A441" strokeWidth="0.8" />
          <circle cx="0" cy="59" r="2.2" fill="#D9A441" />
          {/* Warm Ambient Glow */}
          <circle cx="0" cy="45" r="14" fill="url(#royalLampGlow)" />
          {/* Lotus Crest */}
          <path d="M0,-8 C-12,-18 0,-30 0,-30 C0,-30 12,-18 0,-8 Z" fill="#D9A441" fillOpacity="0.85" />
          <circle cx="0" cy="-6" r="3" fill="#8F3E44" />
        </g>

        {/* Left Secondary Arch Crest & Hanging Bell (X: 240) */}
        <g transform="translate(240, 64)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="#B8860B" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="0" cy="32" r="3" fill="url(#royalBellBronze)" />
          <path d="M-6,35 Q0,33 6,35 L4,44 Q0,46 -4,44 Z" fill="url(#royalBellBronze)" stroke="#D9A441" strokeWidth="0.7" />
          <circle cx="0" cy="45" r="1.8" fill="#D9A441" />
          <circle cx="0" cy="35" r="10" fill="url(#royalLampGlow)" />
          <path d="M0,-5 C-9,-12 0,-20 0,-20 C0,-20 9,-12 0,-5 Z" fill="#D9A441" fillOpacity="0.75" />
        </g>

        {/* Right Secondary Arch Crest & Hanging Bell (X: 1200) */}
        <g transform="translate(1200, 64)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="#B8860B" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="0" cy="32" r="3" fill="url(#royalBellBronze)" />
          <path d="M-6,35 Q0,33 6,35 L4,44 Q0,46 -4,44 Z" fill="url(#royalBellBronze)" stroke="#D9A441" strokeWidth="0.7" />
          <circle cx="0" cy="45" r="1.8" fill="#D9A441" />
          <circle cx="0" cy="35" r="10" fill="url(#royalLampGlow)" />
          <path d="M0,-5 C-9,-12 0,-20 0,-20 C0,-20 9,-12 0,-5 Z" fill="#D9A441" fillOpacity="0.75" />
        </g>

        {/* Flanking Miniature Bells (X: 480, 960) */}
        <g transform="translate(480, 21)">
          <line x1="0" y1="0" x2="0" y2="25" stroke="#B8860B" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="0" cy="27" r="2.2" fill="url(#royalBellBronze)" />
          <path d="M-4,29 Q0,28 4,29 L3,36 Q0,38 -3,36 Z" fill="url(#royalBellBronze)" />
          <circle cx="0" cy="37" r="1.2" fill="#D9A441" />
        </g>
        <g transform="translate(960, 21)">
          <line x1="0" y1="0" x2="0" y2="25" stroke="#B8860B" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="0" cy="27" r="2.2" fill="url(#royalBellBronze)" />
          <path d="M-4,29 Q0,28 4,29 L3,36 Q0,38 -3,36 Z" fill="url(#royalBellBronze)" />
          <circle cx="0" cy="37" r="1.2" fill="#D9A441" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Royal Rajasthani Palace Border (Left & Right margins)
 * Framed like an illuminated Rajput miniature manuscript.
 */
export const RoyalRajasthaniBorders: React.FC = () => {
  return (
    <>
      <div className="hidden xl:block rajasthani-side-border-left" aria-hidden="true" />
      <div className="hidden xl:block rajasthani-side-border-right" aria-hidden="true" />
    </>
  );
};

/**
 * Royal Rajasthani Fort Battlement & Crest Divider
 * Elegant section divider with Mehrangarh / Jaisalmer fort silhouette crest.
 */
export const RoyalFortDivider: React.FC<{
  title?: string;
  className?: string;
}> = ({ title = 'Handcrafted In Marwar, Rajasthan', className = '' }) => {
  return (
    <div className={`relative py-4 flex items-center justify-center select-none ${className}`}>
      <div className="w-full max-w-5xl mx-auto px-4 flex items-center justify-center gap-3 sm:gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-amber-700/50 dark:via-amber-400/25 dark:to-amber-500/40" />

        <div className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FAF5EA]/90 dark:bg-[#152119]/90 border border-amber-600/30 dark:border-amber-500/30 shadow-2xs text-[#7A363B] dark:text-[#E5B85C] text-[11px] sm:text-xs font-serif font-semibold tracking-wide">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,20 L22,20 L22,12 L19,12 L19,10 L16,10 L16,12 L14,12 L14,9 L12,7 L10,9 L10,12 L8,12 L8,10 L5,10 L5,12 L2,12 Z" />
          </svg>
          <span>{title}</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,20 L22,20 L22,12 L19,12 L19,10 L16,10 L16,12 L14,12 L14,9 L12,7 L10,9 L10,12 L8,12 L8,10 L5,10 L5,12 L2,12 Z" />
          </svg>
        </div>

        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-600/30 to-amber-700/50 dark:via-amber-400/25 dark:to-amber-500/40" />
      </div>
    </div>
  );
};
