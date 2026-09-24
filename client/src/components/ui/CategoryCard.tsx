import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  link,
  className = '',
}) => {
  return (
    <Link
      to={link}
      className={`group bg-white rounded-2xl border border-[#E7E0D0] p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between block ${className}`}
    >
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6EC] flex items-center justify-center mb-3">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="font-serif text-sm sm:text-base font-bold text-[#1F4D2E]">
          {name}
        </span>
        <div className="w-7 h-7 rounded-full bg-[#FAF6EC] group-hover:bg-[#2F5D3A] text-[#2F5D3A] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
