import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LeafIcon } from './Icons';

export interface SectionHeadingProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  leafColor?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  viewAllLink,
  viewAllText = 'View All',
  leafColor = '#2F5D3A',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 sm:mb-8 ${className}`}>
      <div className="flex items-center gap-2.5">
        <LeafIcon className="w-5 h-5 shrink-0" color={leafColor} />
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E] tracking-tight">
          {title}
        </h2>
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-xs sm:text-sm font-bold text-[#2F5D3A] hover:text-[#1F4D2E] inline-flex items-center gap-1.5 transition-colors group"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};
