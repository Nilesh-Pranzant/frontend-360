// src/pages/Notification/AddTemplate.jsx
import React, { useState, useEffect } from "react";
import { Copy, Plus, Eye, FileText, Mail } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../ui/Common/SweetAlert";
import Button from "../../../ui/Common/Button";
import Card, { CardHeader, CardTitle, CardContent } from "../../../ui/Common/Card";

// ── Template type options ─────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  "Billing",
  "Consumption Alert",
  "Payment Reminder",
  "Meter Reading",
  "Service Interruption",
  "Connection",
  "Disconnection",
  "Registration",
];

// ── Available template variables ─────────────────────────────────────────────
const VARIABLES = [
  "{customer_name}",
  "{unit_number}",
  "{building_name}",
  "{month}",
  "{year}",
  "{billing_period}",
  "{consumption_trh}",
  "{capacity_charge}",
  "{consumption_charge}",
  "{total_amount}",
  "{due_date}",
  "{invoice_number}",
  "{meter_reading}",
  "{previous_reading}",
  "{registration_link}",
  "{reading_date}",
  "{reading_time}",
];

// ── Component ─────────────────────────────────────────────────────────────────
const AddTemplate = ({ onClose, onSuccess, template = null, isEdit = false }) => {
  const { themeUtils } = useTheme();
  const { showAlert, AlertComponent } = useSweetAlert();

  // Pre-fill fields when editing
  const [name,     setName]     = useState(template?.name    || "");
  const [type,     setType]     = useState(template?.type    || "Billing");
  const [subject,  setSubject]  = useState(template?.subject || "");
  const [message,  setMessage]  = useState(template?.message || "");
  const [loading,  setLoading]  = useState(false);

  // Keep form in sync if template prop changes (e.g. drawer reuse)
  useEffect(() => {
    if (template) {
      setName(template.name    || "");
      setType(template.type    || "Billing");
      setSubject(template.subject || "");
      setMessage(template.message || "");
    }
  }, [template]);

  // ── Insert variable at end of message ─────────────────────────────────────
  const insertVariable = (variable) => {
    setMessage((prev) => prev + " " + variable);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert({
      type: "info",
      title: "Copied!",
      message: "Variable copied to clipboard",
      variant: "toast",
      autoClose: true,
      autoCloseTime: 1800,
    });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateForm = () => {
    if (!name.trim())    return "Template name is required";
    if (!subject.trim()) return "Subject is required";
    if (!message.trim()) return "Message body is required";
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      showAlert({
        type: "error",
        title: "Validation Error",
        message: error,
        autoClose: true,
        autoCloseTime: 3000,
      });
      return;
    }

    setLoading(true);

    // Simulate API call — replace with real API call in production
    setTimeout(() => {
      setLoading(false);
      const result = {
        ...(template || {}),
        name:    name.trim(),
        type,
        subject: subject.trim(),
        message: message.trim(),
      };
      if (onSuccess) {
        onSuccess(result);
      } else {
        onClose?.();
      }
    }, 1000);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <AlertComponent />

      <div
        className="flex flex-col h-full px-6 py-5"
        style={{ backgroundColor: themeUtils.getBgColor("default") }}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

            {/* ── Left: Form ── */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border shadow-sm">
                <CardHeader
                  className="pb-4 border-b"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Template Details</CardTitle>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Basic information and email content
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-5 space-y-5">
                  {/* Name + Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Template Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Monthly Billing Notification"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor:     themeUtils.getBorderColor(),
                          color:           themeUtils.getTextColor(true),
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Template Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor:     themeUtils.getBorderColor(),
                          color:           themeUtils.getTextColor(true),
                        }}
                      >
                        {TYPE_OPTIONS.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Email Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Your District Cooling Bill for {month} {year}"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor:     themeUtils.getBorderColor(),
                        color:           themeUtils.getTextColor(true),
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Message Content <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100/60 text-blue-700 font-medium">
                        {message.length} characters
                      </span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Compose your email here... You can use variables like {customer_name}, {total_amount}, etc."
                      className="w-full h-64 px-4 py-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none font-mono placeholder:text-gray-400"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor:     themeUtils.getBorderColor(),
                        color:           themeUtils.getTextColor(true),
                      }}
                    />
                  </div>

                  {/* Variable Chips */}
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Available Variables — click to insert
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {VARIABLES.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => insertVariable(v)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-mono hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all"
                          style={{
                            borderColor: themeUtils.getBorderColor(),
                            color:       themeUtils.getTextColor(false),
                          }}
                        >
                          {v}
                          <Copy className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={onClose || (() => {})}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  <Plus size={16} className="mr-1.5" />
                  {loading
                    ? isEdit ? "Saving..." : "Creating..."
                    : isEdit ? "Save Changes" : "Create Template"}
                </Button>
              </div>
            </div>

            {/* ── Right: Preview ── */}
            <div className="space-y-6">
              <Card className="border shadow-sm sticky top-4">
                <CardHeader
                  className="pb-4 border-b"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-600/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Quick Preview</CardTitle>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        How the final email will look
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-5">
                  <div className="space-y-4">
                    {/* Subject preview */}
                    <div>
                      <span className="text-xs font-medium text-indigo-600/90 flex items-center gap-1.5 mb-1.5">
                        <Mail size={13} />
                        Subject
                      </span>
                      <div
                        className="px-4 py-2.5 rounded-lg border text-sm font-medium"
                        style={{
                          backgroundColor: themeUtils.getBgColor("default"),
                          borderColor:     themeUtils.getBorderColor(),
                          color:           themeUtils.getTextColor(true),
                        }}
                      >
                        {subject || "Your email subject will appear here"}
                      </div>
                    </div>

                    {/* Message preview */}
                    <div>
                      <span className="text-xs font-medium text-indigo-600/90 flex items-center gap-1.5 mb-1.5">
                        <FileText size={13} />
                        Message Body
                      </span>
                      <div
                        className="p-4 rounded-lg border min-h-[180px] max-h-[360px] overflow-auto text-sm whitespace-pre-wrap font-mono leading-relaxed"
                        style={{
                          backgroundColor: themeUtils.getBgColor("default"),
                          borderColor:     themeUtils.getBorderColor(),
                          color:           themeUtils.getTextColor(true),
                        }}
                      >
                        {message || "Your message content will appear here..."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTemplate;