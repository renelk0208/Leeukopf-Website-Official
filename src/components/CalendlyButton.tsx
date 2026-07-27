import React from 'react';
import { Calendar } from 'lucide-react';

interface CalendlyButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function CalendlyButton({ 
  className = '', 
  variant = 'primary',
  size = 'md',
  showIcon = true 
}: CalendlyButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Check if Calendly is loaded
    if (typeof window !== 'undefined') {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: 'https://calendly.com/leeukopf-info' });
      } else {
        console.error('Calendly widget script failed to load, falling back to direct link');
        // Fallback: open in new tab
        window.open('https://calendly.com/leeukopf-info', '_blank', 'noopener,noreferrer');
      }
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-[#1F2566] hover:bg-[#161B4C] text-white',
    secondary: 'bg-secondary hover:bg-secondary-700 text-white',
    outline: 'border-2 border-[#1F2566] text-[#1F2566] hover:bg-[#1F2566] hover:text-white'
  };

  return (
    <a
      href="https://calendly.com/leeukopf-info"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg transition-all duration-200 
        hover:scale-105 shadow-sm hover:shadow-md
        min-h-[44px]
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
      `}
      aria-label="Schedule an appointment"
    >
      {showIcon && <Calendar size={20} aria-hidden="true" />}
      <span>Book Appointment</span>
    </a>
  );
}

// Extend the Window interface to include Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}
