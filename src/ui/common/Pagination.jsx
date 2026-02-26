import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  themeUtils,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between items-center mt-6 pt-4 border-t gap-4 ${className}`}
      style={{ borderColor: themeUtils.getBorderColor() }}
    >
      {/* Page info */}
      <div
        className="text-sm order-2 sm:order-1"
        style={{ color: themeUtils.getTextColor(false, true) }}
      >
        Page {currentPage} of {totalPages}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
          style={{
            backgroundColor: themeUtils.getBgColor("hover"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true),
          }}
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
          style={{
            backgroundColor: themeUtils.getBgColor("hover"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true),
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;