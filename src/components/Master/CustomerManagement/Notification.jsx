// import emailjs from "@emailjs/browser";
// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   Building2,
//   Home,
//   Mail,
//   Bell,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   CheckCircle,
//   Plus,
// } from "lucide-react";
// import { useTheme } from "../../../ui/Settings/themeUtils";
// import { useToast } from "../../../ui/common/CostumeTost";
// import { CardHeader, CardTitle } from "../../../ui/Common/Card";
// import Button from "../../../ui/Common/Button";
// import CustomConfirmDialog from "../../../ui/common/CustomConfirmDialog";
// import CommonDialog from "../../../ui/Common/CommonDialog";
// import Card from "../../../ui/Common/Card";
// import {
//   RiMailSendLine,
//   RiCommunityLine,
//   RiBuildingLine,
//   RiHomeGearLine,
// } from "react-icons/ri";
// import {
//   API_URL_COMMUNITY,
//   API_URL_PROPERTY,
//   API_URL_UNIT,
//   EMAIL_SERVICE_ID,
//   EMAIL_TEMPLATE_ID,
//   EMAIL_PUBLIC_KEY,
// } from "../../../../config";

// // Import template components
// import ListTemplate from "./ListTemplate";

// // ── API Base URLs ─────────────────────────────────────────────────────────────
// const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";
// const propertyBaseURL  = API_URL_PROPERTY  || "http://192.168.1.39:5000";
// const unitBaseURL      = API_URL_UNIT      || "http://192.168.1.39:5000";

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
// const Notification = () => {
//   const { themeUtils } = useTheme();
//   const toast = useToast();

//   // Tab state
//   const [activeTab, setActiveTab] = useState("individual");

//   // ── API data ──────────────────────────────────────────────────────────────
//   const [communities, setCommunities] = useState([]);
//   const [properties,  setProperties]  = useState([]);
//   const [units,       setUnits]       = useState([]);

//   // ── Loading states ────────────────────────────────────────────────────────
//   const [loadingCommunities, setLoadingCommunities] = useState(true);
//   const [loadingProperties,  setLoadingProperties]  = useState(false);
//   const [loadingUnits,       setLoadingUnits]       = useState(false);

//   // ── Selected values ───────────────────────────────────────────────────────
//   const [selectedCommunity, setSelectedCommunity] = useState("");
//   const [selectedBuilding,  setSelectedBuilding]  = useState("");
//   const [selectedUnit,      setSelectedUnit]      = useState("");
//   const [selectedTemplate,  setSelectedTemplate]  = useState(null);

//   // ── UI states ─────────────────────────────────────────────────────────────
//   const [sending,                 setSending]                 = useState(false);
//   const [confirmDialogVisible,    setConfirmDialogVisible]    = useState(false);
//   const [emailDetails,            setEmailDetails]            = useState(null);
//   const [isTemplateAccordionOpen, setIsTemplateAccordionOpen] = useState(false);

//   // ── Fetch Communities on mount ────────────────────────────────────────────
//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         setLoadingCommunities(true);
//         const response = await fetch(`${communityBaseURL}/api/communities`);
//         const data = await response.json();
//         if (response.ok) {
//           setCommunities(data);
//         } else {
//           console.error("Error fetching communities:", data);
//           toast.error("Error", "Failed to load communities");
//         }
//       } catch (error) {
//         console.error("Error fetching communities:", error);
//         toast.error("Error", "Failed to load communities");
//       } finally {
//         setLoadingCommunities(false);
//       }
//     };
//     fetchCommunities();
//   }, []);

//   // ── Fetch Properties by Community ─────────────────────────────────────────
//   const fetchProperties = async (communityId) => {
//     if (!communityId) { setProperties([]); return; }
//     try {
//       setLoadingProperties(true);
//       const response = await fetch(`${propertyBaseURL}/api/properties/by-community/${communityId}`);
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setProperties(
//           data.data.map((p) => ({
//             ...p,
//             property_id:  Number(p.property_id),
//             total_floors: Number(p.total_floors),
//           }))
//         );
//       } else {
//         setProperties([]);
//       }
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//       setProperties([]);
//     } finally {
//       setLoadingProperties(false);
//     }
//   };

//   // ── Fetch Units by Property ───────────────────────────────────────────────
//   const fetchUnits = async (propertyId) => {
//     if (!propertyId) { setUnits([]); return; }
//     try {
//       setLoadingUnits(true);
//       const response = await fetch(`${unitBaseURL}/api/units/by-property/${propertyId}`);
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setUnits(data.data);
//       } else {
//         setUnits([]);
//       }
//     } catch (error) {
//       console.error("Error fetching units:", error);
//       setUnits([]);
//     } finally {
//       setLoadingUnits(false);
//     }
//   };

//   // ── Community change ──────────────────────────────────────────────────────
//   const handleCommunityChange = (communityId) => {
//     setSelectedCommunity(communityId);
//     setSelectedBuilding("");
//     setSelectedUnit("");
//     setProperties([]);
//     setUnits([]);
//     fetchProperties(communityId);
//   };

//   // ── Building change ───────────────────────────────────────────────────────
//   const handleBuildingChange = (propertyId) => {
//     setSelectedBuilding(propertyId);
//     setSelectedUnit("");
//     setUnits([]);
//     fetchUnits(propertyId);
//   };

//   // ── Reset unit when tab changes away from individual ──────────────────────
//   useEffect(() => {
//     if (activeTab !== "individual") setSelectedUnit("");
//   }, [activeTab]);

//   // ── Build recipients & fill template variables ────────────────────────────
//   const generateEmailContent = () => {
//     const community = communities.find(
//       (c) => Number(c.community_id) === parseInt(selectedCommunity)
//     );
//     const building = properties.find(
//       (p) => Number(p.property_id) === parseInt(selectedBuilding)
//     );
//     const unit = units.find(
//       (u) => Number(u.unit_id) === parseInt(selectedUnit)
//     );

//     let recipients = [];
//     switch (activeTab) {
//       case "individual":
//         if (unit) {
//           recipients = [{
//             name:  unit.customer_name  || "Customer",
//             email: unit.customer_email || `unit${unit.unit_number}@tempex.ae`,
//           }];
//         }
//         break;
//       case "building":
//         recipients = units.map((u) => ({
//           name:  u.customer_name  || "Customer",
//           email: u.customer_email || `unit${u.unit_number}@tempex.ae`,
//         }));
//         break;
//       case "community":
//         recipients = properties.map((p) => ({
//           name:  `${p.property_name} Residents`,
//           email: `${p.property_name.toLowerCase().replace(/\s+/g, ".")}@tempex.ae`,
//         }));
//         break;
//       default:
//         break;
//     }

//     const sampleData = {
//       customer_name:      unit?.customer_name   || "Valued Customer",
//       customer_email:     unit?.customer_email  || "customer@example.com",
//       unit_number:        unit?.unit_number     || "A-101",
//       building_name:      building?.property_name  || "Building Name",
//       community_name:     community?.community_name || "Community Name",
//       month:              "March",
//       year:               "2026",
//       billing_period:     "March 1-31, 2026",
//       invoice_number:     "INV-2026-03-001",
//       issue_date:         "April 1, 2026",
//       due_date:           "April 15, 2026",
//       meter_reading:      "45,230",
//       previous_reading:   "36,780",
//       consumption_trh:    "8,450",
//       consumption_tariff: "0.643",
//       consumption_charge: "5,430.35",
//       capacity_charge:    "2,150.00",
//       fuel_surcharge:     "633.75",
//       subtotal:           "8,214.10",
//       vat_amount:         "410.71",
//       total_amount:       "8,624.81",
//       registration_link:  "https://billing.tempex.ae/register/customer123",
//       reading_date:       "April 10, 2026",
//       reading_time:       "10:00 AM",
//       days_overdue:       "5",
//       threshold_limit:    "6,000",
//       excess_consumption: "2,450",
//     };

//     let filledMessage = selectedTemplate?.message || "";
//     let filledSubject = selectedTemplate?.subject || "";
//     Object.entries(sampleData).forEach(([key, value]) => {
//       filledMessage = filledMessage.replace(new RegExp(`{${key}}`, "g"), value);
//       filledSubject = filledSubject.replace(new RegExp(`{${key}}`, "g"), value);
//     });

//     return {
//       recipients,
//       subject:        filledSubject,
//       message:        filledMessage,
//       recipientCount: recipients.length,
//       templateName:   selectedTemplate?.name,
//       templateType:   selectedTemplate?.type,
//     };
//   };

//   // ── Validation & send ─────────────────────────────────────────────────────
//   const handleSendClick = () => {
//     if (!selectedCommunity)
//       return toast.error("Validation Error", "Please select a community");
//     if (activeTab === "building" && !selectedBuilding)
//       return toast.error("Validation Error", "Please select a building");
//     if (activeTab === "individual" && (!selectedBuilding || !selectedUnit))
//       return toast.error("Validation Error", "Please select both building and unit");
//     if (!selectedTemplate)
//       return toast.error("Validation Error", "Please select an email template");

//     setEmailDetails(generateEmailContent());
//     setConfirmDialogVisible(true);
//   };

//   const handleSendConfirm = async () => {
//     setConfirmDialogVisible(false);
//     setSending(true);
//     try {
//       for (const recipient of emailDetails.recipients) {
//         const templateParams = {
//           to_email: recipient.email,
//           to_name:  recipient.name,
//           subject:  emailDetails.subject,
//           message:  emailDetails.message,
//         };
//         await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_PUBLIC_KEY);
//       }
//       toast.success(
//         "Success",
//         `Email sent successfully to ${emailDetails.recipientCount} recipient${emailDetails.recipientCount !== 1 ? "s" : ""}!`
//       );
//       setSelectedCommunity("");
//       setSelectedBuilding("");
//       setSelectedUnit("");
//       setSelectedTemplate(null);
//       setIsTemplateAccordionOpen(false);
//       setProperties([]);
//       setUnits([]);
//       setEmailDetails(null);
//     } catch (error) {
//       console.error("EmailJS send error:", error);
//       toast.error("Error", "Failed to send email. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleSendReject = () => {
//     setConfirmDialogVisible(false);
//     setEmailDetails(null);
//   };

//   const handleSelectTemplate = (template) => {
//     setSelectedTemplate(template);
//     setIsTemplateAccordionOpen(false);
//     toast.success("Template Selected", `${template.name} is ready to use`);
//   };

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   const getBorderColor = () => themeUtils ? themeUtils.getBorderColor() : "#e5e7eb";
//   const getTextColor   = (primary = true) =>
//     themeUtils ? themeUtils.getTextColor(primary) : (primary ? "#111827" : "#6b7280");

//   const tabs = [
//     { id: "individual", label: "Individual", icon: Users,     description: "Send to specific unit" },
//     { id: "building",   label: "Building",   icon: Building2, description: "Send to all units in building" },
//     { id: "community",  label: "Community",  icon: Home,      description: "Send to entire community" },
//   ];

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── Email Preview / Confirm Dialog ── */}
//       <CustomConfirmDialog
//         visible={confirmDialogVisible}
//         onHide={handleSendReject} 
//         width="680px"
//         header={
//           <div className="flex items-center gap-4">
//             <div className="p-3  from-blue-500 to-purple-600 rounded-2xl shrink-0">
//               <Mail className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
//                 Confirm Email
//               </h3>
//               <p className="text-sm mt-0.5" style={{ color: themeUtils.getTextColor(false) }}>
//                 Template:{" "}
//                 <span className="font-semibold" style={{ color: themeUtils.getTextColor(true) }}>
//                   {emailDetails?.templateName}
//                 </span>
//               </p>
//               <p className="text-xs mt-0.5" style={{ color: themeUtils.getTextColor(false) }}>
//                 Sending to{" "}
//                 <span className="font-semibold text-blue-600">{emailDetails?.recipientCount}</span>{" "}
//                 recipient{emailDetails?.recipientCount !== 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>
//         }
//         message={
//           <div className="space-y-4">
//             {/* Recipients Block */}
//             <div className="rounded-xl border overflow-hidden" style={{ borderColor: themeUtils.getBorderColor() }}>
//               <div
//                 className="flex items-center justify-between px-4 py-2.5 border-b"
//                 style={{ backgroundColor: themeUtils.getBgColor("input"), borderColor: themeUtils.getBorderColor() }}
//               >
//                 <span className="text-sm font-semibold flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//                   <Users className="w-4 h-4 text-blue-500" />
//                   Recipients
//                 </span>
//                 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
//                   {emailDetails?.recipientCount}
//                 </span>
//               </div>
//               <div className="px-4 py-2" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
//                 {emailDetails?.recipients?.slice(0, 4).map((r, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm"
//                     style={{ borderColor: themeUtils.getBorderColor() }}
//                   >
//                     <span className="font-medium" style={{ color: themeUtils.getTextColor(true) }}>{r.name}</span>
//                     <span className="text-xs"     style={{ color: themeUtils.getTextColor(false) }}>{r.email}</span>
//                   </div>
//                 ))}
//                 {emailDetails?.recipientCount > 4 && (
//                   <p className="text-xs py-2 text-center font-medium" style={{ color: themeUtils.getTextColor(false) }}>
//                     +{emailDetails.recipientCount - 4} more recipients
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email Preview Block */}
//             <div className="rounded-xl border overflow-hidden" style={{ borderColor: themeUtils.getBorderColor() }}>
//               <div
//                 className="flex items-start gap-2 px-4 py-3 border-b"
//                 style={{ backgroundColor: themeUtils.getBgColor("input"), borderColor: themeUtils.getBorderColor() }}
//               >
//                 <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>
//                     Subject
//                   </p>
//                   <p className="text-sm font-bold leading-snug" style={{ color: themeUtils.getTextColor(true) }}>
//                     {emailDetails?.subject}
//                   </p>
//                 </div>
//               </div>
//               <div className="p-4 max-h-72 overflow-auto" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
//                 {emailDetails?.message?.split("\n").map((line, idx) => {
//                   const isDivider  = /^─+$/.test(line.trim());
//                   const isHeading  = /^[A-Z][A-Z\s]+:$/.test(line.trim());
//                   const isKeyValue = /^[A-Za-z\s]+:\s.+/.test(line.trim()) && !isHeading;
//                   const isBullet   = line.trim().startsWith("•");
//                   if (isDivider)
//                     return <hr key={idx} className="my-1 border-dashed" style={{ borderColor: themeUtils.getBorderColor() }} />;
//                   if (isHeading)
//                     return (
//                       <p key={idx} className="text-xs font-bold uppercase tracking-widest mt-3 mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>
//                         {line.replace(/:$/, "")}
//                       </p>
//                     );
//                   if (isKeyValue) {
//                     const colonIdx = line.indexOf(":");
//                     return (
//                       <p key={idx} className="text-sm leading-relaxed" style={{ color: themeUtils.getTextColor(true) }}>
//                         <span className="font-semibold">{line.substring(0, colonIdx)}:</span>
//                         <span style={{ color: themeUtils.getTextColor(false) }}>{line.substring(colonIdx + 1)}</span>
//                       </p>
//                     );
//                   }
//                   if (isBullet)
//                     return (
//                       <p key={idx} className="text-sm leading-relaxed pl-2" style={{ color: themeUtils.getTextColor(false) }}>
//                         {line}
//                       </p>
//                     );
//                   if (line.trim() === "") return <div key={idx} className="h-2" />;
//                   return (
//                     <p key={idx} className="text-sm leading-relaxed" style={{ color: themeUtils.getTextColor(true) }}>
//                       {line}
//                     </p>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         }
//         accept={handleSendConfirm}
//         reject={handleSendReject}
//         acceptLabel="Send Email"
//         rejectLabel="Cancel"
//       />

//       {/* ── Page ── */}
//       <div className="space-y-6">

//         {/* Header */}
//         <CardHeader>
//           <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 px-6 py-4">
//             <div className="flex items-center gap-4">
            
//               <div>
//                 <CardTitle themeUtils={themeUtils}>Send Notification</CardTitle>
               
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         {/* Modern Tabs */}
//         <div className="px-6">
//           <div className="flex gap-4">
//             {tabs.map((tab) => {
//               const Icon     = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     flex-1 relative overflow-hidden group
//                     px-6 py-4 rounded-2xl border-2 transition-all duration-300
//                     ${isActive ? "border-blue-500" : "border-transparent hover:border-gray-200"}
//                   `}
//                   style={{ backgroundColor: themeUtils.getBgColor("card") }}
//                 >
//                   {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="p-2 rounded-xl transition-all duration-300"
//                       style={{ backgroundColor: isActive ? "#eff6ff" : themeUtils.getBgColor("input") }}
//                     >
//                       <Icon className="w-5 h-5" style={{ color: isActive ? "#3b82f6" : themeUtils.getTextColor(false) }} />
//                     </div>
//                     <div className="text-left">
//                       <div className="font-semibold" style={{ color: themeUtils.getTextColor(true) }}>{tab.label}</div>
//                       <div className="text-xs"      style={{ color: themeUtils.getTextColor(false) }}>{tab.description}</div>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="px-6 pb-6 w-full">
//           <div className="max-w-5xl mx-auto space-y-6">

//             {/* ── Dropdowns Row ── */}
//             <div className="flex flex-wrap justify-center gap-4 transition-all duration-500 ease-in-out">

//               {/* Community Dropdown */}
//               <div
//                 className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
//                 style={{
//                   backgroundColor: themeUtils.getBgColor("card"),
//                   borderColor: selectedCommunity ? "#3b82f6" : themeUtils.getBorderColor(),
//                 }}
//               >
//                 <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//                   <RiCommunityLine className="w-5 h-5 text-blue-500" />
//                   Select Community <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedCommunity}
//                   onChange={(e) => handleCommunityChange(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     color: themeUtils.getTextColor(true),
//                     borderColor: themeUtils.getBorderColor(),
//                   }}
//                   disabled={loadingCommunities}
//                 >
//                   <option value="">
//                     {loadingCommunities ? "Loading communities..." : "Choose a community"}
//                   </option>
//                   {communities.map((c) => (
//                     <option key={c.community_id} value={c.community_id}>
//                       {c.community_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Building Dropdown */}
//               {(activeTab === "individual" || activeTab === "building") && (
//                 <div
//                   className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("card"),
//                     borderColor: selectedBuilding ? "#3b82f6" : themeUtils.getBorderColor(),
//                   }}
//                 >
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//                     <RiBuildingLine className="w-5 h-5 text-purple-500" />
//                     Select Building <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={selectedBuilding}
//                     onChange={(e) => handleBuildingChange(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
//                     style={{
//                       backgroundColor: themeUtils.getBgColor("input"),
//                       color: themeUtils.getTextColor(true),
//                       borderColor: themeUtils.getBorderColor(),
//                     }}
//                     disabled={!selectedCommunity || loadingProperties}
//                   >
//                     <option value="">
//                       {loadingProperties ? "Loading buildings..." : "Choose a building"}
//                     </option>
//                     {properties.map((p) => (
//                       <option key={p.property_id} value={p.property_id}>
//                         {p.property_name}
//                         {p.total_floors ? ` (${p.total_floors} floors)` : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Unit Dropdown */}
//               {activeTab === "individual" && (
//                 <div
//                   className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("card"),
//                     borderColor: selectedUnit ? "#3b82f6" : themeUtils.getBorderColor(),
//                   }}
//                 >
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//                     <RiHomeGearLine className="w-5 h-5 text-pink-500" />
//                     Select Unit <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={selectedUnit}
//                     onChange={(e) => setSelectedUnit(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
//                     style={{
//                       backgroundColor: themeUtils.getBgColor("input"),
//                       color: themeUtils.getTextColor(true),
//                       borderColor: themeUtils.getBorderColor(),
//                     }}
//                     disabled={!selectedBuilding || loadingUnits}
//                   >
//                     <option value="">
//                       {loadingUnits ? "Loading units..." : "Choose a unit"}
//                     </option>
//                     {units.map((u) => (
//                       <option key={u.unit_id} value={u.unit_id}>
//                         Unit {u.unit_number}
//                         {u.floor_number !== null && u.floor_number !== undefined
//                           ? ` - Floor ${u.floor_number}`
//                           : ""}
//                         {u.customer_name ? ` - ${u.customer_name}` : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </div>

//             {/* ── Email Template Section with ListTemplate embedded ── */}
//             <div
//               className="rounded-2xl border-2 overflow-hidden transition-all duration-300"
//               style={{
//                 backgroundColor: themeUtils.getBgColor("card"),
//                 borderColor: selectedTemplate ? "#3b82f6" : themeUtils.getBorderColor(),
//               }}
//             >
//               {/* Section Header */}
//               <div 
//                   className="px-5 py-4 border-b cursor-pointer transition-colors "
//                   style={{ borderColor: themeUtils.getBorderColor() }}
//                   onClick={() => setIsTemplateAccordionOpen((prev) => !prev)}
//                 >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="p-2 rounded-xl"
//                       style={{ backgroundColor: selectedTemplate ? "#eff6ff" : themeUtils.getBgColor("input") }}
//                     >
//                       <FileText
//                         className="w-5 h-5"
//                         style={{ color: selectedTemplate ? "#3b82f6" : themeUtils.getTextColor(false) }}
//                       />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-sm flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//                         Select Email Template
//                         <span className="text-red-500">*</span>
//                         {selectedTemplate && (
//                           <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
//                             <CheckCircle className="w-3 h-3" /> Selected: {selectedTemplate.name}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {/* Collapse/Expand button - now just visual, no click handler needed */}
//                   <button
//                     type="button"
//                     className="p-1.5 rounded-lg transition-colors pointer-events-none"
//                   >
//                     {isTemplateAccordionOpen ? (
//                       <ChevronUp className="w-5 h-5" style={{ color: themeUtils.getTextColor(false) }} />
//                     ) : (
//                       <ChevronDown className="w-5 h-5" style={{ color: themeUtils.getTextColor(false) }} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Template List (embedded ListTemplate) */}
//               {isTemplateAccordionOpen && (
//                 <div className="border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
//                   <ListTemplate 
//                     embedded={true}
//                     onSelectTemplate={handleSelectTemplate}
//                     selectedTemplateId={selectedTemplate?.id}
//                   />
//                 </div>
//               )}

//               {/* Selected Template Preview (when collapsed and template selected) */}
//               {!isTemplateAccordionOpen && selectedTemplate && (
//                 <div className="p-5">
//                   <div className="flex items-start gap-4">
//                     <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedTemplate.color} shadow-lg shrink-0`}>
//                       <Mail className="h-5 w-5 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${getTypeColor(selectedTemplate.type)}`}>
//                           {selectedTemplate.type}
//                         </span>
//                       </div>
//                       <p className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>
//                         Subject: {selectedTemplate.subject}
//                       </p>
//                       <p className="text-sm line-clamp-2" style={{ color: themeUtils.getTextColor(false) }}>
//                         {selectedTemplate.message}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ── Send Button ── */}
//             <div className="flex justify-end mt-2">
//               <Button
//                 variant="primary"
//                 onClick={handleSendClick}
//                 loading={sending}
//                 disabled={
//                   !selectedCommunity ||
//                   (activeTab === "individual" && (!selectedBuilding || !selectedUnit)) ||
//                   (activeTab === "building"   && !selectedBuilding) ||
//                   !selectedTemplate ||
//                   sending
//                 }
//                 className="min-w-[160px] py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 icon={RiMailSendLine}
//               >
//                 Send Notification
//               </Button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Notification;



import emailjs from "@emailjs/browser";
import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Home,
  Mail,
  Bell,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils";
import { useToast } from "../../../ui/common/CostumeTost";
import { CardHeader, CardTitle } from "../../../ui/Common/Card";
import Button from "../../../ui/Common/Button";
import CustomConfirmDialog from "../../../ui/common/CustomConfirmDialog";
import CommonDialog from "../../../ui/Common/CommonDialog";
import Card from "../../../ui/Common/Card";
import {
  RiMailSendLine,
  RiCommunityLine,
  RiBuildingLine,
  RiHomeGearLine,
} from "react-icons/ri";
import {
  API_URL_COMMUNITY,
  API_URL_PROPERTY,
  API_URL_UNIT,
  EMAIL_SERVICE_ID,
  EMAIL_TEMPLATE_ID,
  EMAIL_PUBLIC_KEY,
} from "../../../../config";

// Import template components
import ListTemplate from "./ListTemplate";

// ── API Base URLs ─────────────────────────────────────────────────────────────
const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";
const propertyBaseURL  = API_URL_PROPERTY  || "http://192.168.1.39:5000";
const unitBaseURL      = API_URL_UNIT      || "http://192.168.1.39:5000";

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
const Notification = () => {
  const { themeUtils } = useTheme();
  const toast = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState("individual");

  // ── API data ──────────────────────────────────────────────────────────────
  const [communities, setCommunities] = useState([]);
  const [properties,  setProperties]  = useState([]);
  const [units,       setUnits]       = useState([]);

  // ── Loading states ────────────────────────────────────────────────────────
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingProperties,  setLoadingProperties]  = useState(false);
  const [loadingUnits,       setLoadingUnits]       = useState(false);

  // ── Selected values ───────────────────────────────────────────────────────
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedBuilding,  setSelectedBuilding]  = useState("");
  const [selectedUnit,      setSelectedUnit]      = useState("");
  const [selectedTemplate,  setSelectedTemplate]  = useState(null);

  // ── UI states ─────────────────────────────────────────────────────────────
  const [sending,                 setSending]                 = useState(false);
  const [confirmDialogVisible,    setConfirmDialogVisible]    = useState(false);
  const [emailDetails,            setEmailDetails]            = useState(null);
  const [isTemplateAccordionOpen, setIsTemplateAccordionOpen] = useState(false);

  // ── Fetch Communities on mount ────────────────────────────────────────────
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const response = await fetch(`${communityBaseURL}/api/communities`);
        const data = await response.json();
        if (response.ok) {
          setCommunities(data);
        } else {
          console.error("Error fetching communities:", data);
          toast.error("Error", "Failed to load communities");
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Error", "Failed to load communities");
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  // ── Fetch Properties by Community ─────────────────────────────────────────
  const fetchProperties = async (communityId) => {
    if (!communityId) {
      setProperties([]);
      return;
    }
    try {
      setLoadingProperties(true);
      const response = await fetch(`${propertyBaseURL}/api/properties/by-community/${communityId}`);
      const data = await response.json();

      // Handle different response structures (similar to AddUnit)
      const buildings = Array.isArray(data)
        ? data
        : Array.isArray(data?.result)
        ? data.result
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const formatted = buildings.map((p) => ({
        property_id:   Number(p.building_id || p.property_id),  // accept either
        property_name: p.building_name || p.property_name,
        total_floors:  Number(p.total_floors || 0),
      }));

      setProperties(formatted);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  // ── Fetch Units by Property ───────────────────────────────────────────────
  const fetchUnits = async (propertyId) => {
    if (!propertyId) {
      setUnits([]);
      return;
    }
    try {
      setLoadingUnits(true);
      const response = await fetch(`${unitBaseURL}/api/units/by-property/${propertyId}`);
      const data = await response.json();

      // Handle different response structures
      const unitsList = Array.isArray(data)
        ? data
        : Array.isArray(data?.result)
        ? data.result
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const formatted = unitsList.map((u) => ({
        unit_id:        Number(u.unit_id),
        unit_number:    u.unit_number,
        floor_number:   u.floor_number,
        customer_name:  u.customer_name,
        customer_email: u.customer_email, // may be null
      }));

      setUnits(formatted);
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  // ── Community change ──────────────────────────────────────────────────────
  const handleCommunityChange = (communityId) => {
    setSelectedCommunity(communityId);
    setSelectedBuilding("");
    setSelectedUnit("");
    setProperties([]);
    setUnits([]);
    fetchProperties(communityId);
  };

  // ── Building change ───────────────────────────────────────────────────────
  const handleBuildingChange = (propertyId) => {
    setSelectedBuilding(propertyId);
    setSelectedUnit("");
    setUnits([]);
    fetchUnits(propertyId);
  };

  // ── Reset unit when tab changes away from individual ──────────────────────
  useEffect(() => {
    if (activeTab !== "individual") setSelectedUnit("");
  }, [activeTab]);

  // ── Build recipients & fill template variables ────────────────────────────
  const generateEmailContent = () => {
    const community = communities.find(
      (c) => Number(c.community_id) === parseInt(selectedCommunity)
    );
    const building = properties.find(
      (p) => Number(p.property_id) === parseInt(selectedBuilding)
    );
    const unit = units.find(
      (u) => Number(u.unit_id) === parseInt(selectedUnit)
    );

    let recipients = [];
    switch (activeTab) {
      case "individual":
        if (unit) {
          recipients = [{
            name:  unit.customer_name  || "Customer",
            email: unit.customer_email || `unit${unit.unit_number}@tempex.ae`,
          }];
        }
        break;
      case "building":
        recipients = units.map((u) => ({
          name:  u.customer_name  || "Customer",
          email: u.customer_email || `unit${u.unit_number}@tempex.ae`,
        }));
        break;
      case "community":
        recipients = properties.map((p) => ({
          name:  `${p.property_name} Residents`,
          email: `${p.property_name.toLowerCase().replace(/\s+/g, ".")}@tempex.ae`,
        }));
        break;
      default:
        break;
    }

    const sampleData = {
      customer_name:      unit?.customer_name   || "Valued Customer",
      customer_email:     unit?.customer_email  || "customer@example.com",
      unit_number:        unit?.unit_number     || "A-101",
      building_name:      building?.property_name  || "Building Name",
      community_name:     community?.community_name || "Community Name",
      month:              "March",
      year:               "2026",
      billing_period:     "March 1-31, 2026",
      invoice_number:     "INV-2026-03-001",
      issue_date:         "April 1, 2026",
      due_date:           "April 15, 2026",
      meter_reading:      "45,230",
      previous_reading:   "36,780",
      consumption_trh:    "8,450",
      consumption_tariff: "0.643",
      consumption_charge: "5,430.35",
      capacity_charge:    "2,150.00",
      fuel_surcharge:     "633.75",
      subtotal:           "8,214.10",
      vat_amount:         "410.71",
      total_amount:       "8,624.81",
      registration_link:  "https://billing.tempex.ae/register/customer123",
      reading_date:       "April 10, 2026",
      reading_time:       "10:00 AM",
      days_overdue:       "5",
      threshold_limit:    "6,000",
      excess_consumption: "2,450",
    };

    let filledMessage = selectedTemplate?.message || "";
    let filledSubject = selectedTemplate?.subject || "";
    Object.entries(sampleData).forEach(([key, value]) => {
      filledMessage = filledMessage.replace(new RegExp(`{${key}}`, "g"), value);
      filledSubject = filledSubject.replace(new RegExp(`{${key}}`, "g"), value);
    });

    return {
      recipients,
      subject:        filledSubject,
      message:        filledMessage,
      recipientCount: recipients.length,
      templateName:   selectedTemplate?.name,
      templateType:   selectedTemplate?.type,
    };
  };

  // ── Validation & send ─────────────────────────────────────────────────────
  const handleSendClick = () => {
    if (!selectedCommunity)
      return toast.error("Validation Error", "Please select a community");
    if (activeTab === "building" && !selectedBuilding)
      return toast.error("Validation Error", "Please select a building");
    if (activeTab === "individual" && (!selectedBuilding || !selectedUnit))
      return toast.error("Validation Error", "Please select both building and unit");
    if (!selectedTemplate)
      return toast.error("Validation Error", "Please select an email template");

    setEmailDetails(generateEmailContent());
    setConfirmDialogVisible(true);
  };

  const handleSendConfirm = async () => {
    setConfirmDialogVisible(false);
    setSending(true);
    try {
      for (const recipient of emailDetails.recipients) {
        const templateParams = {
          to_email: recipient.email,
          to_name:  recipient.name,
          subject:  emailDetails.subject,
          message:  emailDetails.message,
        };
        await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_PUBLIC_KEY);
      }
      toast.success(
        "Success",
        `Email sent successfully to ${emailDetails.recipientCount} recipient${emailDetails.recipientCount !== 1 ? "s" : ""}!`
      );
      setSelectedCommunity("");
      setSelectedBuilding("");
      setSelectedUnit("");
      setSelectedTemplate(null);
      setIsTemplateAccordionOpen(false);
      setProperties([]);
      setUnits([]);
      setEmailDetails(null);
    } catch (error) {
      console.error("EmailJS send error:", error);
      toast.error("Error", "Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSendReject = () => {
    setConfirmDialogVisible(false);
    setEmailDetails(null);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsTemplateAccordionOpen(false);
    toast.success("Template Selected", `${template.name} is ready to use`);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBorderColor = () => themeUtils ? themeUtils.getBorderColor() : "#e5e7eb";
  const getTextColor   = (primary = true) =>
    themeUtils ? themeUtils.getTextColor(primary) : (primary ? "#111827" : "#6b7280");

  const tabs = [
    { id: "individual", label: "Individual", icon: Users,     description: "Send to specific unit" },
    { id: "building",   label: "Building",   icon: Building2, description: "Send to all units in building" },
    { id: "community",  label: "Community",  icon: Home,      description: "Send to entire community" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Email Preview / Confirm Dialog ── */}
      <CustomConfirmDialog
        visible={confirmDialogVisible}
        onHide={handleSendReject} 
        width="680px"
        header={
          <div className="flex items-center gap-4">
            <div className="p-3  from-blue-500 to-purple-600 rounded-2xl shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
                Confirm Email
              </h3>
              <p className="text-sm mt-0.5" style={{ color: themeUtils.getTextColor(false) }}>
                Template:{" "}
                <span className="font-semibold" style={{ color: themeUtils.getTextColor(true) }}>
                  {emailDetails?.templateName}
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: themeUtils.getTextColor(false) }}>
                Sending to{" "}
                <span className="font-semibold text-blue-600">{emailDetails?.recipientCount}</span>{" "}
                recipient{emailDetails?.recipientCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        }
        message={
          <div className="space-y-4">
            {/* Recipients Block */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: themeUtils.getBorderColor() }}>
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ backgroundColor: themeUtils.getBgColor("input"), borderColor: themeUtils.getBorderColor() }}
              >
                <span className="text-sm font-semibold flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                  <Users className="w-4 h-4 text-blue-500" />
                  Recipients
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  {emailDetails?.recipientCount}
                </span>
              </div>
              <div className="px-4 py-2" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
                {emailDetails?.recipients?.slice(0, 4).map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm"
                    style={{ borderColor: themeUtils.getBorderColor() }}
                  >
                    <span className="font-medium" style={{ color: themeUtils.getTextColor(true) }}>{r.name}</span>
                    <span className="text-xs"     style={{ color: themeUtils.getTextColor(false) }}>{r.email}</span>
                  </div>
                ))}
                {emailDetails?.recipientCount > 4 && (
                  <p className="text-xs py-2 text-center font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                    +{emailDetails.recipientCount - 4} more recipients
                  </p>
                )}
              </div>
            </div>

            {/* Email Preview Block */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: themeUtils.getBorderColor() }}>
              <div
                className="flex items-start gap-2 px-4 py-3 border-b"
                style={{ backgroundColor: themeUtils.getBgColor("input"), borderColor: themeUtils.getBorderColor() }}
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Subject
                  </p>
                  <p className="text-sm font-bold leading-snug" style={{ color: themeUtils.getTextColor(true) }}>
                    {emailDetails?.subject}
                  </p>
                </div>
              </div>
              <div className="p-4 max-h-72 overflow-auto" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
                {emailDetails?.message?.split("\n").map((line, idx) => {
                  const isDivider  = /^─+$/.test(line.trim());
                  const isHeading  = /^[A-Z][A-Z\s]+:$/.test(line.trim());
                  const isKeyValue = /^[A-Za-z\s]+:\s.+/.test(line.trim()) && !isHeading;
                  const isBullet   = line.trim().startsWith("•");
                  if (isDivider)
                    return <hr key={idx} className="my-1 border-dashed" style={{ borderColor: themeUtils.getBorderColor() }} />;
                  if (isHeading)
                    return (
                      <p key={idx} className="text-xs font-bold uppercase tracking-widest mt-3 mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>
                        {line.replace(/:$/, "")}
                      </p>
                    );
                  if (isKeyValue) {
                    const colonIdx = line.indexOf(":");
                    return (
                      <p key={idx} className="text-sm leading-relaxed" style={{ color: themeUtils.getTextColor(true) }}>
                        <span className="font-semibold">{line.substring(0, colonIdx)}:</span>
                        <span style={{ color: themeUtils.getTextColor(false) }}>{line.substring(colonIdx + 1)}</span>
                      </p>
                    );
                  }
                  if (isBullet)
                    return (
                      <p key={idx} className="text-sm leading-relaxed pl-2" style={{ color: themeUtils.getTextColor(false) }}>
                        {line}
                      </p>
                    );
                  if (line.trim() === "") return <div key={idx} className="h-2" />;
                  return (
                    <p key={idx} className="text-sm leading-relaxed" style={{ color: themeUtils.getTextColor(true) }}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        }
        accept={handleSendConfirm}
        reject={handleSendReject}
        acceptLabel="Send Email"
        rejectLabel="Cancel"
      />

      {/* ── Page ── */}
      <div className="space-y-6">

        {/* Header */}
        <CardHeader>
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle themeUtils={themeUtils}>Send Notification</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Modern Tabs */}
        <div className="px-6">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon     = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 relative overflow-hidden group
                    px-6 py-4 rounded-2xl border-2 transition-all duration-300
                    ${isActive ? "border-blue-500" : "border-transparent hover:border-gray-200"}
                  `}
                  style={{ backgroundColor: themeUtils.getBgColor("card") }}
                >
                  {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl transition-all duration-300"
                      style={{ backgroundColor: isActive ? "#eff6ff" : themeUtils.getBgColor("input") }}
                    >
                      <Icon className="w-5 h-5" style={{ color: isActive ? "#3b82f6" : themeUtils.getTextColor(false) }} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold" style={{ color: themeUtils.getTextColor(true) }}>{tab.label}</div>
                      <div className="text-xs"      style={{ color: themeUtils.getTextColor(false) }}>{tab.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6 w-full">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Dropdowns Row ── */}
            <div className="flex flex-wrap justify-center gap-4 transition-all duration-500 ease-in-out">

              {/* Community Dropdown */}
              <div
                className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: selectedCommunity ? "#3b82f6" : themeUtils.getBorderColor(),
                }}
              >
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                  <RiCommunityLine className="w-5 h-5 text-blue-500" />
                  Select Community <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => handleCommunityChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={loadingCommunities}
                >
                  <option value="">
                    {loadingCommunities ? "Loading communities..." : "Choose a community"}
                  </option>
                  {communities.map((c) => (
                    <option key={c.community_id} value={String(c.community_id)}>
                      {c.community_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Building Dropdown */}
              {(activeTab === "individual" || activeTab === "building") && (
                <div
                  className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
                  style={{
                    backgroundColor: themeUtils.getBgColor("card"),
                    borderColor: selectedBuilding ? "#3b82f6" : themeUtils.getBorderColor(),
                  }}
                >
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                    <RiBuildingLine className="w-5 h-5 text-purple-500" />
                    Select Building <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      color: themeUtils.getTextColor(true),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                    disabled={!selectedCommunity || loadingProperties}
                  >
                    <option value="">
                      {loadingProperties ? "Loading buildings..." : "Choose a building"}
                    </option>
                    {properties.map((p) => (
                      <option key={p.property_id} value={String(p.property_id)}>
                        {p.property_name}
                        {p.total_floors ? ` (${p.total_floors} floors)` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Unit Dropdown */}
              {activeTab === "individual" && (
                <div
                  className="p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg w-full max-w-xs"
                  style={{
                    backgroundColor: themeUtils.getBgColor("card"),
                    borderColor: selectedUnit ? "#3b82f6" : themeUtils.getBorderColor(),
                  }}
                >
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                    <RiHomeGearLine className="w-5 h-5 text-pink-500" />
                    Select Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 appearance-none"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      color: themeUtils.getTextColor(true),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                    disabled={!selectedBuilding || loadingUnits}
                  >
                    <option value="">
                      {loadingUnits ? "Loading units..." : "Choose a unit"}
                    </option>
                    {units.map((u) => (
                      <option key={u.unit_id} value={String(u.unit_id)}>
                        Unit {u.unit_number}
                        {u.floor_number !== null && u.floor_number !== undefined
                          ? ` - Floor ${u.floor_number}`
                          : ""}
                        {u.customer_name ? ` - ${u.customer_name}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* ── Email Template Section with ListTemplate embedded ── */}
            <div
              className="rounded-2xl border-2 overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: themeUtils.getBgColor("card"),
                borderColor: selectedTemplate ? "#3b82f6" : themeUtils.getBorderColor(),
              }}
            >
              {/* Section Header */}
              <div 
                className="px-5 py-4 border-b cursor-pointer transition-colors"
                style={{ borderColor: themeUtils.getBorderColor() }}
                onClick={() => setIsTemplateAccordionOpen((prev) => !prev)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: selectedTemplate ? "#eff6ff" : themeUtils.getBgColor("input") }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: selectedTemplate ? "#3b82f6" : themeUtils.getTextColor(false) }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                        Select Email Template
                        <span className="text-red-500">*</span>
                        {selectedTemplate && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                            <CheckCircle className="w-3 h-3" /> Selected: {selectedTemplate.name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Collapse/Expand button */}
                  <button
                    type="button"
                    className="p-1.5 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTemplateAccordionOpen((prev) => !prev);
                    }}
                  >
                    {isTemplateAccordionOpen ? (
                      <ChevronUp className="w-5 h-5" style={{ color: themeUtils.getTextColor(false) }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: themeUtils.getTextColor(false) }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Template List (embedded ListTemplate) */}
              {isTemplateAccordionOpen && (
                <div className="border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <ListTemplate 
                    embedded={true}
                    onSelectTemplate={handleSelectTemplate}
                    selectedTemplateId={selectedTemplate?.id}
                  />
                </div>
              )}

              {/* Selected Template Preview (when collapsed and template selected) */}
              {!isTemplateAccordionOpen && selectedTemplate && (
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedTemplate.color} shadow-lg shrink-0`}>
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${getTypeColor(selectedTemplate.type)}`}>
                          {selectedTemplate.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>
                        Subject: {selectedTemplate.subject}
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: themeUtils.getTextColor(false) }}>
                        {selectedTemplate.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Send Button ── */}
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                onClick={handleSendClick}
                loading={sending}
                disabled={
                  !selectedCommunity ||
                  (activeTab === "individual" && (!selectedBuilding || !selectedUnit)) ||
                  (activeTab === "building"   && !selectedBuilding) ||
                  !selectedTemplate ||
                  sending
                }
                className="min-w-[160px] py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                icon={RiMailSendLine}
              >
                Send Notification
              </Button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;