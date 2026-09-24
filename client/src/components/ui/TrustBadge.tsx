import React from 'react';
import {
  VegIcon,
  NoColoursIcon,
  RoastedIcon,
  QualityBadgeIcon,
  DeliveryTruckIcon,
} from './Icons';

export const TRUST_BADGES = [
  { icon: VegIcon, label: '100% Veg' },
  { icon: NoColoursIcon, label: 'No Artificial Colours' },
  { icon: RoastedIcon, label: 'Roasted Not Fried' },
  { icon: QualityBadgeIcon, label: 'Premium Quality' },
  { icon: DeliveryTruckIcon, label: 'Pan-India Delivery' },
];

export const TrustBadgeRow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E7E0D0] shadow-soft py-4 px-4 sm:px-8 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
        {TRUST_BADGES.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-center gap-3 px-3 py-2 sm:py-0 text-center sm:text-left"
            >
              <IconComponent className="w-8 h-8 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#2B2B2B]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
