import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-theme-border p-3 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-zinc-200 rounded-xl mb-3" />
      <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-100 rounded w-1/2 mb-3" />
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-zinc-100">
        <div className="h-5 bg-zinc-200 rounded w-16" />
        <div className="h-8 bg-zinc-200 rounded-lg w-24" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return <div className="w-full h-[420px] bg-zinc-200 animate-pulse rounded-3xl mb-8" />;
};

export const PageHeaderSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-10 space-y-3 animate-pulse">
      <div className="h-8 bg-zinc-200 rounded-lg w-1/2 mx-auto" />
      <div className="h-4 bg-zinc-100 rounded w-3/4 mx-auto" />
    </div>
  );
};
