

// components/Common/ActionButtons.jsx
import React from "react";
import { Eye, Edit, Trash2, Mail, Download, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useTheme } from "../Settings/themeUtils";

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  onEmail,
  onDownload,
  onApprove,           // NEW: optional prop for approve action
  onReject,            // NEW: optional prop for reject action
  onExecute,           // NEW: optional prop for execute action
  viewTitle = "View",
  editTitle = "Edit",
  deleteTitle = "Delete",
  emailTitle = "Send Email",
  downloadTitle = "Download",
  approveTitle = "Approve",      // NEW: default title
  rejectTitle = "Reject",        // NEW: default title
  executeTitle = "Execute",      // NEW: default title
  variant = "default", // "default" or "minimal"
}) => {
  const { theme, themeUtils } = useTheme();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  // Get icon color based on theme mode
  const getIconColor = () => {
    return theme.mode === "Dark" ? "#E5E7EB" : "#4B5563";
  };

  // Common button styles
  const buttonBaseClass =
    "p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95";

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center gap-1">
        {onView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className={buttonBaseClass}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={viewTitle}
            aria-label={viewTitle}
          >
            <Eye className="w-4 h-4" style={{ color: getIconColor() }} />
          </button>
        )}

        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={buttonBaseClass}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={editTitle}
            aria-label={editTitle}
          >
            <Edit className="w-4 h-4" style={{ color: getIconColor() }} />
          </button>
        )}

        {onEmail && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmail();
            }}
            className={buttonBaseClass}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={emailTitle}
            aria-label={emailTitle}
          >
            <Mail className="w-4 h-4" style={{ color: getIconColor() }} />
          </button>
        )}

        {onDownload && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className={buttonBaseClass}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={downloadTitle}
            aria-label={downloadTitle}
          >
            <Download className="w-4 h-4" style={{ color: getIconColor() }} />
          </button>
        )}

        {/* NEW: Approve Button */}
        {onApprove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className={buttonBaseClass + " hover:bg-green-500/20"}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={approveTitle}
            aria-label={approveTitle}
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
          </button>
        )}

        {/* NEW: Reject Button */}
        {onReject && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            className={buttonBaseClass + " hover:bg-red-500/20"}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={rejectTitle}
            aria-label={rejectTitle}
          >
            <XCircle className="w-4 h-4 text-red-600" />
          </button>
        )}

        {/* NEW: Execute Button */}
        {onExecute && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExecute();
            }}
            className={buttonBaseClass + " hover:bg-blue-500/20"}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={executeTitle}
            aria-label={executeTitle}
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className={buttonBaseClass + " hover:bg-red-500/20"}
            style={{
              backgroundColor: theme.navbarBg,
            }}
            title={deleteTitle}
            aria-label={deleteTitle}
          >
            <Trash2 className="w-4 h-4" style={{ color: getIconColor() }} />
          </button>
        )}
      </div>
    );
  }

  // Default variant (with text labels)
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: theme.navbarBg,
            color: getIconColor(),
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <Eye className="w-4 h-4" style={{ color: getIconColor() }} />
          {viewTitle}
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: theme.navbarBg,
            color: getIconColor(),
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <Edit className="w-4 h-4" style={{ color: getIconColor() }} />
          {editTitle}
        </button>
      )}
      {onEmail && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEmail();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: theme.navbarBg,
            color: getIconColor(),
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <Mail className="w-4 h-4" style={{ color: getIconColor() }} />
          {emailTitle}
        </button>
      )}
      {onDownload && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: theme.navbarBg,
            color: getIconColor(),
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <Download className="w-4 h-4" style={{ color: getIconColor() }} />
          {downloadTitle}
        </button>
      )}

      {/* NEW: Approve Button with text */}
      {onApprove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApprove();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-green-500/10"
          style={{
            backgroundColor: theme.navbarBg,
            color: "#059669",
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          {approveTitle}
        </button>
      )}

      {/* NEW: Reject Button with text */}
      {onReject && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-red-500/10"
          style={{
            backgroundColor: theme.navbarBg,
            color: "#DC2626",
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <XCircle className="w-4 h-4 text-red-600" />
          {rejectTitle}
        </button>
      )}

      {/* NEW: Execute Button with text */}
      {onExecute && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExecute();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-blue-500/10"
          style={{
            backgroundColor: theme.navbarBg,
            color: "#2563EB",
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          {executeTitle}
        </button>
      )}

      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-red-500/10"
          style={{
            backgroundColor: theme.navbarBg,
            color: theme.mode === "Dark" ? "#EF4444" : "#EF4444",
            border: `1px solid ${themeUtils.getBorderColor()}`,
          }}
        >
          <Trash2
            className="w-4 h-4"
            style={{
              color: theme.mode === "Dark" ? "#F87171" : "#EF4444",
            }}
          />
          {deleteTitle}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;