// components/Common/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from "../Settings/themeUtils";

const SearchBar = ({
  placeholder = "Search...",
  value = "",
  onChange,
  className = "",
  size = "medium"
}) => {
  const { themeUtils } = useTheme();

  const sizes = {
    small: 'py-1.5 text-sm',
    medium: 'py-1.5 text-sm',
    large: 'py-1.5 text-base'
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: themeUtils.getTextColor(false, true) }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 pr-3 w-full rounded-lg border focus:ring-2 focus:outline-none transition-all ${sizes[size]}`}
        style={{
          backgroundColor: themeUtils.getBgColor("input"),
          borderColor: themeUtils.getBorderColor(),
          color: themeUtils.getTextColor(true),
        }}
      />
    </div>
  );
};

export default SearchBar;