
// import React, { useState } from "react";
// import { Plus, Mail, CheckCircle } from "lucide-react";
// import { useTheme } from "../../../ui/Settings/themeUtils";
// import { useSweetAlert } from "../../../ui/Common/SweetAlert";
// import Button from "../../../ui/Common/Button";
// import Card, { CardHeader, CardTitle } from "../../../ui/Common/Card";
// import ThreeDotsMenu from "../../../ui/common/ThreeDotsMenu";
// import CommonDialog from "../../../ui/Common/CommonDialog";

// import AddTemplate from "./AddTemplate";

// // ── Shared template data ──────────────────────────────────────────
// const INITIAL_TEMPLATES = [
//   {
//     id: 1,
//     name: "Monthly Cooling Bill Notification",
//     type: "Billing",
//     subject: "Your District Cooling Bill for {month} {year}",
//     message: `Dear {customer_name},

// Your BTU meter reading for unit {unit_number} in {building_name} has been processed for the billing period {billing_period}.

// INVOICE DETAILS:
// ───────────────
// Invoice Number: {invoice_number}
// Issue Date: {issue_date}
// Due Date: {due_date}

// CONSUMPTION SUMMARY:
// ──────────────────
// Meter Reading: {meter_reading} TRh
// Previous Reading: {previous_reading} TRh
// Consumption: {consumption_trh} TRh
// Consumption Tariff: AED {consumption_tariff} per TRh

// CHARGES:
// ────────
// Consumption Charge: AED {consumption_charge}
// Capacity Charge: AED {capacity_charge}
// Fuel Surcharge: AED {fuel_surcharge}
// Subtotal: AED {subtotal}
// VAT (5%): AED {vat_amount}
// Total Amount Due: AED {total_amount}

// PAYMENT INFORMATION:
// ──────────────────
// Please make payment before {due_date} to avoid late payment fees.

// Payment Methods Available:
// • Online via our Customer Portal
// • Bank Transfer
// • Credit/Debit Card
// • Cheque

// For any questions regarding your bill, please contact our customer service.

// Thank you for using our District Cooling Services.

// Best regards,
// District Cooling Services Team
// [Company Name]
// [Contact Information]`,
//     description: "This template is used for monthly billing notifications to customers with detailed consumption and charge breakdown.",
//     createdBy: "System Administrator",
//     createdAt: "01/12/2025",
//     createdTime: "14:30",
//     usageCount: 1250,
//     lastUsed: "Today, 10:45",
//     isActive: true,
//     color: "bg-blue-500",
//   },
//   {
//     id: 2,
//     name: "High Consumption Alert",
//     type: "Consumption Alert",
//     subject: "High Cooling Consumption Detected in {building_name}",
//     message: `Dear {customer_name},

// Your cooling consumption has exceeded the normal threshold for unit {unit_number}.

// CONSUMPTION DETAILS:
// ──────────────────
// Current Reading: {meter_reading} TRh
// Previous Reading: {previous_reading} TRh
// Consumption: {consumption_trh} TRh
// Threshold Limit: {threshold_limit} TRh
// Excess Consumption: {excess_consumption} TRh

// Please check your cooling units for any issues or inefficiencies.

// If you have any questions, please contact our customer service.

// Best regards,
// District Cooling Services Team`,
//     description: "Alert template for high cooling consumption detection",
//     createdBy: "System Administrator",
//     createdAt: "15/11/2025",
//     createdTime: "09:15",
//     usageCount: 340,
//     lastUsed: "Yesterday, 15:30",
//     isActive: true,
//     color: "bg-orange-500",
//   },
//   {
//     id: 3,
//     name: "Payment Overdue Reminder",
//     type: "Payment Reminder",
//     subject: "Reminder: District Cooling Payment Due for Invoice {invoice_number}",
//     message: `Dear {customer_name},

// This is a reminder that your payment of AED {total_amount} for invoice {invoice_number} is overdue.

// INVOICE DETAILS:
// ───────────────
// Invoice Number: {invoice_number}
// Due Date: {due_date}
// Amount Due: AED {total_amount}
// Days Overdue: {days_overdue}

// Please make the payment immediately to avoid service interruption.

// PAYMENT OPTIONS:
// ──────────────
// • Online via Customer Portal
// • Bank Transfer
// • Credit/Debit Card

// If you have already made the payment, please disregard this message.

// Best regards,
// District Cooling Services Team`,
//     description: "Payment overdue reminder template",
//     createdBy: "System Administrator",
//     createdAt: "10/11/2025",
//     createdTime: "16:45",
//     usageCount: 820,
//     lastUsed: "Today, 09:20",
//     isActive: true,
//     color: "bg-red-500",
//   },
//   {
//     id: 4,
//     name: "Meter Reading Schedule",
//     type: "Meter Reading",
//     subject: "Upcoming BTU Meter Reading for {unit_number}",
//     message: `Dear {customer_name},

// This is to inform you that your BTU meter reading is scheduled for:

// SCHEDULE DETAILS:
// ───────────────
// Date: {reading_date}
// Time: {reading_time}
// Unit: {unit_number}
// Building: {building_name}

// Please ensure access to your meter on the scheduled date and time.

// If this schedule is not convenient, please contact us to reschedule.

// Best regards,
// District Cooling Services Team`,
//     description: "Template for notifying customers about upcoming meter readings",
//     createdBy: "System Administrator",
//     createdAt: "05/11/2025",
//     createdTime: "11:20",
//     usageCount: 610,
//     lastUsed: "2 days ago",
//     isActive: true,
//     color: "bg-green-500",
//   },
//   {
//     id: 7,
//     name: "Customer Registration - Tempex System",
//     type: "Registration",
//     subject: "Welcome to Tempex System - Complete Your Registration",
//     message: `Dear {customer_name},

// Welcome to Tempex System!

// Your credentials for login at billing.tempex.ae are being prepared. Please complete your registration by clicking the link below:

// 🔗 Registration Link: {registration_link}

// You will not be able to "Reply" to this e-mail. If you wish to contact us, please e-mail us at support@tempex.ae or call +971 XX XXX XXXX.

// Regards,
// Tempex Smart Energy Billing Solutions
// For more information visit: www.tempex.ae

// Email Confidentiality Notice: The information in this email is private and confidential. It is intended solely for the person to whom it is addressed. If you are not the intended recipient please contact us immediately and remove the email from your system.`,
//     description: "Customer registration email template with login credentials and registration link",
//     createdBy: "System Administrator",
//     createdAt: "15/12/2025",
//     createdTime: "09:30",
//     usageCount: 450,
//     lastUsed: "Today, 11:20",
//     isActive: true,
//     color: "bg-green-600",
//   },
// ];

// // ── Type colour helper ────────────────────────────────────────────────────────
// const getTypeColor = (type) => {
//   const colors = {
//     Billing: "text-blue-600 bg-blue-50",
//     "Consumption Alert": "text-orange-600 bg-orange-50",
//     "Payment Reminder": "text-red-600 bg-red-50",
//     "Meter Reading": "text-green-600 bg-green-50",
//     "Service Interruption": "text-purple-600 bg-purple-50",
//     Connection: "text-teal-600 bg-teal-50",
//     Disconnection: "text-gray-600 bg-gray-50",
//     Registration: "text-green-600 bg-green-50",
//   };
//   return colors[type] || "text-gray-600 bg-gray-50";
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// const ListTemplate = ({ embedded = false, onSelectTemplate, selectedTemplateId }) => {
//   const { themeUtils } = useTheme();
//   const { showAlert, AlertComponent } = useSweetAlert();

//   const [templates, setTemplates] = useState(INITIAL_TEMPLATES);

//   // Dialog states
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   const getBgColor = (type = "card") => themeUtils ? themeUtils.getBgColor(type) : "#ffffff";
//   const getTextColor = (primary = true) => themeUtils ? themeUtils.getTextColor(primary) : (primary ? "#111827" : "#6b7280");
//   const getBorderColor = () => themeUtils ? themeUtils.getBorderColor() : "#e5e7eb";

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleEdit = (template) => {
//     setSelectedTemplate(template);
//     setIsEditOpen(true);
//   };

//   const handleDelete = (id, name) => {
//     showAlert({
//       type: "warning",
//       title: "Are you sure?",
//       message: `Do you want to delete "${name}"? This action cannot be undone.`,
//       showConfirm: true,
//       confirmText: "Yes, Delete",
//       showCancel: true,
//       cancelText: "Cancel",
//       variant: "modal",
//       onConfirm: () => {
//         setTemplates((prev) => prev.filter((t) => t.id !== id));
//         setTimeout(() => {
//           showAlert({
//             type: "success",
//             title: "Deleted!",
//             message: "Email template deleted successfully!",
//             autoClose: true,
//             autoCloseTime: 2500,
//             variant: "toast",
//           });
//         }, 350);
//       },
//     });
//   };

//   const handleTemplateClick = (template) => {
//     if (onSelectTemplate) {
//       onSelectTemplate(template);
//     }
//   };

//   // Called from AddTemplate on successful save
//   const handleTemplateAdded = (newTemplate) => {
//     setTemplates((prev) => [
//       ...prev,
//       {
//         ...newTemplate,
//         id: Date.now(),
//         createdAt: new Date().toLocaleDateString("en-GB", {
//           day: "2-digit", month: "2-digit", year: "numeric",
//         }).replace(/\//g, "/"),
//         createdTime: new Date().toLocaleTimeString("en-US", {
//           hour: "2-digit", minute: "2-digit",
//         }),
//         usageCount: 0,
//         lastUsed: "Never",
//         isActive: true,
//         color: "bg-blue-500",
//       },
//     ]);
//     setIsAddOpen(false);
//     showAlert({
//       type: "success",
//       title: "Created!",
//       message: "Email template has been successfully created.",
//       autoClose: true,
//       autoCloseTime: 2200,
//       variant: "toast",
//     });
//   };

//   // Called from EditTemplate on successful save
//   const handleTemplateUpdated = (updatedTemplate) => {
//     setTemplates((prev) =>
//       prev.map((t) => (t.id === updatedTemplate.id ? { ...t, ...updatedTemplate } : t))
//     );
//     setIsEditOpen(false);
//     showAlert({
//       type: "success",
//       title: "Updated!",
//       message: "Email template has been successfully updated.",
//       autoClose: true,
//       autoCloseTime: 2200,
//       variant: "toast",
//     });
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <AlertComponent />

//       {/* ── Add Template Drawer ── */}
//       <CommonDialog
//         header="Create New Email Template"
//         visible={isAddOpen}
//         onHide={() => setIsAddOpen(false)}
//         position="right"
//         fullHeight={true}
//         width="85vw"
//       >
//         <AddTemplate
//           onClose={() => setIsAddOpen(false)}
//           onSuccess={handleTemplateAdded}
//         />
//       </CommonDialog>

//       {/* ── Edit Template Drawer ── */}
//       <CommonDialog
//         header="Edit Email Template"
//         visible={isEditOpen}
//         onHide={() => setIsEditOpen(false)}
//         position="right"
//         fullHeight={true}
//         width="85vw"
//       >
//         <AddTemplate
//           template={selectedTemplate}
//           isEdit={true}
//           onClose={() => setIsEditOpen(false)}
//           onSuccess={handleTemplateUpdated}
//         />
//       </CommonDialog>

//       {/* ── Main Content ── */}
//       <div className={`space-y-4 ${embedded ? 'p-4' : 'p-4'}`}>

//         {/* Header - Only show if not embedded */}
//         {!embedded && (
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="min-w-0">
//               <CardTitle themeUtils={themeUtils}>Email Templates</CardTitle>
//               <p className="text-sm mt-1" style={{ color: getTextColor(false) }}>
//                 Manage all email templates used for notifications
//               </p>
//             </div>
//             <div className="flex items-center gap-3 shrink-0">
//               <Button
//                 variant="primary"
//                 icon={Plus}
//                 onClick={() => setIsAddOpen(true)}
//                 className="gap-2 shadow-md"
//               >
//                 New Template
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* New Template button for embedded mode */}
//         {embedded && (
//           <div className="flex justify-end mb-4">
//             <Button
//               variant="primary"
//               icon={Plus}
//               onClick={() => setIsAddOpen(true)}
//               className="gap-2 shadow-md"
//               size="sm"
//             >
//               New Template
//             </Button>
//           </div>
//         )}

//         {/* Templates Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {templates.map((template) => (
//             <div
//               key={template.id}
//               onClick={() => handleTemplateClick(template)}
//               className={`
//                 relative flex flex-col p-4 rounded-xl border-2 cursor-pointer
//                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group
//                 ${selectedTemplateId === template.id ? "border-blue-500 bg-blue-50/60 shadow-md" : "hover:border-blue-300"}
//               `}
//               style={{
//                 backgroundColor: getBgColor("card"),
//                 borderColor: selectedTemplateId === template.id ? "#3b82f6" : getBorderColor(),
//               }}
//             >
//               {/* Selected tick */}
//               {selectedTemplateId === template.id && (
//                 <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow">
//                   <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               )}
//               {/* Hover tick (unselected) */}
//               {selectedTemplateId !== template.id && (
//                 <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full border-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
//               )}

//               {/* Card header */}
//               <div className="flex items-center gap-3 mb-3 pr-6">
//                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${template.color} shadow shrink-0`}>
//                   <Mail className="h-4 w-4 text-white" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="font-semibold text-sm truncate" style={{ color: getTextColor(true) }} title={template.name}>
//                     {template.name}
//                   </p>
//                   <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${getTypeColor(template.type)}`}>
//                     {template.type}
//                   </span>
//                 </div>
//               </div>

//               {/* Subject */}
//               <div className="mb-3 p-2.5 rounded-lg border" style={{ borderColor: getBorderColor() }}>
//                 <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: getTextColor(false) }}>Subject</p>
//                 <p className="text-xs font-medium line-clamp-1" style={{ color: getTextColor(true) }} title={template.subject}>
//                   {template.subject}
//                 </p>
//               </div>

//               {/* Preview */}
//               <p className="text-xs line-clamp-2 leading-relaxed flex-grow mb-3" style={{ color: getTextColor(false) }}>
//                 {template.message}
//               </p>

//               {/* Footer with Three Dots Menu */}
//               <div
//                 className="flex items-center justify-between pt-3 border-t text-xs"
//                 style={{ borderColor: getBorderColor(), color: getTextColor(false) }}
//                 onClick={(e) => e.stopPropagation()} // Prevent template selection when clicking menu
//               >
//                 <div>
//                   <span>Created: {template.createdAt}</span>
//                   <span className="ml-2">Used: {template.usageCount} times</span>
//                 </div>
//                 <ThreeDotsMenu
//                   onEdit={() => handleEdit(template)}
//                   onDelete={() => handleDelete(template.id, template.name)}
//                   editTitle="Edit Template"
//                   deleteTitle="Delete Template"
//                   menuAlignment="right"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {templates.length === 0 && (
//           <Card className="border-2 shadow-lg">
//             <div className="text-center py-16 px-4">
//               <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
//                 <Mail className="h-10 w-10 text-blue-500" />
//               </div>
//               <h3 className="text-xl font-bold mb-3" style={{ color: getTextColor(true) }}>
//                 No email templates found
//               </h3>
//               <p
//                 className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
//                 style={{ color: getTextColor(false) }}
//               >
//                 Get started by creating your first email template to streamline customer communications.
//               </p>
//               <Button
//                 variant="primary"
//                 icon={Plus}
//                 onClick={() => setIsAddOpen(true)}
//                 className="gap-2 shadow-lg"
//               >
//                 Create First Template
//               </Button>
//             </div>
//           </Card>
//         )}
//       </div>
//     </>
//   );
// };

// export default ListTemplate;


// src/pages/Notification/ListTemplate.jsx
import React, { useState } from "react";
import { Plus, Mail, CheckCircle } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../ui/Common/SweetAlert";
import Button from "../../../ui/Common/Button";
import Card, { CardHeader, CardTitle } from "../../../ui/Common/Card";
import ThreeDotsMenu from "../../../ui/common/ThreeDotsMenu";
import CommonDialog from "../../../ui/Common/CommonDialog";

import AddTemplate from "./AddTemplate";

// ── Shared template data ──────────────────────────────────────────
const INITIAL_TEMPLATES = [
  {
    id: 1,
    name: "Monthly Cooling Bill Notification",
    type: "Billing",
    subject: "Your District Cooling Bill for {month} {year}",
    message: `Dear {customer_name},

Your BTU meter reading for unit {unit_number} in {building_name} has been processed for the billing period {billing_period}.

INVOICE DETAILS:
───────────────
Invoice Number: {invoice_number}
Issue Date: {issue_date}
Due Date: {due_date}

CONSUMPTION SUMMARY:
──────────────────
Meter Reading: {meter_reading} TRh
Previous Reading: {previous_reading} TRh
Consumption: {consumption_trh} TRh
Consumption Tariff: AED {consumption_tariff} per TRh

CHARGES:
────────
Consumption Charge: AED {consumption_charge}
Capacity Charge: AED {capacity_charge}
Fuel Surcharge: AED {fuel_surcharge}
Subtotal: AED {subtotal}
VAT (5%): AED {vat_amount}
Total Amount Due: AED {total_amount}

PAYMENT INFORMATION:
──────────────────
Please make payment before {due_date} to avoid late payment fees.

Payment Methods Available:
• Online via our Customer Portal
• Bank Transfer
• Credit/Debit Card
• Cheque

For any questions regarding your bill, please contact our customer service.

Thank you for using our District Cooling Services.

Best regards,
District Cooling Services Team
[Company Name]
[Contact Information]`,
    description: "This template is used for monthly billing notifications to customers with detailed consumption and charge breakdown.",
    createdBy: "System Administrator",
    createdAt: "01/12/2025",
    createdTime: "14:30",
    usageCount: 1250,
    lastUsed: "Today, 10:45",
    isActive: true,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "High Consumption Alert",
    type: "Consumption Alert",
    subject: "High Cooling Consumption Detected in {building_name}",
    message: `Dear {customer_name},

Your cooling consumption has exceeded the normal threshold for unit {unit_number}.

CONSUMPTION DETAILS:
──────────────────
Current Reading: {meter_reading} TRh
Previous Reading: {previous_reading} TRh
Consumption: {consumption_trh} TRh
Threshold Limit: {threshold_limit} TRh
Excess Consumption: {excess_consumption} TRh

Please check your cooling units for any issues or inefficiencies.

If you have any questions, please contact our customer service.

Best regards,
District Cooling Services Team`,
    description: "Alert template for high cooling consumption detection",
    createdBy: "System Administrator",
    createdAt: "15/11/2025",
    createdTime: "09:15",
    usageCount: 340,
    lastUsed: "Yesterday, 15:30",
    isActive: true,
    color: "bg-orange-500",
  },
  {
    id: 3,
    name: "Payment Overdue Reminder",
    type: "Payment Reminder",
    subject: "Reminder: District Cooling Payment Due for Invoice {invoice_number}",
    message: `Dear {customer_name},

This is a reminder that your payment of AED {total_amount} for invoice {invoice_number} is overdue.

INVOICE DETAILS:
───────────────
Invoice Number: {invoice_number}
Due Date: {due_date}
Amount Due: AED {total_amount}
Days Overdue: {days_overdue}

Please make the payment immediately to avoid service interruption.

PAYMENT OPTIONS:
──────────────
• Online via Customer Portal
• Bank Transfer
• Credit/Debit Card

If you have already made the payment, please disregard this message.

Best regards,
District Cooling Services Team`,
    description: "Payment overdue reminder template",
    createdBy: "System Administrator",
    createdAt: "10/11/2025",
    createdTime: "16:45",
    usageCount: 820,
    lastUsed: "Today, 09:20",
    isActive: true,
    color: "bg-red-500",
  },
  {
    id: 4,
    name: "Meter Reading Schedule",
    type: "Meter Reading",
    subject: "Upcoming BTU Meter Reading for {unit_number}",
    message: `Dear {customer_name},

This is to inform you that your BTU meter reading is scheduled for:

SCHEDULE DETAILS:
───────────────
Date: {reading_date}
Time: {reading_time}
Unit: {unit_number}
Building: {building_name}

Please ensure access to your meter on the scheduled date and time.

If this schedule is not convenient, please contact us to reschedule.

Best regards,
District Cooling Services Team`,
    description: "Template for notifying customers about upcoming meter readings",
    createdBy: "System Administrator",
    createdAt: "05/11/2025",
    createdTime: "11:20",
    usageCount: 610,
    lastUsed: "2 days ago",
    isActive: true,
    color: "bg-green-500",
  },
  {
    id: 7,
    name: "Customer Registration - Tempex System",
    type: "Registration",
    subject: "Welcome to Tempex System - Complete Your Registration",
    message: `Dear {customer_name},

Welcome to Tempex System!

Your credentials for login at billing.tempex.ae are being prepared. Please complete your registration by clicking the link below:

🔗 Registration Link: {registration_link}

You will not be able to "Reply" to this e-mail. If you wish to contact us, please e-mail us at support@tempex.ae or call +971 XX XXX XXXX.

Regards,
Tempex Smart Energy Billing Solutions
For more information visit: www.tempex.ae

Email Confidentiality Notice: The information in this email is private and confidential. It is intended solely for the person to whom it is addressed. If you are not the intended recipient please contact us immediately and remove the email from your system.`,
    description: "Customer registration email template with login credentials and registration link",
    createdBy: "System Administrator",
    createdAt: "15/12/2025",
    createdTime: "09:30",
    usageCount: 450,
    lastUsed: "Today, 11:20",
    isActive: true,
    color: "bg-green-600",
  },
];

// ── Type colour helper ────────────────────────────────────────────────────────
const getTypeColor = (type) => {
  const colors = {
    Billing: "text-blue-600 bg-blue-50",
    "Consumption Alert": "text-orange-600 bg-orange-50",
    "Payment Reminder": "text-red-600 bg-red-50",
    "Meter Reading": "text-green-600 bg-green-50",
    "Service Interruption": "text-purple-600 bg-purple-50",
    Connection: "text-teal-600 bg-teal-50",
    Disconnection: "text-gray-600 bg-gray-50",
    Registration: "text-green-600 bg-green-50",
  };
  return colors[type] || "text-gray-600 bg-gray-50";
};

// ── Component ─────────────────────────────────────────────────────────────────
const ListTemplate = ({ embedded = false, onSelectTemplate, selectedTemplateId }) => {
  const { themeUtils } = useTheme();
  const { showAlert, AlertComponent } = useSweetAlert();

  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBgColor = (type = "card") => themeUtils ? themeUtils.getBgColor(type) : "#ffffff";
  const getTextColor = (primary = true) => themeUtils ? themeUtils.getTextColor(primary) : (primary ? "#111827" : "#6b7280");
  const getBorderColor = () => themeUtils ? themeUtils.getBorderColor() : "#e5e7eb";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditOpen(true);
  };

  const handleDelete = (id, name) => {
    showAlert({
      type: "warning",
      title: "Are you sure?",
      message: `Do you want to delete "${name}"? This action cannot be undone.`,
      showConfirm: true,
      confirmText: "Yes, Delete",
      showCancel: true,
      cancelText: "Cancel",
      variant: "modal",
      onConfirm: () => {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        setTimeout(() => {
          showAlert({
            type: "success",
            title: "Deleted!",
            message: "Email template deleted successfully!",
            autoClose: true,
            autoCloseTime: 2500,
            variant: "toast",
          });
        }, 350);
      },
    });
  };

  const handleTemplateClick = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Called from AddTemplate on successful save
  const handleTemplateAdded = (newTemplate) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...newTemplate,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit", month: "2-digit", year: "numeric",
        }).replace(/\//g, "/"),
        createdTime: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit",
        }),
        usageCount: 0,
        lastUsed: "Never",
        isActive: true,
        color: "bg-blue-500",
      },
    ]);
    setIsAddOpen(false);
    showAlert({
      type: "success",
      title: "Created!",
      message: "Email template has been successfully created.",
      autoClose: true,
      autoCloseTime: 2200,
      variant: "toast",
    });
  };

  // Called from EditTemplate on successful save
  const handleTemplateUpdated = (updatedTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updatedTemplate.id ? { ...t, ...updatedTemplate } : t))
    );
    setIsEditOpen(false);
    showAlert({
      type: "success",
      title: "Updated!",
      message: "Email template has been successfully updated.",
      autoClose: true,
      autoCloseTime: 2200,
      variant: "toast",
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <AlertComponent />

      {/* ── Add Template Drawer ── */}
      <CommonDialog
        header="Create New Email Template"
        visible={isAddOpen}
        onHide={() => setIsAddOpen(false)}
        position="right"
        fullHeight={true}
        width="85vw"
      >
        <AddTemplate
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleTemplateAdded}
        />
      </CommonDialog>

      {/* ── Edit Template Drawer ── */}
      <CommonDialog
        header="Edit Email Template"
        visible={isEditOpen}
        onHide={() => setIsEditOpen(false)}
        position="right"
        fullHeight={true}
        width="85vw"
      >
        <AddTemplate
          template={selectedTemplate}
          isEdit={true}
          onClose={() => setIsEditOpen(false)}
          onSuccess={handleTemplateUpdated}
        />
      </CommonDialog>

      {/* ── Main Content ── */}
      <div className={`space-y-4 ${embedded ? 'p-4' : 'p-4'}`}>

        {/* Header - Only show if not embedded */}
        {!embedded && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle themeUtils={themeUtils}>Email Templates</CardTitle>
              <p className="text-sm mt-1" style={{ color: getTextColor(false) }}>
                Manage all email templates used for notifications
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddOpen(true)}
                className="gap-2 shadow-md"
              >
                New Template
              </Button>
            </div>
          </div>
        )}

        {/* New Template button for embedded mode */}
        {embedded && (
          <div className="flex justify-end mb-4">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddOpen(true)}
              className="gap-2 shadow-md"
              size="sm"
            >
              New Template
            </Button>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`
                relative flex flex-col p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group
                ${selectedTemplateId === template.id ? "border-blue-500 bg-blue-50/60 shadow-md" : "hover:border-blue-300"}
              `}
              style={{
                backgroundColor: getBgColor("card"),
                borderColor: selectedTemplateId === template.id ? "#3b82f6" : getBorderColor(),
              }}
            >
              {/* Three Dots Menu - Top Right */}
              <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
                <ThreeDotsMenu
                  onEdit={() => handleEdit(template)}
                  onDelete={() => handleDelete(template.id, template.name)}
                  editTitle="Edit Template"
                  deleteTitle="Delete Template"
                  menuAlignment="right"
                />
              </div>

              {/* Card header */}
              <div className="flex items-center gap-3 mb-3 pr-8"> {/* Added right padding for menu */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${template.color} shadow shrink-0`}>
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: getTextColor(true) }} title={template.name}>
                    {template.name}
                  </p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3 p-2.5 rounded-lg border" style={{ borderColor: getBorderColor() }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: getTextColor(false) }}>Subject</p>
                <p className="text-xs font-medium line-clamp-1" style={{ color: getTextColor(true) }} title={template.subject}>
                  {template.subject}
                </p>
              </div>

              {/* Preview */}
              <p className="text-xs line-clamp-2 leading-relaxed flex-grow mb-3" style={{ color: getTextColor(false) }}>
                {template.message}
              </p>

              {/* Footer with Selection Indicator - Bottom Right */}
              <div
                className="flex items-center justify-between pt-3 border-t text-xs"
                style={{ borderColor: getBorderColor(), color: getTextColor(false) }}
              >
                <div>
                  <span>Created: {template.createdAt}</span>
                  <span className="ml-2">Used: {template.usageCount} times</span>
                </div>
                
                {/* Selection Indicator */}
                {selectedTemplateId === template.id ? (
                  <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <Card className="border-2 shadow-lg">
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                <Mail className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: getTextColor(true) }}>
                No email templates found
              </h3>
              <p
                className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
                style={{ color: getTextColor(false) }}
              >
                Get started by creating your first email template to streamline customer communications.
              </p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddOpen(true)}
                className="gap-2 shadow-lg"
              >
                Create First Template
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ListTemplate;