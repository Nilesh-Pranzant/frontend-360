// CustomDetailsTable.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';

const CustomDetailsTable = ({
  columns,
  data,
  editable = false,
  themeUtils,
  theme = {},
  onUpdate,
  onDelete,
  navbarBg,
  headerBg,
  className = '',
  style = {},
  ...props
}) => {
  const handleCellUpdate = (rowIndex, field, value) => {
    if (onUpdate) {
      onUpdate(rowIndex, field, value);
    }
  };

  const handleRowDelete = (rowIndex) => {
    if (onDelete) {
      onDelete(rowIndex);
    }
  };

  const renderEditableCell = (row, rowIndex, column) => {
    const { field, type = 'text' } = column;
    const value = row[field];

    return (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => handleCellUpdate(rowIndex, field, e.target.value)}
        className="w-full px-2 py-1 border rounded-sm focus:outline-none focus:ring-2 transition-all"
        style={{
          backgroundColor: themeUtils?.getBgColor?.('input') ?? '#ffffff',
          borderColor: themeUtils?.getBorderColor?.() ?? '#e5e7eb',
          color: themeUtils?.getTextColor?.(true) ?? '#1f2937'
        }}
      />
    );
  };

  const renderCell = (row, rowIndex, column) => {
    const { field, render } = column;
    const value = row[field];

    if (render) {
      return render(value, row, rowIndex);
    }

    return value ?? '';
  };

  const textColor = themeUtils?.getTextColor?.(true) ?? '#1f2937';
  const borderColor = themeUtils?.getBorderColor?.() ?? '#e5e7eb';

  return (
    <div
      className={`overflow-x-auto rounded-xl ${className}`}
      style={{
        borderColor: borderColor + '40',
        ...style
      }}
      {...props}
    >
      <table className="w-full text-sm border-collapse">
        <thead
          style={{
            // Removed backgroundColor – now transparent or inherited
            color: textColor, // Text color for headers
          }}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-2 py-1 text-left border-b "
                style={{
                  ...column.headerStyle,
                  color: textColor,
                  borderColor: borderColor
                }}
              >
                {column.title}
              </th>
            ))}
            {onDelete && (
              <th
                className="px-3 py-2 text-center border-b"
                style={{ color: textColor, borderColor: borderColor }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="transition-colors"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-2 py-1 "
                  style={{
                    ...column.cellStyle,
                    color: textColor,
  
                  }}
                >
                  {column.render && editable
                    ? column.render(row[column.field], row, rowIndex)
                    : editable
                      ? renderEditableCell(row, rowIndex, column)
                      : renderCell(row, rowIndex, column)}
                </td>
              ))}

              {onDelete && (
                <td className="px-4 py-3 text-center border-r" style={{ borderColor: borderColor }}>
                  <button
                    onClick={() => handleRowDelete(rowIndex)}
                    className="p-2 rounded-lg transition-all hover:bg-red-50"
                    style={{ color: '#ef4444' }}
                    title="Delete row"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomDetailsTable;