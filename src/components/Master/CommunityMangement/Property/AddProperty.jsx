// import React, { useState, useEffect } from "react";
// import { Upload, X, ChevronDown, Search } from "lucide-react";
// import { useTheme } from "../../../../ui/Settings/themeUtils";
// import { useToast } from "../../../../ui/common/CostumeTost";
// import Button from "../../../../ui/Common/Button";
// import { API_URL_PROPERTY, API_URL_COMMUNITY } from "../../../../../config";

// const AddProperty = ({ onClose, onSuccess }) => {
//   const { themeUtils } = useTheme();
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const [communities, setCommunities] = useState([]);
//   const [loadingCommunities, setLoadingCommunities] = useState(true);
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
//   const [countrySearch, setCountrySearch] = useState("");
//   const [form, setForm] = useState({
//     community_id: "",
//     property_name: "",
//     address1: "",
//     address2: "",
//     city: "",
//     country_code: "+971",
//     manager_name: "",
//     manager_contact: "",
//     total_units: "",
//     description: "",
//   });

//   // Validation errors state
//   const [errors, setErrors] = useState({
//     community_id: "",
//     property_name: "",
//     address1: "",
//     address2: "",
//     city: "",
//     country_code: "",
//     manager_name: "",
//     manager_contact: "",
//     total_units: "",
//     description: "",
//   });

//   // Country codes with digit validation rules
//   const countryCodes = [
//     { code: "+971", country: "UAE", digits: 9, search: "uae united arab emirates" },
//     { code: "+966", country: "Saudi Arabia", digits: 9, search: "saudi arabia ksa" },
//     { code: "+965", country: "Kuwait", digits: 8, search: "kuwait" },
//     { code: "+974", country: "Qatar", digits: 8, search: "qatar" },
//     { code: "+973", country: "Bahrain", digits: 8, search: "bahrain" },
//     { code: "+968", country: "Oman", digits: 8, search: "oman" },
//     { code: "+20", country: "Egypt", digits: 10, search: "egypt" },
//     { code: "+962", country: "Jordan", digits: 9, search: "jordan" },
//     { code: "+961", country: "Lebanon", digits: 8, search: "lebanon" },
//     { code: "+967", country: "Yemen", digits: 9, search: "yemen" },
//     { code: "+964", country: "Iraq", digits: 10, search: "iraq" },
//     { code: "+963", country: "Syria", digits: 9, search: "syria" },
//     { code: "+92", country: "Pakistan", digits: 10, search: "pakistan pak" },
//     { code: "+94", country: "Sri Lanka", digits: 9, search: "sri lanka" },
//     { code: "+880", country: "Bangladesh", digits: 10, search: "bangladesh" },
//     { code: "+60", country: "Malaysia", digits: 9, search: "malaysia" },
//     { code: "+65", country: "Singapore", digits: 8, search: "singapore" },
//     { code: "+62", country: "Indonesia", digits: 10, search: "indonesia" },
//     { code: "+63", country: "Philippines", digits: 10, search: "philippines" },
//     { code: "+66", country: "Thailand", digits: 9, search: "thailand" },
//     { code: "+84", country: "Vietnam", digits: 9, search: "vietnam" },
//     { code: "+44", country: "United Kingdom", digits: 10, search: "uk united kingdom britain england" },
//     { code: "+1", country: "USA/Canada", digits: 10, search: "usa united states america canada" },
//     { code: "+33", country: "France", digits: 9, search: "france" },
//     { code: "+49", country: "Germany", digits: 10, search: "germany" },
//     { code: "+39", country: "Italy", digits: 10, search: "italy" },
//     { code: "+34", country: "Spain", digits: 9, search: "spain" },
//     { code: "+31", country: "Netherlands", digits: 9, search: "netherlands holland" },
//     { code: "+32", country: "Belgium", digits: 8, search: "belgium" },
//     { code: "+41", country: "Switzerland", digits: 9, search: "switzerland" },
//     { code: "+43", country: "Austria", digits: 10, search: "austria" },
//     { code: "+46", country: "Sweden", digits: 9, search: "sweden" },
//     { code: "+47", country: "Norway", digits: 8, search: "norway" },
//     { code: "+45", country: "Denmark", digits: 8, search: "denmark" },
//     { code: "+358", country: "Finland", digits: 9, search: "finland" },
//     { code: "+353", country: "Ireland", digits: 9, search: "ireland" },
//     { code: "+351", country: "Portugal", digits: 9, search: "portugal" },
//     { code: "+30", country: "Greece", digits: 10, search: "greece" },
//     { code: "+90", country: "Turkey", digits: 10, search: "turkey" },
//     { code: "+7", country: "Russia", digits: 10, search: "russia" },
//     { code: "+380", country: "Ukraine", digits: 9, search: "ukraine" },
//     { code: "+48", country: "Poland", digits: 9, search: "poland" },
//     { code: "+420", country: "Czech Republic", digits: 9, search: "czech republic" },
//     { code: "+36", country: "Hungary", digits: 9, search: "hungary" },
//     { code: "+40", country: "Romania", digits: 9, search: "romania" },
//     { code: "+359", country: "Bulgaria", digits: 9, search: "bulgaria" },
//     { code: "+381", country: "Serbia", digits: 9, search: "serbia" },
//     { code: "+385", country: "Croatia", digits: 9, search: "croatia" },
//     { code: "+86", country: "China", digits: 11, search: "china" },
//     { code: "+852", country: "Hong Kong", digits: 8, search: "hong kong" },
//     { code: "+853", country: "Macau", digits: 8, search: "macau" },
//     { code: "+886", country: "Taiwan", digits: 9, search: "taiwan" },
//     { code: "+81", country: "Japan", digits: 10, search: "japan" },
//     { code: "+82", country: "South Korea", digits: 10, search: "south korea korea" },
//     { code: "+61", country: "Australia", digits: 9, search: "australia" },
//     { code: "+64", country: "New Zealand", digits: 9, search: "new zealand" },
//     { code: "+27", country: "South Africa", digits: 9, search: "south africa" },
//     { code: "+234", country: "Nigeria", digits: 10, search: "nigeria" },
//     { code: "+254", country: "Kenya", digits: 9, search: "kenya" },
//     { code: "+212", country: "Morocco", digits: 9, search: "morocco" },
//     { code: "+216", country: "Tunisia", digits: 8, search: "tunisia" },
//     { code: "+213", country: "Algeria", digits: 9, search: "algeria" },
//   ];

//   // Base URL for API
//   const baseURL = API_URL_PROPERTY || "http://localhost:5000";
//   const communityBaseURL = API_URL_COMMUNITY || "http://localhost:5000";

//   // Get current user ID from localStorage
//   const getCurrentUserId = () => {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         return user.id || user.user_id || null;
//       }
//     } catch (e) {
//       console.error("Error getting user ID:", e);
//     }
//     console.warn("No user ID found in localStorage");
//     return null;
//   };

//   // Get current country's digit requirement
//   const getCurrentCountryDigits = () => {
//     const country = countryCodes.find(c => c.code === form.country_code);
//     return country ? country.digits : 10;
//   };

//   // Filter countries based on search
//   const filteredCountries = countrySearch
//     ? countryCodes.filter(
//         (c) =>
//           c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
//           c.code.includes(countrySearch) ||
//           c.search?.toLowerCase().includes(countrySearch.toLowerCase())
//       )
//     : countryCodes;

//   // Get selected country display
//   const selectedCountry = countryCodes.find((c) => c.code === form.country_code);

//   // Get selected community
//   const selectedCommunity = communities.find(
//     (c) => c.community_id === parseInt(form.community_id)
//   );

//   // Fetch communities
//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         setLoadingCommunities(true);
//         const response = await fetch(`${communityBaseURL}/api/communities`);
//         const result = await response.json();

//         if (response.ok) {
//           const communityList = Array.isArray(result) ? result : result.data || [];
//           setCommunities(communityList);
//         } else {
//           toast.error("Error", result.message || "Failed to load communities");
//         }
//       } catch (error) {
//         toast.error("Error", "Failed to load communities.");
//       } finally {
//         setLoadingCommunities(false);
//       }
//     };

//     fetchCommunities();
//   }, [communityBaseURL, toast]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//       if (!validTypes.includes(selectedFile.type)) {
//         toast.error("Invalid File Type", "Please select a valid image file (JPEG, PNG, or WEBP)");
//         return;
//       }

//       if (selectedFile.size > 5 * 1024 * 1024) {
//         toast.error("File Too Large", "Image size should be less than 5MB");
//         return;
//       }

//       setFile(selectedFile);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   // Remove selected image
//   const handleRemoveImage = () => {
//     setFile(null);
//     setPreviewUrl(null);
//     const fileInput = document.getElementById('property-image');
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   // Validation rules
//   const validateForm = () => {
//     const newErrors = {
//       community_id: "",
//       property_name: "",
//       address1: "",
//       address2: "",
//       city: "",
//       country_code: "",
//       manager_name: "",
//       manager_contact: "",
//       total_units: "",
//       description: "",
//     };
//     let isValid = true;

//     // Community validation
//     if (!form.community_id) {
//       newErrors.community_id = "Community is required";
//       isValid = false;
//     }

//     // Property Name validation
//     if (!form.property_name.trim()) {
//       newErrors.property_name = "Property name is required";
//       isValid = false;
//     } else if (form.property_name.length < 3) {
//       newErrors.property_name = "Property name must be at least 3 characters";
//       isValid = false;
//     } else if (form.property_name.length > 150) {
//       newErrors.property_name = "Property name cannot exceed 150 characters";
//       isValid = false;
//     }

//     // Address 1 validation
//     if (!form.address1.trim()) {
//       newErrors.address1 = "Address is required";
//       isValid = false;
//     } else if (form.address1.length > 200) {
//       newErrors.address1 = "Address cannot exceed 200 characters";
//       isValid = false;
//     }

//     // Address 2 validation
//     if (form.address2 && form.address2.length > 200) {
//       newErrors.address2 = "Address cannot exceed 200 characters";
//       isValid = false;
//     }

//     // City validation
//     if (!form.city.trim()) {
//       newErrors.city = "City is required";
//       isValid = false;
//     } else if (form.city.length > 100) {
//       newErrors.city = "City cannot exceed 100 characters";
//       isValid = false;
//     }

//     // Country code validation
//     if (!form.country_code) {
//       newErrors.country_code = "Country code is required";
//       isValid = false;
//     }

//     // Manager name validation
//     if (form.manager_name) {
//       const nameRegex = /^[A-Za-z\s]+$/;
//       if (!nameRegex.test(form.manager_name.trim())) {
//         newErrors.manager_name = "Manager name can only contain letters and spaces";
//         isValid = false;
//       } else if (form.manager_name.trim().length > 100) {
//         newErrors.manager_name = "Manager name cannot exceed 100 characters";
//         isValid = false;
//       }
//     }

//     // Manager Contact validation
//     if (form.manager_contact) {
//       const phoneRegex = /^[0-9]+$/;
//       if (!phoneRegex.test(form.manager_contact)) {
//         newErrors.manager_contact = "Please enter a valid phone number (digits only)";
//         isValid = false;
//       } else {
//         const requiredDigits = getCurrentCountryDigits();
//         if (form.manager_contact.length !== requiredDigits) {
//           newErrors.manager_contact = `Phone number must be exactly ${requiredDigits} digits for ${selectedCountry?.country || 'this country'}`;
//           isValid = false;
//         }
//       }
//     }

//     // Total Units validation
//     if (form.total_units && parseInt(form.total_units) < 0) {
//       newErrors.total_units = "Total units cannot be negative";
//       isValid = false;
//     }

//     // Description validation
//     if (form.description && form.description.length > 500) {
//       newErrors.description = "Description cannot exceed 500 characters";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case "community_id":
//         if (!value) return "Community is required";
//         return "";

//       case "property_name":
//         if (!value.trim()) return "Property name is required";
//         if (value.length < 3) return "Property name must be at least 3 characters";
//         if (value.length > 150) return "Property name cannot exceed 150 characters";
//         return "";

//       case "address1":
//         if (!value.trim()) return "Address is required";
//         if (value.length > 200) return "Address cannot exceed 200 characters";
//         return "";

//       case "address2":
//         if (value && value.length > 200) return "Address cannot exceed 200 characters";
//         return "";

//       case "city":
//         if (!value.trim()) return "City is required";
//         if (value.length > 100) return "City cannot exceed 100 characters";
//         return "";

//       case "country_code":
//         if (!value) return "Country code is required";
//         return "";

//       case "manager_name":
//         if (value) {
//           const trimmed = value.trim();
//           const nameRegex = /^[A-Za-z\s]+$/;
//           if (!nameRegex.test(trimmed)) {
//             return "Manager name can only contain letters and spaces";
//           }
//           if (trimmed.length > 100) {
//             return "Manager name cannot exceed 100 characters";
//           }
//         }
//         return "";

//       case "manager_contact":
//         if (value) {
//           const phoneRegex = /^[0-9]+$/;
//           if (!phoneRegex.test(value))
//             return "Please enter a valid phone number (digits only)";
          
//           const requiredDigits = getCurrentCountryDigits();
//           if (value.length !== requiredDigits) {
//             return `Phone number must be exactly ${requiredDigits} digits for ${selectedCountry?.country || 'this country'}`;
//           }
//         }
//         return "";

//       case "total_units":
//         if (value && parseInt(value) < 0)
//           return "Total units cannot be negative";
//         return "";

//       case "description":
//         if (value && value.length > 500)
//           return "Description cannot exceed 500 characters";
//         return "";

//       default:
//         return "";
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setForm({
//       ...form,
//       [field]: value,
//     });

//     const error = validateField(field, value);
//     setErrors({
//       ...errors,
//       [field]: error,
//     });
//   };

//   const handleCountryChange = (code) => {
//     setForm({
//       ...form,
//       country_code: code,
//       manager_contact: "",
//     });
    
//     setErrors({
//       ...errors,
//       country_code: "",
//       manager_contact: "",
//     });
    
//     setCountryDropdownOpen(false);
//     setCountrySearch("");
//   };

//   const handlePhoneChange = (value) => {
//     const requiredDigits = getCurrentCountryDigits();
//     const digitsOnly = value.replace(/\D/g, "");
//     // Don't truncate if empty
//     const truncated = value ? digitsOnly.slice(0, requiredDigits) : "";
//     handleInputChange("manager_contact", truncated);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error("Validation Error", "Please fix the errors in the form before submitting.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Generate a property code
//       const generatePropertyCode = () => {
//         const date = new Date();
//         const dateStr = date.toISOString().slice(0,10).replace(/-/g, '');
//         const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//         return `PROP-${dateStr}-${randomNum}`;
//       };

//       // Get the country name from the selected country code (not sending to DB)
//       const selectedCountryName = selectedCountry?.country || 'UAE';
      
//       // Get user ID
//       const userId = getCurrentUserId();
//       if (!userId) {
//         throw new Error("User ID not found. Please log in again.");
//       }

//       // Prepare JSON data matching the database function parameters
//       // All fields included except 'country' (as requested)
//       const jsonData = {
//         property_code: generatePropertyCode(),
//         property_name: form.property_name.trim(),
//         community_id: parseInt(form.community_id),
//         address_line1: form.address1.trim(),
//         address_line2: form.address2?.trim() || '',
//         city: form.city.trim(),
//         manager_name: form.manager_name?.trim() || '',
//         manager_contact: form.manager_contact ? `${form.country_code}${form.manager_contact}` : '',
//         total_units: form.total_units ? parseInt(form.total_units) : 0,
//         property_description: form.description?.trim() || '',
//         created_by: userId
//       };

//       // Create FormData
//       const formData = new FormData();
      
//       // Append the JSON data as a string
//       formData.append('data', JSON.stringify(jsonData));
      
//       // Append file if selected
//       if (file) {
//         formData.append('property_image', file);
//       }

//       // Log for debugging
//       console.log("Sending data:", jsonData);

//       // Make API call
//       const response = await fetch(`${baseURL}/api/properties`, {
//         method: 'POST',
//         body: formData,
//       });

//       // Check if response is OK
//       if (!response.ok) {
//         let errorText;
//         try {
//           errorText = await response.text();
//           const errorData = JSON.parse(errorText);
//           throw new Error(errorData.message || `Server error: ${response.status}`);
//         } catch {
//           throw new Error(`Server responded with status ${response.status}: ${errorText || 'Unknown error'}`);
//         }
//       }

//       const data = await response.json();
//       console.log("Server response:", data);

//       // Check the response format
//       if (data.success || (data.id && data.message)) {
//         toast.success("Success", "Property added successfully!");
//         if (onSuccess) onSuccess(data);
//         if (onClose) onClose();
//       } else {
//         throw new Error(data.error || data.message || "Failed to create property");
//       }
//     } catch (error) {
//       console.error("Error creating property:", error);
//       toast.error("Error", error.message || "Failed to create property. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasErrors = () => {
//     return Object.values(errors).some((error) => error !== "");
//   };

//   const isFormValid = () => {
//     return form.community_id !== "" &&
//       form.property_name.trim() !== "" &&
//       form.address1.trim() !== "" &&
//       form.city.trim() !== "" &&
//       form.country_code !== "" &&
//       !hasErrors();
//   };

//   // Get current country's digit requirement for display
//   const requiredDigits = getCurrentCountryDigits();

//   return (
//     <div
//       className="flex flex-col h-full rounded-lg"
//       style={{ backgroundColor: themeUtils.getBgColor("default") }}
//     >
//       {/* Scrollable Content Area */}
//       <div className="flex-1 overflow-y-auto p-2">
//         <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
//           {/* Left Column: Image Upload */}
//           <div className="lg:col-span-1 flex items-center lg:mb-45 justify-center">
//             <div
//               className="p-5 rounded-lg border"
//               style={{
//                 backgroundColor: themeUtils.getBgColor("input"),
//                 borderColor: themeUtils.getBorderColor(),
//               }}
//             >
//               <h3
//                 className="text-sm font-medium mb-3"
//                 style={{ color: themeUtils.getTextColor(true) }}
//               >
//                 Property Image
//               </h3>

//               {/* Image Preview or Upload Area */}
//               {previewUrl ? (
//                 <div className="relative">
//                   <img
//                     src={previewUrl}
//                     alt="Property Preview"
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                   <button
//                     onClick={handleRemoveImage}
//                     className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                     type="button"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ) : (
//                 <div
//                   className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
//                   style={{
//                     borderColor: themeUtils.getBorderColor(),
//                     backgroundColor: themeUtils.getBgColor("hover"),
//                   }}
//                   onClick={() => document.getElementById('property-image')?.click()}
//                 >
//                   <Upload
//                     size={32}
//                     className="mx-auto mb-2"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   />
//                   <p
//                     className="text-sm font-medium mb-1"
//                     style={{ color: themeUtils.getTextColor(true) }}
//                   >
//                     Click to upload
//                   </p>
//                   <p
//                     className="text-xs"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     PNG, JPG, WEBP (Max 5MB)
//                   </p>
//                 </div>
//               )}

//               <input
//                 id="property-image"
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png,image/webp"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//           </div>

//           {/* Right Column: Form Fields */}
//           <div className="lg:col-span-2 space-y-2">
//             {/* Row 1: Community and Property Name */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {/* Community */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Community *
//                   </label>
//                 </div>
//                 <select
//                   value={form.community_id}
//                   onChange={(e) =>
//                     handleInputChange("community_id", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all appearance-none ${
//                     errors.community_id
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.community_id
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   disabled={loading || loadingCommunities}
//                 >
//                   <option value="">Select Community</option>
//                   {communities.map((c) => (
//                     <option key={c.community_id} value={c.community_id}>
//                       {c.community_name}
//                     </option>
//                   ))}
//                 </select>
//                 {loadingCommunities && (
//                   <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
//                     Loading communities...
//                   </p>
//                 )}
//                 {errors.community_id && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.community_id}
//                   </p>
//                 )}
//               </div>

//               {/* Property Name */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Property Name *
//                   </label>
//                   <span
//                     className="text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     {form.property_name.length}/150
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={form.property_name}
//                   onChange={(e) =>
//                     handleInputChange("property_name", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.property_name
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.property_name
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="e.g. Palm Tower"
//                   maxLength={150}
//                 />
//                 {errors.property_name && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.property_name}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Row 2: Address 1 and Address 2 */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {/* Address 1 */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Address 1 *
//                   </label>
//                   <span
//                     className="text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     {form.address1.length}/200
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={form.address1}
//                   onChange={(e) =>
//                     handleInputChange("address1", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.address1
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.address1
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="Street address, P.O. Box"
//                   maxLength={200}
//                 />
//                 {errors.address1 && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.address1}
//                   </p>
//                 )}
//               </div>

//               {/* Address 2 */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Address 2
//                   </label>
//                   <span
//                     className="text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     {form.address2.length}/200
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={form.address2}
//                   onChange={(e) =>
//                     handleInputChange("address2", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.address2
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.address2
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="Apartment, suite, unit, building, floor, etc."
//                   maxLength={200}
//                 />
//                 {errors.address2 && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.address2}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Row 3: City and Total Units */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {/* City */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     City *
//                   </label>
//                   <span
//                     className="text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     {form.city.length}/100
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={form.city}
//                   onChange={(e) =>
//                     handleInputChange("city", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.city
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.city
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="e.g. Dubai"
//                   maxLength={100}
//                 />
//                 {errors.city && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.city}
//                   </p>
//                 )}
//               </div>
 
//               {/* Total Units */}
//               <div>
//                 <label
//                   className="block text-sm font-medium mb-1"
//                   style={{ color: themeUtils.getTextColor(false) }}
//                 >
//                   Total Units
//                 </label>
//                 <input
//                   type="number"
//                   value={form.total_units}
//                   onChange={(e) =>
//                     handleInputChange("total_units", e.target.value)
//                   }
//                   min="0"
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.total_units
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.total_units
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="0"
//                 />
//                 {errors.total_units && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.total_units}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <label
//                   className="block text-sm font-medium"
//                   style={{ color: themeUtils.getTextColor(false) }}
//                 >
//                   Property Description
//                 </label>
//                 <span
//                   className="text-[10px]"
//                   style={{ color: themeUtils.getTextColor(false, true) }}
//                 >
//                   {form.description.length}/500
//                 </span>
//               </div>
//               <textarea
//                 rows={2}
//                 value={form.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none placeholder:text-gray-400 ${
//                   errors.description
//                     ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                     : ""
//                 }`}
//                 style={{
//                   backgroundColor: themeUtils.getBgColor("input"),
//                   borderColor: errors.description
//                     ? "#ef4444"
//                     : themeUtils.getBorderColor(),
//                   color: themeUtils.getTextColor(true),
//                 }}
//                 placeholder="Brief description of the property..."
//                 maxLength={500}
//               />
//               {errors.description && (
//                 <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                   <span>⚠</span> {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* Manager Details */}
//             <div className="pt-1">
//               <h3
//                 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider"
//                 style={{ color: themeUtils.getTextColor(true) }}
//               >
//                 Manager Details (Optional)
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <div>
//                   <label
//                     className="block text-sm font-medium mb-1"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={form.manager_name}
//                     onChange={(e) =>
//                       handleInputChange("manager_name", e.target.value)
//                     }
//                     className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                       errors.manager_name
//                         ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                         : ""
//                     }`}
//                     style={{
//                       backgroundColor: themeUtils.getBgColor("input"),
//                       borderColor: errors.manager_name
//                         ? "#ef4444"
//                         : themeUtils.getBorderColor(),
//                       color: themeUtils.getTextColor(true),
//                     }}
//                     placeholder="Manager Name"
//                     maxLength={100}
//                   />
//                   {errors.manager_name && (
//                     <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                       <span>⚠</span> {errors.manager_name}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     className="block text-sm font-medium mb-1"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Contact Number
//                   </label>
//                   <div className="relative">
//                     <div className="flex gap-1">
//                       {/* Custom Country Code Dropdown */}
//                       <div className="relative w-20">
//                         <button
//                           type="button"
//                           onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
//                           className={`w-full px-2 py-1.5 text-sm rounded-lg border flex items-center justify-between ${
//                             errors.country_code
//                               ? "border-red-500"
//                               : ""
//                           }`}
//                           style={{
//                             backgroundColor: themeUtils.getBgColor("input"),
//                             borderColor: errors.country_code
//                               ? "#ef4444"
//                               : themeUtils.getBorderColor(),
//                             color: themeUtils.getTextColor(true),
//                           }}
//                         >
//                           <span className="truncate">
//                             {selectedCountry ? selectedCountry.code : "+971"}
//                           </span>
//                           <ChevronDown size={14} className={`transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
//                         </button>

//                         {/* Dropdown Menu */}
//                         {countryDropdownOpen && (
//                           <div
//                             className="absolute z-50 mt-1 w-72 rounded-lg border shadow-lg"
//                             style={{
//                               backgroundColor: themeUtils.getBgColor("default"),
//                               borderColor: themeUtils.getBorderColor(),
//                             }}
//                           >
//                             {/* Search Input */}
//                             <div className="p-2 border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
//                               <div className="relative">
//                                 <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: themeUtils.getTextColor(false, true) }} />
//                                 <input
//                                   type="text"
//                                   value={countrySearch}
//                                   onChange={(e) => setCountrySearch(e.target.value)}
//                                   placeholder="Search country..."
//                                   className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border"
//                                   style={{
//                                     backgroundColor: themeUtils.getBgColor("input"),
//                                     borderColor: themeUtils.getBorderColor(),
//                                     color: themeUtils.getTextColor(true),
//                                   }}
//                                   autoFocus
//                                 />
//                               </div>
//                             </div>

//                             {/* Country List */}
//                             <div className="max-h-60 overflow-y-auto">
//                               {filteredCountries.length > 0 ? (
//                                 filteredCountries.map((country) => (
//                                   <button
//                                     key={country.code}
//                                     type="button"
//                                     className="w-full px-3 py-2 text-left hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex items-center justify-between"
//                                     style={{
//                                       backgroundColor: form.country_code === country.code ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
//                                       color: themeUtils.getTextColor(true),
//                                     }}
//                                     onClick={() => handleCountryChange(country.code)}
//                                   >
//                                     <span>
//                                       <span className="font-medium mr-2">{country.code}</span>
//                                       <span className="text-xs opacity-70">{country.country}</span>
//                                       <span className="text-[10px] ml-2 opacity-50">({country.digits} digits)</span>
//                                     </span>
//                                     {form.country_code === country.code && (
//                                       <span className="text-blue-500">✓</span>
//                                     )}
//                                   </button>
//                                 ))
//                               ) : (
//                                 <div className="px-3 py-4 text-center text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
//                                   No countries found
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Phone Number Input */}
//                       <input
//                         type="tel"
//                         value={form.manager_contact}
//                         onChange={(e) => handlePhoneChange(e.target.value)}
//                         className={`flex-1 px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                           errors.manager_contact
//                             ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                             : ""
//                         }`}
//                         style={{
//                           backgroundColor: themeUtils.getBgColor("input"),
//                           borderColor: errors.manager_contact
//                             ? "#ef4444"
//                             : themeUtils.getBorderColor(),
//                           color: themeUtils.getTextColor(true),
//                         }}
//                         placeholder={`${requiredDigits} digits`}
//                         maxLength={requiredDigits}
//                       />
//                     </div>
//                   </div>
//                   {errors.manager_contact && (
//                     <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                       <span>⚠</span> {errors.manager_contact}
//                     </p>
//                   )}
//                   {errors.country_code && (
//                     <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                       <span>⚠</span> {errors.country_code}
//                     </p>
//                   )}
//                   <p
//                     className="mt-0.5 text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     Enter {requiredDigits} digits for {selectedCountry?.country || 'UAE'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Community Info */}
//             {selectedCommunity && (
//               <div
//                 className="mt-2 p-3 rounded-lg border text-sm"
//                 style={{
//                   borderColor: themeUtils.getBorderColor(),
//                   backgroundColor: themeUtils.getBgColor("input"),
//                 }}
//               >
//                 <h5 className="font-semibold mb-2" style={{ color: themeUtils.getTextColor(true) }}>
//                   Community Information
//                 </h5>
//                 <div className="grid grid-cols-2 gap-2 text-xs">
//                   <div>
//                     <span className="opacity-70">Location:</span>
//                     <p style={{ color: themeUtils.getTextColor(true) }}>
//                       {selectedCommunity.location || selectedCommunity.address_line1 || '-'}
//                     </p>
//                   </div>
//                   <div>
//                     <span className="opacity-70">City:</span>
//                     <p style={{ color: themeUtils.getTextColor(true) }}>
//                       {selectedCommunity.city || '-'}
//                     </p>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Country:</span>
//                     <p style={{ color: themeUtils.getTextColor(true) }}>
//                       {selectedCommunity.country || '-'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div
//         className="flex items-center justify-between gap-3 p-3 border-t"
//         style={{ borderColor: themeUtils.getBorderColor() }}
//       >
//         <div
//           className="text-[10px]"
//           style={{ color: themeUtils.getTextColor(false, true) }}
//         >
//           * Required fields
//           {hasErrors() && (
//             <span className="ml-2 text-red-500">
//               {Object.values(errors).filter((e) => e).length} error(s)
//             </span>
//           )}
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="secondary"
//             onClick={onClose}
//             disabled={loading}
//             themeUtils={themeUtils}
//             size="sm"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleSubmit}
//             loading={loading}
//             disabled={loading || !isFormValid()}
//             themeUtils={themeUtils}
//             size="sm"
//             className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
//           >
//             {loading ? "Creating..." : "Submit"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProperty;



//updated code

import React, { useState, useEffect } from "react";
import { Upload, X, ChevronDown, Search } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import { API_URL_PROPERTY, API_URL_COMMUNITY } from "../../../../../config";

const AddProperty = ({ onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [form, setForm] = useState({
    community_id: "",
    property_name: "",
    address1: "",
    address2: "",
    city: "",
    country_code: "+971",
    manager_name: "",
    manager_contact: "",
    total_units: "",
    description: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    community_id: "",
    property_name: "",
    address1: "",
    address2: "",
    city: "",
    country_code: "",
    manager_name: "",
    manager_contact: "",
    total_units: "",
    description: "",
  });

  // Country codes with digit validation rules
  const countryCodes = [
    { code: "+971", country: "UAE", digits: 9, search: "uae united arab emirates" },
    { code: "+966", country: "Saudi Arabia", digits: 9, search: "saudi arabia ksa" },
    { code: "+965", country: "Kuwait", digits: 8, search: "kuwait" },
    { code: "+974", country: "Qatar", digits: 8, search: "qatar" },
    { code: "+973", country: "Bahrain", digits: 8, search: "bahrain" },
    { code: "+968", country: "Oman", digits: 8, search: "oman" },
    { code: "+20", country: "Egypt", digits: 10, search: "egypt" },
    { code: "+962", country: "Jordan", digits: 9, search: "jordan" },
    { code: "+961", country: "Lebanon", digits: 8, search: "lebanon" },
    { code: "+967", country: "Yemen", digits: 9, search: "yemen" },
    { code: "+964", country: "Iraq", digits: 10, search: "iraq" },
    { code: "+963", country: "Syria", digits: 9, search: "syria" },
    { code: "+92", country: "Pakistan", digits: 10, search: "pakistan pak" },
    { code: "+94", country: "Sri Lanka", digits: 9, search: "sri lanka" },
    { code: "+880", country: "Bangladesh", digits: 10, search: "bangladesh" },
    { code: "+60", country: "Malaysia", digits: 9, search: "malaysia" },
    { code: "+65", country: "Singapore", digits: 8, search: "singapore" },
    { code: "+62", country: "Indonesia", digits: 10, search: "indonesia" },
    { code: "+63", country: "Philippines", digits: 10, search: "philippines" },
    { code: "+66", country: "Thailand", digits: 9, search: "thailand" },
    { code: "+84", country: "Vietnam", digits: 9, search: "vietnam" },
    { code: "+44", country: "United Kingdom", digits: 10, search: "uk united kingdom britain england" },
    { code: "+1", country: "USA/Canada", digits: 10, search: "usa united states america canada" },
    { code: "+33", country: "France", digits: 9, search: "france" },
    { code: "+49", country: "Germany", digits: 10, search: "germany" },
    { code: "+39", country: "Italy", digits: 10, search: "italy" },
    { code: "+34", country: "Spain", digits: 9, search: "spain" },
    { code: "+31", country: "Netherlands", digits: 9, search: "netherlands holland" },
    { code: "+32", country: "Belgium", digits: 8, search: "belgium" },
    { code: "+41", country: "Switzerland", digits: 9, search: "switzerland" },
    { code: "+43", country: "Austria", digits: 10, search: "austria" },
    { code: "+46", country: "Sweden", digits: 9, search: "sweden" },
    { code: "+47", country: "Norway", digits: 8, search: "norway" },
    { code: "+45", country: "Denmark", digits: 8, search: "denmark" },
    { code: "+358", country: "Finland", digits: 9, search: "finland" },
    { code: "+353", country: "Ireland", digits: 9, search: "ireland" },
    { code: "+351", country: "Portugal", digits: 9, search: "portugal" },
    { code: "+30", country: "Greece", digits: 10, search: "greece" },
    { code: "+90", country: "Turkey", digits: 10, search: "turkey" },
    { code: "+7", country: "Russia", digits: 10, search: "russia" },
    { code: "+380", country: "Ukraine", digits: 9, search: "ukraine" },
    { code: "+48", country: "Poland", digits: 9, search: "poland" },
    { code: "+420", country: "Czech Republic", digits: 9, search: "czech republic" },
    { code: "+36", country: "Hungary", digits: 9, search: "hungary" },
    { code: "+40", country: "Romania", digits: 9, search: "romania" },
    { code: "+359", country: "Bulgaria", digits: 9, search: "bulgaria" },
    { code: "+381", country: "Serbia", digits: 9, search: "serbia" },
    { code: "+385", country: "Croatia", digits: 9, search: "croatia" },
    { code: "+86", country: "China", digits: 11, search: "china" },
    { code: "+852", country: "Hong Kong", digits: 8, search: "hong kong" },
    { code: "+853", country: "Macau", digits: 8, search: "macau" },
    { code: "+886", country: "Taiwan", digits: 9, search: "taiwan" },
    { code: "+81", country: "Japan", digits: 10, search: "japan" },
    { code: "+82", country: "South Korea", digits: 10, search: "south korea korea" },
    { code: "+61", country: "Australia", digits: 9, search: "australia" },
    { code: "+64", country: "New Zealand", digits: 9, search: "new zealand" },
    { code: "+27", country: "South Africa", digits: 9, search: "south africa" },
    { code: "+234", country: "Nigeria", digits: 10, search: "nigeria" },
    { code: "+254", country: "Kenya", digits: 9, search: "kenya" },
    { code: "+212", country: "Morocco", digits: 9, search: "morocco" },
    { code: "+216", country: "Tunisia", digits: 8, search: "tunisia" },
    { code: "+213", country: "Algeria", digits: 9, search: "algeria" },
  ];

  // Base URL for API
  const baseURL = API_URL_PROPERTY || "http://localhost:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://localhost:5000";

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user.user_id || null;
      }
    } catch (e) {
      console.error("Error getting user ID:", e);
    }
    console.warn("No user ID found in localStorage");
    return null;
  };

  // Get current country's digit requirement
  const getCurrentCountryDigits = () => {
    const country = countryCodes.find(c => c.code === form.country_code);
    return country ? country.digits : 10;
  };

  // Filter countries based on search
  const filteredCountries = countrySearch
    ? countryCodes.filter(
        (c) =>
          c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch) ||
          c.search?.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : countryCodes;

  // Get selected country display
  const selectedCountry = countryCodes.find((c) => c.code === form.country_code);

  // Get selected community
  const selectedCommunity = communities.find(
    (c) => c.community_id === parseInt(form.community_id)
  );

  // Fetch communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const response = await fetch(`${communityBaseURL}/api/communities`);
        const result = await response.json();

        if (response.ok) {
          const communityList = Array.isArray(result) ? result : result.data || [];
          setCommunities(communityList);
        } else {
          toast.error("Error", result.message || "Failed to load communities");
        }
      } catch (error) {
        toast.error("Error", "Failed to load communities.");
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, [communityBaseURL, toast]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid File Type", "Please select a valid image file (JPEG, PNG, or WEBP)");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", "Image size should be less than 5MB");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('property-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validation rules
  const validateForm = () => {
    const newErrors = {
      community_id: "",
      property_name: "",
      address1: "",
      address2: "",
      city: "",
      country_code: "",
      manager_name: "",
      manager_contact: "",
      total_units: "",
      description: "",
    };
    let isValid = true;

    // Community validation
    if (!form.community_id) {
      newErrors.community_id = "Community is required";
      isValid = false;
    }

    // Property Name validation
    if (!form.property_name.trim()) {
      newErrors.property_name = "Property name is required";
      isValid = false;
    } else if (form.property_name.length < 3) {
      newErrors.property_name = "Property name must be at least 3 characters";
      isValid = false;
    } else if (form.property_name.length > 150) {
      newErrors.property_name = "Property name cannot exceed 150 characters";
      isValid = false;
    }

    // Address 1 validation
    if (!form.address1.trim()) {
      newErrors.address1 = "Address is required";
      isValid = false;
    } else if (form.address1.length > 200) {
      newErrors.address1 = "Address cannot exceed 200 characters";
      isValid = false;
    }

    // Address 2 validation
    if (form.address2 && form.address2.length > 200) {
      newErrors.address2 = "Address cannot exceed 200 characters";
      isValid = false;
    }

    // City validation
    if (!form.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    } else if (form.city.length > 100) {
      newErrors.city = "City cannot exceed 100 characters";
      isValid = false;
    }

    // Country code validation
    if (!form.country_code) {
      newErrors.country_code = "Country code is required";
      isValid = false;
    }

    // Manager name validation
    if (form.manager_name) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(form.manager_name.trim())) {
        newErrors.manager_name = "Manager name can only contain letters and spaces";
        isValid = false;
      } else if (form.manager_name.trim().length > 100) {
        newErrors.manager_name = "Manager name cannot exceed 100 characters";
        isValid = false;
      }
    }

    // Manager Contact validation
    if (form.manager_contact) {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(form.manager_contact)) {
        newErrors.manager_contact = "Please enter a valid phone number (digits only)";
        isValid = false;
      } else {
        const requiredDigits = getCurrentCountryDigits();
        if (form.manager_contact.length !== requiredDigits) {
          newErrors.manager_contact = `Phone number must be exactly ${requiredDigits} digits for ${selectedCountry?.country || 'this country'}`;
          isValid = false;
        }
      }
    }

    // Total Units validation
    if (form.total_units && parseInt(form.total_units) < 0) {
      newErrors.total_units = "Total units cannot be negative";
      isValid = false;
    }

    // Description validation
    if (form.description && form.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "community_id":
        if (!value) return "Community is required";
        return "";

      case "property_name":
        if (!value.trim()) return "Property name is required";
        if (value.length < 3) return "Property name must be at least 3 characters";
        if (value.length > 150) return "Property name cannot exceed 150 characters";
        return "";

      case "address1":
        if (!value.trim()) return "Address is required";
        if (value.length > 200) return "Address cannot exceed 200 characters";
        return "";

      case "address2":
        if (value && value.length > 200) return "Address cannot exceed 200 characters";
        return "";

      case "city":
        if (!value.trim()) return "City is required";
        if (value.length > 100) return "City cannot exceed 100 characters";
        return "";

      case "country_code":
        if (!value) return "Country code is required";
        return "";

      case "manager_name":
        if (value) {
          const trimmed = value.trim();
          const nameRegex = /^[A-Za-z\s]+$/;
          if (!nameRegex.test(trimmed)) {
            return "Manager name can only contain letters and spaces";
          }
          if (trimmed.length > 100) {
            return "Manager name cannot exceed 100 characters";
          }
        }
        return "";

      case "manager_contact":
        if (value) {
          const phoneRegex = /^[0-9]+$/;
          if (!phoneRegex.test(value))
            return "Please enter a valid phone number (digits only)";
          
          const requiredDigits = getCurrentCountryDigits();
          if (value.length !== requiredDigits) {
            return `Phone number must be exactly ${requiredDigits} digits for ${selectedCountry?.country || 'this country'}`;
          }
        }
        return "";

      case "total_units":
        if (value && parseInt(value) < 0)
          return "Total units cannot be negative";
        return "";

      case "description":
        if (value && value.length > 500)
          return "Description cannot exceed 500 characters";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    const error = validateField(field, value);
    setErrors({
      ...errors,
      [field]: error,
    });
  };

  const handleCountryChange = (code) => {
    setForm({
      ...form,
      country_code: code,
      manager_contact: "",
    });
    
    setErrors({
      ...errors,
      country_code: "",
      manager_contact: "",
    });
    
    setCountryDropdownOpen(false);
    setCountrySearch("");
  };

  const handlePhoneChange = (value) => {
    const requiredDigits = getCurrentCountryDigits();
    const digitsOnly = value.replace(/\D/g, "");
    const truncated = value ? digitsOnly.slice(0, requiredDigits) : "";
    handleInputChange("manager_contact", truncated);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Validation Error", "Please fix the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Get user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Prepare JSON data matching the database function parameters
      // (property_code is NOT sent because your function generates it automatically)
      const jsonData = {
        property_name: form.property_name.trim(),
        community_id: parseInt(form.community_id),
        address_line1: form.address1.trim(),
        address_line2: form.address2?.trim() || '',
        city: form.city.trim(),
        manager_name: form.manager_name?.trim() || '',
        manager_contact: form.manager_contact ? `${form.country_code}${form.manager_contact}` : '',
        total_units: form.total_units ? parseInt(form.total_units) : 0,
        property_description: form.description?.trim() || '',
        created_by: userId
      };

      // Create FormData
      const formData = new FormData();
      
      // Append the JSON data as a string
      formData.append('data', JSON.stringify(jsonData));
      
      // Append file if selected
      if (file) {
        formData.append('property_image', file);
      }

      // Log for debugging
      console.log("Sending data:", jsonData);

      // Make API call
      const response = await fetch(`${baseURL}/api/properties`, {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Server responded with status ${response.status}: ${errorText || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log("Server response:", data);

      // Check the response format (matches your function exactly)
      if (data.success === true) {
        toast.success("Success", "Property added successfully!");
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      } else {
        throw new Error(data.error || data.message || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Error", error.message || "Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const isFormValid = () => {
    return form.community_id !== "" &&
      form.property_name.trim() !== "" &&
      form.address1.trim() !== "" &&
      form.city.trim() !== "" &&
      form.country_code !== "" &&
      !hasErrors();
  };

  // Get current country's digit requirement for display
  const requiredDigits = getCurrentCountryDigits();

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
          {/* Left Column: Image Upload */}
          <div className="lg:col-span-1 flex items-center lg:mb-45 justify-center">
            <div
              className="p-5 rounded-lg border"
              style={{
                backgroundColor: themeUtils.getBgColor("input"),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Property Image
              </h3>

              {/* Image Preview or Upload Area */}
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Property Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  style={{
                    borderColor: themeUtils.getBorderColor(),
                    backgroundColor: themeUtils.getBgColor("hover"),
                  }}
                  onClick={() => document.getElementById('property-image')?.click()}
                >
                  <Upload
                    size={32}
                    className="mx-auto mb-2"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  />
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    Click to upload
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                </div>
              )}

              <input
                id="property-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-2">
            {/* Row 1: Community and Property Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Community */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Community *
                  </label>
                </div>
                <select
                  value={form.community_id}
                  onChange={(e) =>
                    handleInputChange("community_id", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all appearance-none ${
                    errors.community_id
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.community_id
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  disabled={loading || loadingCommunities}
                >
                  <option value="">Select Community</option>
                  {communities.map((c) => (
                    <option key={c.community_id} value={c.community_id}>
                      {c.community_name}
                    </option>
                  ))}
                </select>
                {loadingCommunities && (
                  <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                    Loading communities...
                  </p>
                )}
                {errors.community_id && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.community_id}
                  </p>
                )}
              </div>

              {/* Property Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Property Name *
                  </label>
                  <span
                    className="text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.property_name.length}/150
                  </span>
                </div>
                <input
                  type="text"
                  value={form.property_name}
                  onChange={(e) =>
                    handleInputChange("property_name", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.property_name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.property_name
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. Palm Tower"
                  maxLength={150}
                />
                {errors.property_name && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.property_name}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Address 1 and Address 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Address 1 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Address 1 *
                  </label>
                  <span
                    className="text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.address1.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  value={form.address1}
                  onChange={(e) =>
                    handleInputChange("address1", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.address1
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.address1
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="Street address, P.O. Box"
                  maxLength={200}
                />
                {errors.address1 && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.address1}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Address 2
                  </label>
                  <span
                    className="text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.address2.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  value={form.address2}
                  onChange={(e) =>
                    handleInputChange("address2", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.address2
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.address2
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  maxLength={200}
                />
                {errors.address2 && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.address2}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: City and Total Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* City */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    City *
                  </label>
                  <span
                    className="text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.city.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    handleInputChange("city", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.city
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.city
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. Dubai"
                  maxLength={100}
                />
                {errors.city && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.city}
                  </p>
                )}
              </div>
 
              {/* Total Units */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Total Units
                </label>
                <input
                  type="number"
                  value={form.total_units}
                  onChange={(e) =>
                    handleInputChange("total_units", e.target.value)
                  }
                  min="0"
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.total_units
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.total_units
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="0"
                />
                {errors.total_units && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.total_units}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  className="block text-sm font-medium"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Property Description
                </label>
                <span
                  className="text-[10px]"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  {form.description.length}/500
                </span>
              </div>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none placeholder:text-gray-400 ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: errors.description
                    ? "#ef4444"
                    : themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                placeholder="Brief description of the property..."
                maxLength={500}
              />
              {errors.description && (
                <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.description}
                </p>
              )}
            </div>

            {/* Manager Details */}
            <div className="pt-1">
              <h3
                className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Manager Details (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.manager_name}
                    onChange={(e) =>
                      handleInputChange("manager_name", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                      errors.manager_name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.manager_name
                        ? "#ef4444"
                        : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Manager Name"
                    maxLength={100}
                  />
                  {errors.manager_name && (
                    <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.manager_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="flex gap-1">
                      {/* Custom Country Code Dropdown */}
                      <div className="relative w-20">
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className={`w-full px-2 py-1.5 text-sm rounded-lg border flex items-center justify-between ${
                            errors.country_code
                              ? "border-red-500"
                              : ""
                          }`}
                          style={{
                            backgroundColor: themeUtils.getBgColor("input"),
                            borderColor: errors.country_code
                              ? "#ef4444"
                              : themeUtils.getBorderColor(),
                            color: themeUtils.getTextColor(true),
                          }}
                        >
                          <span className="truncate">
                            {selectedCountry ? selectedCountry.code : "+971"}
                          </span>
                          <ChevronDown size={14} className={`transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {countryDropdownOpen && (
                          <div
                            className="absolute z-50 mt-1 w-72 rounded-lg border shadow-lg"
                            style={{
                              backgroundColor: themeUtils.getBgColor("default"),
                              borderColor: themeUtils.getBorderColor(),
                            }}
                          >
                            {/* Search Input */}
                            <div className="p-2 border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
                              <div className="relative">
                                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: themeUtils.getTextColor(false, true) }} />
                                <input
                                  type="text"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  placeholder="Search country..."
                                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border"
                                  style={{
                                    backgroundColor: themeUtils.getBgColor("input"),
                                    borderColor: themeUtils.getBorderColor(),
                                    color: themeUtils.getTextColor(true),
                                  }}
                                  autoFocus
                                />
                              </div>
                            </div>

                            {/* Country List */}
                            <div className="max-h-60 overflow-y-auto">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    className="w-full px-3 py-2 text-left hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex items-center justify-between"
                                    style={{
                                      backgroundColor: form.country_code === country.code ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                      color: themeUtils.getTextColor(true),
                                    }}
                                    onClick={() => handleCountryChange(country.code)}
                                  >
                                    <span>
                                      <span className="font-medium mr-2">{country.code}</span>
                                      <span className="text-xs opacity-70">{country.country}</span>
                                      <span className="text-[10px] ml-2 opacity-50">({country.digits} digits)</span>
                                    </span>
                                    {form.country_code === country.code && (
                                      <span className="text-blue-500">✓</span>
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-4 text-center text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                                  No countries found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        value={form.manager_contact}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`flex-1 px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                          errors.manager_contact
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: errors.manager_contact
                            ? "#ef4444"
                            : themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                        placeholder={`${requiredDigits} digits`}
                        maxLength={requiredDigits}
                      />
                    </div>
                  </div>
                  {errors.manager_contact && (
                    <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.manager_contact}
                    </p>
                  )}
                  {errors.country_code && (
                    <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.country_code}
                    </p>
                  )}
                  <p
                    className="mt-0.5 text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    Enter {requiredDigits} digits for {selectedCountry?.country || 'UAE'}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Community Info */}
            {selectedCommunity && (
              <div
                className="mt-2 p-3 rounded-lg border text-sm"
                style={{
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("input"),
                }}
              >
                <h5 className="font-semibold mb-2" style={{ color: themeUtils.getTextColor(true) }}>
                  Community Information
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="opacity-70">Location:</span>
                    <p style={{ color: themeUtils.getTextColor(true) }}>
                      {selectedCommunity.location || selectedCommunity.address_line1 || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="opacity-70">City:</span>
                    <p style={{ color: themeUtils.getTextColor(true) }}>
                      {selectedCommunity.city || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="opacity-70">Country:</span>
                    <p style={{ color: themeUtils.getTextColor(true) }}>
                      {selectedCommunity.country || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-3 p-3 border-t"
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        <div
          className="text-[10px]"
          style={{ color: themeUtils.getTextColor(false, true) }}
        >
          * Required fields
          {hasErrors() && (
            <span className="ml-2 text-red-500">
              {Object.values(errors).filter((e) => e).length} error(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            themeUtils={themeUtils}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !isFormValid()}
            themeUtils={themeUtils}
            size="sm"
            className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
          >
            {loading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;