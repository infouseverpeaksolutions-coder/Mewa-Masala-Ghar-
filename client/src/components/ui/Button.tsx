import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'store';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'text-xs px-4 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-7 py-3 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white shadow-sm hover:shadow-md focus:ring-[#2F5D3A]',
    gold:
      'bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] shadow-sm hover:shadow-md focus:ring-[#D9A441]', // Dark green text for WCAG AA contrast!
    outline:
      'border-2 border-[#2F5D3A] text-[#2F5D3A] hover:bg-[#2F5D3A] hover:text-white focus:ring-[#2F5D3A]',
    ghost:
      'text-[#2F5D3A] hover:bg-[#2F5D3A]/10 focus:ring-[#2F5D3A]',
    store:
      'bg-[var(--store-primary,#2F5D3A)] hover:opacity-90 text-white shadow-sm focus:ring-[var(--store-primary,#2F5D3A)]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
      {withArrow && !isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
};
