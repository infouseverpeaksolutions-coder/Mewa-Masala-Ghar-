import React from 'react';
import {
  VegIcon,
  NoColoursIcon,
  RoastedIcon,
  FlourIcon,
  DeliveryTruckIcon,
  BranchFlourishLeft,
  BranchFlourishRight,
} from './ui/Icons';

export const TrustRow: React.FC = () => {
  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex items-center justify-between bg-transparent py-4 sm:py-6">
        {/* Left leaf flourish illustration */}
        <div className="hidden lg:block shrink-0 pr-2">
          <BranchFlourishLeft className="w-20 lg:w-24 h-8 text-[#2F5D3A]" color="#2F5D3A" />
        </div>

        {/* 5 Trust Items with thin vertical dividers */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E0D0]/80">
          {/* Item 1: 100% Veg */}
          <div className="flex flex-col items-center text-center px-2 py-2">
            <VegIcon className="w-8 h-8 mb-2" color="#2F5D3A" />
            <span className="text-xs sm:text-[13px] font-bold text-[#1F4D2E]">
              100% Veg
            </span>
          </div>

          {/* Item 2: No Artificial Colours */}
          <div className="flex flex-col items-center text-center px-2 py-2">
            <NoColoursIcon className="w-8 h-8 mb-2" color="#2F5D3A" />
            <span className="text-xs sm:text-[13px] font-bold text-[#1F4D2E]">
              No Artificial Colours
            </span>
          </div>

          {/* Item 3: Roasted Not Fried */}
          <div className="flex flex-col items-center text-center px-2 py-2">
            <RoastedIcon className="w-8 h-8 mb-2" color="#2F5D3A" />
            <span className="text-xs sm:text-[13px] font-bold text-[#1F4D2E]">
              Roasted Not Fried
            </span>
          </div>

          {/* Item 4: Stone-Ground Flour */}
          <div className="flex flex-col items-center text-center px-2 py-2">
            <FlourIcon className="w-8 h-8 mb-2" color="#2F5D3A" />
            <span className="text-xs sm:text-[13px] font-bold text-[#1F4D2E]">
              Stone-Ground Flour
            </span>
          </div>

          {/* Item 5: Pan-India Delivery */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center px-2 py-2">
            <DeliveryTruckIcon className="w-8 h-8 mb-2" color="#2F5D3A" />
            <span className="text-xs sm:text-[13px] font-bold text-[#1F4D2E]">
              Pan-India Delivery
            </span>
          </div>
        </div>

        {/* Right leaf flourish illustration */}
        <div className="hidden lg:block shrink-0 pl-2">
          <BranchFlourishRight className="w-20 lg:w-24 h-8 text-[#2F5D3A]" color="#2F5D3A" />
        </div>
      </div>
    </section>
  );
};
