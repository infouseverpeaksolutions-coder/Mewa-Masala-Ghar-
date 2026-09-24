import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface StoreCardProps {
  storeKey: 'foods' | 'baby' | 'care';
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  storeKey,
  title,
  subtitle,
  image,
  link,
}) => {
  const configs = {
    foods: {
      cardBg: 'bg-gradient-to-br from-[#1F4D2E] to-[#2F5D3A] text-white',
      titleColor: 'text-white',
      subColor: 'text-emerald-100',
      btnBg: 'bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E]',
    },
    baby: {
      cardBg: 'bg-gradient-to-br from-[#E6F4FA] to-[#CEECF8] text-[#1E6B86]',
      titleColor: 'text-[#1B5970]',
      subColor: 'text-[#3D778D]',
      btnBg: 'bg-[#2C8CAE] hover:bg-[#216F8C] text-white',
    },
    care: {
      cardBg: 'bg-gradient-to-br from-[#FCE9EC] to-[#FAD4DB] text-[#8E3B46]',
      titleColor: 'text-[#82323D]',
      subColor: 'text-[#964E58]',
      btnBg: 'bg-[#C26371] hover:bg-[#A84E5B] text-white',
    },
  };

  const config = configs[storeKey];

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 shadow-card flex flex-col justify-between overflow-hidden relative group transition-all duration-300 ${config.cardBg}`}
    >
      <div className="relative z-10 max-w-[65%]">
        <h3 className={`font-serif text-xl sm:text-2xl font-bold mb-1.5 ${config.titleColor}`}>
          {title}
        </h3>
        <p className={`text-xs sm:text-sm mb-6 leading-relaxed ${config.subColor}`}>
          {subtitle}
        </p>

        <Link
          to={link}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 group-hover:shadow-md ${config.btnBg}`}
        >
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="absolute right-2 bottom-2 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none transition-transform duration-300 group-hover:scale-105">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain drop-shadow-md"
          loading="lazy"
        />
      </div>
    </div>
  );
};
