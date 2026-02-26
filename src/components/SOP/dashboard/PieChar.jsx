// components/PieChart.jsx
import React from "react";

export default function PieChart({ data, themeUtils, theme }) {
  const width = 320;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 45;
  const innerRadius = radius * 0.58;
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  let currentAngle = 0;
  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return slice;
  });
  
  const createDonutSlice = (startAngle, endAngle, color) => {
    if (endAngle - startAngle === 360) {
      endAngle -= 0.0001;
    }
    const start = startAngle - 90;
    const end = endAngle - 90;
    
    const outerX1 = centerX + radius * Math.cos((start * Math.PI) / 180);
    const outerY1 = centerY + radius * Math.sin((start * Math.PI) / 180);
    const outerX2 = centerX + radius * Math.cos((end * Math.PI) / 180);
    const outerY2 = centerY + radius * Math.sin((end * Math.PI) / 180);
    
    const innerX1 = centerX + innerRadius * Math.cos((start * Math.PI) / 180);
    const innerY1 = centerY + innerRadius * Math.sin((start * Math.PI) / 180);
    const innerX2 = centerX + innerRadius * Math.cos((end * Math.PI) / 180);
    const innerY2 = centerY + innerRadius * Math.sin((end * Math.PI) / 180);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${outerX1} ${outerY1} A ${radius} ${radius} 0 ${largeArc} 1 ${outerX2} ${outerY2} L ${innerX2} ${innerY2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1} Z`;
  };
  
  const textColor = themeUtils.getTextColor ? themeUtils.getTextColor(true) : "#1e293b";
  const secondaryTextColor = themeUtils.getTextColor ? themeUtils.getTextColor(false) : "#64748b";
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} style={{ width: "100%", height: "auto", maxWidth: "320px" }}>
        <defs>
          <filter id="shadow-cat" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {slices.map((slice, idx) => {
          const path = createDonutSlice(slice.startAngle, slice.endAngle, slice.color);
          const midAngle = ((slice.startAngle + slice.endAngle) / 2 - 90);
          const rad = (midAngle * Math.PI) / 180;
          
          // Improved label positioning - farther from center + slight offset
          const labelRadius = radius + 38; // ← increased distance
          const labelX = centerX + labelRadius * Math.cos(rad);
          const labelY = centerY + labelRadius * Math.sin(rad) + 4; // slight vertical correction
          
          // Optional: small line connector
          const connectorX = centerX + (radius + 8) * Math.cos(rad);
          const connectorY = centerY + (radius + 8) * Math.sin(rad);

          return (
            <g key={idx}>
              <path 
                d={path} 
                fill={slice.color} 
                opacity="0.9" 
                stroke="white" 
                strokeWidth="2" 
                filter="url(#shadow-cat)"
              >
                <title>{slice.name}: {slice.value} ({slice.percentage.toFixed(1)}%)</title>
              </path>

              {/* Optional thin connector line */}
              <line
                x1={connectorX}
                y1={connectorY}
                x2={labelX}
                y2={labelY - 4}
                stroke={slice.color}
                strokeWidth="1.5"
                opacity="0.6"
              />

              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fill={slice.color}
                fontSize="10"
                fontWeight="600"
                pointerEvents="none"
              >
                {slice.name.length > 12 
                  ? slice.name.substring(0, 12) + "..." 
                  : slice.name} 
                {' '}
                ({slice.value})
              </text>
            </g>
          );
        })}
        
        <circle cx={centerX} cy={centerY} r={innerRadius} fill={themeUtils.getBgColor("card")} />
        
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          fill={textColor}
          fontSize="13"
          fontWeight="bold"
        >
          Total SOPs
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fill="#3b82f6"
          fontSize="26"
          fontWeight="bold"
        >
          {total}
        </text>
      </svg>
      
      {/* Legend - moved below and using grid layout */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-sm shadow-md flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate" style={{ color: textColor }}>
                {item.name}
              </span>
              <span className="text-xs opacity-80" style={{ color: secondaryTextColor }}>
                {item.value} SOPs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}