import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  return (
    <div 
      className={`
        bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 lg:p-6 
        ${hover ? 'card-interactive cursor-pointer hover:bg-slate-700/50 hover:border-slate-600/50' : ''}
        animate-fade-in-up
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation active:scale-95';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-500/50',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 focus:ring-2 focus:ring-slate-500/50',
    outline: 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white focus:ring-2 focus:ring-indigo-500/50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs sm:text-sm min-h-[36px]',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg min-h-[48px] sm:min-h-[52px]'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};