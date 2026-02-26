// components/BarChart.jsx
import React, { useState } from "react";

export default function BarChart({ data, themeUtils, theme }) {
  const [tooltip, setTooltip] = useState(null);

  const width = 500;
  const height = 340; // slightly increased to give space for tooltip
  const padding = 50;
  const paddingBottom = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - paddingBottom;
  const maxValue = Math.max(...data.flatMap(d => [d.uploaded, d.analyzed]), 40);

  const barGroupWidth = chartWidth / data.length;
  const barWidth = (barGroupWidth - 40) / 2;
  const gapBetweenBars = 8;

  const gridColor = themeUtils.getBorderColor ? themeUtils.getBorderColor() : "#e2e8f0";
  const textColor = themeUtils.getTextColor ? themeUtils.getTextColor(true) : "#1e293b";
  const secondaryTextColor = themeUtils.getTextColor ? themeUtils.getTextColor(false) : "#64748b";

  const handleMouseEnter = (e, month, uploaded, analyzed) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      month,
      uploaded,
      analyzed,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={width} height={height} style={{ width: "100%", height: "auto", maxWidth: "500px" }}>
        {/* Grid lines */}
        {Array.from({ length: 5 }, (_, i) => {
          const value = (maxValue / 4) * i;
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={padding + (chartHeight / 4) * (4 - i)}
                x2={width - padding}
                y2={padding + (chartHeight / 4) * (4 - i)}
                stroke={gridColor}
                strokeDasharray="4"
              />
              <text
                x={padding - 10}
                y={padding + (chartHeight / 4) * (4 - i) + 4}
                textAnchor="end"
                fill={secondaryTextColor}
                fontSize="11"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const uploadedHeight = (d.uploaded / maxValue) * chartHeight;
          const analyzedHeight = (d.analyzed / maxValue) * chartHeight;

          const groupCenter = padding + barGroupWidth * i + barGroupWidth / 2;
          const uploadedX = groupCenter - barWidth - gapBetweenBars / 2;
          const analyzedX = groupCenter + gapBetweenBars / 2;

          const uploadedY = padding + chartHeight - uploadedHeight;
          const analyzedY = padding + chartHeight - analyzedHeight;

          return (
            <g key={i}>
              {/* Uploaded Bar */}
              <rect
                x={uploadedX}
                y={uploadedY}
                width={barWidth}
                height={uploadedHeight}
                fill="#8b5cf6"
                rx="4"
                onMouseEnter={(e) => handleMouseEnter(e, d.month, d.uploaded, d.analyzed)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              />

              <text
                x={uploadedX + barWidth / 2}
                y={uploadedY - 5}
                textAnchor="middle"
                fill={textColor}
                fontSize="11"
                fontWeight="bold"
                pointerEvents="none"
              >
                {d.uploaded}
              </text>

              {/* Analyzed / Approved Bar */}
              <rect
                x={analyzedX}
                y={analyzedY}
                width={barWidth}
                height={analyzedHeight}
                fill="#10b981"
                rx="4"
                onMouseEnter={(e) => handleMouseEnter(e, d.month, d.uploaded, d.analyzed)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              />

              <text
                x={analyzedX + barWidth / 2}
                y={analyzedY - 5}
                textAnchor="middle"
                fill={textColor}
                fontSize="11"
                fontWeight="bold"
                pointerEvents="none"
              >
                {d.analyzed}
              </text>

              {/* Month label */}
              <text
                x={groupCenter}
                y={height - 25}
                textAnchor="middle"
                fill={secondaryTextColor}
                fontSize="11"
                transform={`rotate(-45, ${groupCenter}, ${height - 25})`}
                pointerEvents="none"
              >
                {d.month}
              </text>
            </g>
          );
        })}

        <text
          x={padding - 35}
          y={padding - 15}
          fill={textColor}
          fontSize="12"
          fontWeight="bold"
        >
          Count
        </text>
      </svg>

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 px-3 py-2 text-sm rounded-lg shadow-xl border"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
            backgroundColor: theme.mode === "dark" ? "#1e293b" : "#ffffff",
            color: theme.mode === "dark" ? "#e2e8f0" : "#1e293b",
            borderColor: theme.mode === "dark" ? "#475569" : "#e2e8f0",
            boxShadow:
              theme.mode === "dark"
                ? "0 10px 15px -3px rgba(0,0,0,0.5)"
                : "0 10px 15px -3px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          <div className="font-semibold mb-1">{tooltip.month}</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Uploaded: <strong>{tooltip.uploaded}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Approved: <strong>{tooltip.analyzed}</strong></span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-purple-500 shadow-md"></div>
          <span className="text-xs font-semibold" style={{ color: textColor }}>
            Uploaded
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-green-500 shadow-md"></div>
          <span className="text-xs font-semibold" style={{ color: textColor }}>
            Approved
          </span>
        </div>
      </div>
    </div>
  );
}