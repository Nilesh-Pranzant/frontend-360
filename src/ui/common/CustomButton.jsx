import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from "../Settings/themeUtils";

const CustomButton = ({ 
  children, 
  onClick, 
  type = 'primary', 
  disabled = false, 
  loading = false, 
  className = '',
  style = {} 
}) => {
  const { theme, themeUtils } = useTheme();
  
  const getButtonStyles = () => {
    let bgColor, textColor, borderColor;
    
    switch (type) {
      case 'primary':
        bgColor = theme.headerBg;
        textColor = '#ffffff';
        borderColor = theme.headerBg;
        break;
      case 'secondary':
        bgColor = themeUtils.getBgColor("card");
        textColor = themeUtils.getTextColor(true);
        borderColor = themeUtils.getBorderColor();
        break;
      case 'success':
        bgColor = '#10b981';
        textColor = '#ffffff';
        borderColor = '#10b981';
        break;
      case 'danger':
        bgColor = '#ef4444';
        textColor = '#ffffff';
        borderColor = '#ef4444';
        break;
      case 'warning':
        bgColor = '#f59e0b';
        textColor = '#ffffff';
        borderColor = '#f59e0b';
        break;
      case 'info':
        bgColor = '#3b82f6';
        textColor = '#ffffff';
        borderColor = '#3b82f6';
        break;
      case 'header':
        bgColor = theme.headerBg;
        textColor = '#ffffff';
        borderColor = theme.headerBg;
        break;
      default:
        bgColor = theme.headerBg;
        textColor = '#ffffff';
        borderColor = theme.headerBg;
    }
    
    return {
      backgroundColor: disabled ? `${bgColor}80` : bgColor,
      color: disabled ? `${textColor}80` : textColor,
      borderColor: disabled ? `${borderColor}80` : borderColor,
      ...style
    };
  };
  
  return (
    <button
      className={`px-4 py-1 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {children}
    </button>
  );
};

export default CustomButton;