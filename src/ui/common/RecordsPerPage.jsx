// components/Common/RecordsPerPage.jsx
import React from 'react';
import { useTheme } from "../Settings/themeUtils";

const RecordsPerPage = ({
  value,
  onChange,
  options = [10, 25, 50],
  className = "",
  allValue = "ALL" // You can customize what value represents "ALL"
}) => {
  const { themeUtils } = useTheme();

  // Handle the change event
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    // If "ALL" is selected, pass null, Infinity, or a special value
    // You can adjust this based on how your parent component handles it
    if (selectedValue === allValue) {
      onChange(null); // or Infinity, or "ALL" - whatever works for your use case
    } else {
      onChange(Number(selectedValue));
    }
  };

  // Determine what value to show in the select
  const displayValue = value === null || value === Infinity || value === "ALL" ? allValue : value;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm whitespace-nowrap" style={{ color: themeUtils.getTextColor(false) }}>
        Records per page:
      </span>
      <select
        value={displayValue}
        onChange={handleChange}
        className="px-3 py-1.5 rounded-lg border text-sm focus:ring-2 focus:outline-none transition-all"
        style={{
          backgroundColor: themeUtils.getBgColor("input"),
          borderColor: themeUtils.getBorderColor(),
          color: themeUtils.getTextColor(true),
        }}
      >
         <option key={allValue} value={allValue}>
          ALL
        </option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
       
      </select>
    </div>
  );
};

export default RecordsPerPage;