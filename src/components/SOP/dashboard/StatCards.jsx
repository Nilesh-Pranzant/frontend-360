// components/StatCards.jsx
import React, { useState } from "react";
import { ClipboardList, CheckSquare, Clock, Shield } from "lucide-react";

export default function StatCards({ data, themeUtils, theme }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const mainStats = [
    {
      name: "Total SOPs",
      value: data.totalSOPs.toString(),
      icon: ClipboardList,
      color: "blue",
    },
    {
      name: "SOPs Analyzed",
      value: data.analyzedSOPs.toString(),
      icon: CheckSquare,
      color: "green",
    },
    {
      name: "Pending Reviews",
      value: data.pendingReviews.toString(),
      icon: Clock,
      color: "orange",
    },
    {
      name: "Approved SOPs",
      value: data.approvedSOPs.toString(),
      icon: Shield,
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      orange: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[color] || colors.blue;
  };

  const getGradientStyle = (color, opacity = 1) => {
    const isDark = theme.mode === "dark";
    const gradients = {
      blue: isDark
        ? `linear-gradient(135deg, rgba(59, 130, 246, ${opacity}), rgba(139, 92, 246, ${opacity}))`
        : `linear-gradient(135deg, rgba(59, 130, 246, ${opacity}), rgba(99, 102, 241, ${opacity}))`,
      green: isDark
        ? `linear-gradient(135deg, rgba(16, 185, 129, ${opacity}), rgba(5, 150, 105, ${opacity}))`
        : `linear-gradient(135deg, rgba(16, 185, 129, ${opacity}), rgba(34, 197, 94, ${opacity}))`,
      purple: isDark
        ? `linear-gradient(135deg, rgba(139, 92, 246, ${opacity}), rgba(124, 58, 237, ${opacity}))`
        : `linear-gradient(135deg, rgba(139, 92, 246, ${opacity}), rgba(167, 139, 250, ${opacity}))`,
      orange: isDark
        ? `linear-gradient(135deg, rgba(249, 115, 22, ${opacity}), rgba(234, 88, 12, ${opacity}))`
        : `linear-gradient(135deg, rgba(249, 115, 22, ${opacity}), rgba(251, 146, 60, ${opacity}))`,
    };
    return { background: gradients[color] || gradients.blue };
  };

  const getCardStyle = (color) => {
    const borderColor = themeUtils.getAccentColor
      ? themeUtils.getAccentColor(color)
      : color === "blue"
      ? "#3b82f6"
      : color === "green"
      ? "#10b981"
      : color === "purple"
      ? "#8b5cf6"
      : "#f97316";

    return {
      backgroundColor: themeUtils.getBgColor("card"),
      boxShadow: theme.mode === "dark"
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      borderLeft: `4px solid ${borderColor}`,
      transition: "all 0.3s ease",
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {mainStats.map((stat) => {
        const Icon = stat.icon;
        const isHovered = hoveredCard === stat.name;

        return (
          <div
            key={stat.name}
            className="p-3 rounded-xl relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
            style={getCardStyle(stat.color)}
            onMouseEnter={() => setHoveredCard(stat.name)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                ...getGradientStyle(stat.color, 0.1),
                opacity: isHovered ? 1 : 0,
              }}
            />

            <div className="relative z-10">
              {/* Icon + Title side by side */}
              <div className="flex items-center gap-1.5 mb-3">
                <div
                  className={`p-3 rounded-lg transition-all duration-300 ${getColorClasses(
                    stat.color
                  )}`}
                  style={{
                    transform: isHovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
                    boxShadow: isHovered
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                >
                  <Icon size={15} />
                </div>
                <h3
                  className="text-sm font-medium"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  {stat.name}
                </h3>
              </div>

              <p
                className="text-2xl font-bold transition-all duration-300"
                style={{
                  color: themeUtils.getTextColor(true),
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}