// components/Common/Button.jsx
import React from 'react';

const Button = ({
  children,
  variant = 'default',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: {
      bg: '#ffffff',
      text: '#1f2937',
      border: '#d1d5db',
      hover: '#f9fafb',
      focus: '#9ca3af'
    },
    primary: {
      bg: '#3b82f6',
      text: '#ffffff',
      border: '#3b82f6',
      hover: '#2563eb',
      focus: '#93c5fd'
    },
    success: {
      bg: '#10b981',
      text: '#ffffff',
      border: '#10b981',
      hover: '#059669',
      focus: '#6ee7b7'
    },
    danger: {
      bg: '#ef4444',
      text: '#ffffff',
      border: '#ef4444',
      hover: '#dc2626',
      focus: '#fca5a5'
    },
    warning: {
      bg: '#f59e0b',
      text: '#ffffff',
      border: '#f59e0b',
      hover: '#d97706',
      focus: '#fcd34d'
    },
    ghost: {
      bg: 'transparent',
      text: '#4b5563',
      border: 'transparent',
      hover: '#f3f4f6',
      focus: '#9ca3af'
    },
    outline: {
      bg: 'transparent',
      text: '#3b82f6',
      border: '#d1d5db',
      hover: '#f9fafb',
      focus: '#93c5fd'
    }
  };

  const sizes = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-2 py-1 text-sm',
    large: 'px-2 py-1 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  // Safely get the variant, fallback to default
  const selectedVariant = variants[variant] || variants.default;

  // Remove themeUtils logic since it's causing issues
  const buttonStyle = {
    backgroundColor: selectedVariant.bg,
    color: selectedVariant.text,
    border: `1px solid ${selectedVariant.border}`,
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${widthClass} ${className}`}
      style={buttonStyle}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
    
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 mr-2" />
      )}
    
      {children}
    
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

export default Button;