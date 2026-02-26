// components/Common/Card.jsx
import React from "react";
import { useTheme } from "../Settings/themeUtils";

const Card = ({
  children,
  className = "",
  padding = "p-2",
  bgColor,
  borderColor,
  shadow = "shadow-sm",
  hover = false,
  loading = false,
  noBorder = false,
}) => {
  const { theme, themeUtils } = useTheme();

  // Use provided colors or fall back to theme defaults
  const cardStyle = {
    backgroundColor: bgColor || themeUtils.getBgColor("card"),
    borderColor: noBorder ? "transparent" : (borderColor || themeUtils.getBorderColor()),
  };

  if (loading) {
    return (
      <div
        className={`rounded-xl ${noBorder ? "" : "border"} ${padding} ${shadow} ${className}`}
        style={cardStyle}
      >
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl ${noBorder ? "" : "border"} ${padding} ${shadow} ${hover ? "transition-all duration-200 hover:shadow-md" : ""
        } ${className}`}
      style={cardStyle}
    >
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({ children, className = "" }) => {
  const { theme, themeUtils } = useTheme();
  return <div className={`mb-1 ${className}`}>{children}</div>;
};

// Card Title Component
export const CardTitle = ({ children, className = "" }) => {
  const { theme, themeUtils } = useTheme();
  const headerTextGradientStyle = {
    background: `linear-gradient(to right, ${theme.headerBg || "#3B82F6"}, ${theme.navbarBg || "#8B5CF6"
      })`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  return (
    <h3
      className={`text-lg font-semibold ${className}`}
      style={{ color: themeUtils.getTextColor(true) }}
    >
      {children}
    </h3>
  );
};

// Card Content Component
export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

// Stats Card variant
export const StatsCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  subtitle,
  trendValue,
  trendLabel,
  loading = false,
}) => {
  const { theme, themeUtils } = useTheme();
  const isPositiveTrend = trendValue > 0;
  const trendColor = isPositiveTrend ? "#10b981" : "#ef4444";

  return (
    <Card
      bgColor={themeUtils.getBgColor("card")}
      borderColor={themeUtils.getBorderColor()}
      padding="p-4"
      hover={true}
      loading={loading}
    >
      {!loading && (
        <>
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            {/* Left section: Icon + Text */}
            <div className="flex items-center gap-3 w-full">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: iconBg || themeUtils.getBgColor("hover"),
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: iconColor || themeUtils.getTextColor(true) }}
                />
              </div>

              {/* Text block (RIGHT aligned) */}
              <div className="flex flex-col text-right flex-1">
                <p
                  className="text-sm leading-tight"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  {title}
                </p>
                <p
                  className="text-2xl font-bold leading-tight"
                  style={{ color: themeUtils.getTextColor(true) }}
                >
                  {value}
                </p>
              </div>
            </div>

            {/* Trend on far right */}
            {trendValue !== undefined && (
              <div className="flex items-center ml-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: trendColor }}
                >
                  {isPositiveTrend ? "+" : ""}
                  {Math.abs(trendValue)}%
                </span>
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <p
              className="text-xs"
              style={{ color: themeUtils.getTextColor(false, true) }}
            >
              {subtitle}
            </p>
            {trendLabel && (
              <p
                className="text-xs"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                {trendLabel}
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

// Quick Action Card variant
export const QuickActionCard = ({
  icon: Icon,
  iconColor,
  label,
  description,
  onClick,
}) => {
  const { theme, themeUtils } = useTheme();

  return (
    <Card
      bgColor={themeUtils.getBgColor("card")}
      borderColor={themeUtils.getBorderColor()}
      padding="p-3"
      hover={true}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${iconColor || theme.primary}15` }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: iconColor || theme.primary || "#3b82f6" }}
          />
        </div>

        <div className="flex-1">
          <p
            className="font-medium text-sm mb-1"
            style={{ color: themeUtils.getTextColor(true) }}
          >
            {label}
          </p>
          <p
            className="text-xs"
            style={{ color: themeUtils.getTextColor(false, true) }}
          >
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Card;
