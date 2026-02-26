// components/Common/Table.jsx
import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "../Settings/themeUtils";
import { FaSort } from "react-icons/fa";
import "../../index.css";

const Table = ({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "No data found",
  className = "",
  loading = false,
  hover = true,
  sortable = false,         // ← NEW: make sorting optional
}) => {
  const { theme, themeUtils } = useTheme();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const handleSort = (index) => {
    if (!sortable) return;

    const header = headers[index];
    const headerTitle = typeof header === "object" ? header.title : header;

    if (headerTitle === "Action" || headerTitle === "Actions") return;

    setSortConfig((prev) => {
      if (prev.key === index) {
        if (prev.direction === "asc") return { key: index, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
        return { key: index, direction: "asc" };
      }
      return { key: index, direction: "asc" };
    });
  };

  const displayData = useMemo(() => {
    if (!sortable || sortConfig.key === null || !sortConfig.direction) {
      return data;
    }

    const columnIndex = sortConfig.key;

    return [...data].sort((a, b) => {
      const getValue = (item) => {
        const cells = renderRow(item, -1); // get virtual cells
        const cell = React.Children.toArray(cells)[columnIndex];

        if (React.isValidElement(cell)) {
          const value = cell.props.children;
          return typeof value === "number" || typeof value === "string"
            ? value
            : value?.toString?.() || "";
        }
        return cell?.toString?.() || "";
      };

      const A = getValue(a);
      const B = getValue(b);

      if (typeof A === "number" && typeof B === "number") {
        return sortConfig.direction === "asc" ? A - B : B - A;
      }

      return sortConfig.direction === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
  }, [data, sortConfig, renderRow, sortable]);

  if (loading) {
    return (
      <div
        className={`rounded-xl border overflow-hidden ${className}`}
        style={{
          backgroundColor: themeUtils.getBgColor("card"),
          borderColor: themeUtils.getBorderColor(),
        }}
      >
        <div className="p-12 flex flex-col items-center gap-4">
          <Loader2
            className="h-10 w-10 animate-spin"
            style={{ color: theme.headerBg || "#3b82f6" }}
          />
          <span style={{ color: themeUtils.getTextColor(false, true) }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div
        className={`rounded-xl border p-8 text-center ${className}`}
        style={{
          backgroundColor: themeUtils.getBgColor("card"),
          borderColor: themeUtils.getBorderColor(),
        }}
      >
        <p style={{ color: themeUtils.getTextColor(false, true) }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`border shadow-sm overflow-hidden ${className}`}
      style={{
        backgroundColor: themeUtils.getBgColor("card"),
        borderColor: themeUtils.getBorderColor(),
      }}
    >
      <div className="overflow-x-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: theme.mode === 'Dark' ? '#4a5568 #2d3748' : '#cbd5e0 #f1f5f9'
      }}>
        <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            height: 8px;
            background-color: ${theme.mode === 'Dark' ? '#2d3748' : '#f1f5f9'};
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: ${theme.mode === 'Dark' ? '#4a5568' : '#cbd5e0'};
            border-radius: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background-color: ${theme.mode === 'Dark' ? '#718096' : '#94a3b8'};
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background-color: ${theme.mode === 'Dark' ? '#2d3748' : '#f1f5f9'};
          }
        `}</style>

        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                backgroundColor: theme.mode === "Dark" ? theme.headerBg : `${theme.headerBg}15`,
              }}
            >
              {headers.map((header, index) => {
                const isActive = sortConfig.key === index;
                const headerTitle = typeof header === "object" ? header.title : header;
                const headerAlign = typeof header === "object" ? header.align || "left" : "left";

                return (
                  <th
                    key={index}
                    className="px-4 py-2 text-sm font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none first:rounded-tl-lg last:rounded-tr-lg"
                    style={{
                      color: theme.mode === "Dark" ? "#ffffff" : themeUtils.getTextColor(true),
                      textAlign: headerAlign,
                    }}
                    onClick={() => handleSort(index)}
                  >
                    <div className={`flex items-center gap-2 ${headerAlign === "center" ? "justify-center" : ""}`}>
                      {headerTitle}
                      {sortable && headerTitle !== "Action" && headerTitle !== "Actions" && (
                        <FaSort
                          className={`text-xs transition-transform ${isActive && sortConfig.direction === "desc" ? "rotate-180" : ""}`}
                          style={{ opacity: isActive ? 1 : 0.4 }}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {displayData.map((item, index) => {
              const isEven = index % 2 === 0;
              const rowBg = isEven
                ? themeUtils.getBgColor("card")
                : theme.mode === "Dark"
                  ? `${theme.headerBg}08`
                  : "#f9fafb";

              return (
                <tr
                  key={item.id || index}  // ← stable key using item.id
                  className="border-b last:border-0 transition-colors duration-200"
                  style={{
                    backgroundColor: rowBg,
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  onMouseEnter={(e) => {
                    if (hover) e.currentTarget.style.backgroundColor = theme.mode === "Dark" ? `${theme.headerBg}20` : "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = rowBg;
                  }}
                >
                  {renderRow(item, index)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;