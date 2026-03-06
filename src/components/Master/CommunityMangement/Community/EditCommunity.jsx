// import React, { useState, useEffect } from "react";
// import { Upload, X, ChevronDown, Search } from "lucide-react";
// import { useTheme } from "../../../../ui/Settings/themeUtils";
// import { useToast } from "../../../../ui/common/CostumeTost";
// import Button from "../../../../ui/Common/Button";
// import { API_URL_COMMUNITY } from "../../../../../config";

// const EditCommunity = ({ communityId, community, onClose, onSuccess }) => {
//   const { themeUtils } = useTheme();
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(!community);
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [existingImage, setExistingImage] = useState(null);
//   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
//   const [countrySearch, setCountrySearch] = useState("");
//   const [form, setForm] = useState({
//     community_name: "",
//     address1: "",
//     address2: "",
//     city: "",
//     country_code: "+971",
//     manager_name: "",
//     manager_contact: "",
//     total_properties: "",
//     total_units: "",
//     description: "",
//   });

//   // Validation errors state
//   const [errors, setErrors] = useState({
//     community_name: "",
//     address1: "",
//     address2: "",
//     city: "",
//     country_code: "",
//     manager_name: "",
//     manager_contact: "",
//     total_properties: "",
//     total_units: "",
//     description: "",
//   });

//   // Country codes with digit validation rules (same as AddCommunity)
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

//   // Base URL for API from config
//   const baseURL = API_URL_COMMUNITY || "http://192.168.1.68:5000";

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

//   // Initialize form with passed community data if available
//   useEffect(() => {
//     if (community) {
//       // Extract contact number without country code
//       let contactNumber = "";
//       let countryCode = "+971";
      
//       if (community.manager_contact) {
//         const contactStr = community.manager_contact.toString();
        
//         // Try to extract country code
//         const foundCountry = countryCodes.find(c => contactStr.startsWith(c.code.replace('+', '')) || contactStr.startsWith(c.code));
//         if (foundCountry) {
//           countryCode = foundCountry.code;
//           contactNumber = contactStr.replace(foundCountry.code.replace('+', ''), '').replace(foundCountry.code, '');
//         } else if (contactStr.startsWith("971")) {
//           countryCode = "+971";
//           contactNumber = contactStr.substring(3);
//         } else {
//           contactNumber = contactStr;
//         }
//       }

//       setForm({
//         community_name: community.community_name || "",
//         address1: community.address_line1 || "",
//         address2: community.address_line2 || "",
//         city: community.city || "",
//         country_code: countryCode,
//         manager_name: community.manager_name || "",
//         manager_contact: contactNumber,
//         total_properties: community.total_properties || "",
//         total_units: community.total_units || "",
//         description: community.community_description || "",
//       });

//       // Set existing image if available
//       if (community.profile_image) {
//         setExistingImage(`${baseURL}${community.profile_image}`);
//       }
      
//       setFetchLoading(false);
//     }
//   }, [community, baseURL]);

//   // Fetch community details from API only if no community data passed
//   useEffect(() => {
//     const fetchCommunity = async () => {
//       if (!communityId || community) return;
      
//       try {
//         setFetchLoading(true);
        
//         const response = await fetch(`${baseURL}/api/communities/${communityId}`);
        
//         if (!response.ok) {
//           throw new Error(`Server responded with status ${response.status}`);
//         }
        
//         const data = await response.json();
//         const communityData = data.data || data;

//         if (communityData) {
//           // Extract contact number without country code
//           let contactNumber = "";
//           let countryCode = "+971";
          
//           if (communityData.manager_contact) {
//             const contactStr = communityData.manager_contact.toString();
            
//             // Try to extract country code
//             const foundCountry = countryCodes.find(c => contactStr.startsWith(c.code.replace('+', '')) || contactStr.startsWith(c.code));
//             if (foundCountry) {
//               countryCode = foundCountry.code;
//               contactNumber = contactStr.replace(foundCountry.code.replace('+', ''), '').replace(foundCountry.code, '');
//             } else if (contactStr.startsWith("971")) {
//               countryCode = "+971";
//               contactNumber = contactStr.substring(3);
//             } else {
//               contactNumber = contactStr;
//             }
//           }

//           setForm({
//             community_name: communityData.community_name || "",
//             address1: communityData.address_line1 || "",
//             address2: communityData.address_line2 || "",
//             city: communityData.city || "",
//             country_code: countryCode,
//             manager_name: communityData.manager_name || "",
//             manager_contact: contactNumber,
//             total_properties: communityData.total_properties || "",
//             total_units: communityData.total_units || "",
//             description: communityData.community_description || "",
//           });

//           // Set existing image if available
//           if (communityData.profile_image) {
//             setExistingImage(`${baseURL}${communityData.profile_image}`);
//           }
//         } else {
//           throw new Error("Community not found");
//         }
//       } catch (error) {
//         console.error("Fetch community error:", error);
//         toast.error("Error", error.message || "Failed to load community details");
//         if (onClose) onClose();
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (communityId && !community) {
//       fetchCommunity();
//     }
//   }, [communityId, community, baseURL, toast, onClose]);

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
//     setExistingImage(null);
//     const fileInput = document.getElementById('community-image');
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   // Validation rules
//   const validateForm = () => {
//     const newErrors = {
//       community_name: "",
//       address1: "",
//       address2: "",
//       city: "",
//       country_code: "",
//       manager_name: "",
//       manager_contact: "",
//       total_properties: "",
//       total_units: "",
//       description: "",
//     };
//     let isValid = true;

//     if (!form.community_name.trim()) {
//       newErrors.community_name = "Community name is required";
//       isValid = false;
//     } else if (form.community_name.length < 3) {
//       newErrors.community_name = "Community name must be at least 3 characters";
//       isValid = false;
//     } else if (form.community_name.length > 150) {
//       newErrors.community_name = "Community name cannot exceed 150 characters";
//       isValid = false;
//     }

//     if (!form.address1.trim()) {
//       newErrors.address1 = "Address is required";
//       isValid = false;
//     } else if (form.address1.length > 200) {
//       newErrors.address1 = "Address cannot exceed 200 characters";
//       isValid = false;
//     }

//     if (form.address2 && form.address2.length > 200) {
//       newErrors.address2 = "Address cannot exceed 200 characters";
//       isValid = false;
//     }

//     if (!form.city.trim()) {
//       newErrors.city = "City is required";
//       isValid = false;
//     } else if (form.city.length > 100) {
//       newErrors.city = "City cannot exceed 100 characters";
//       isValid = false;
//     }

//     if (!form.country_code) {
//       newErrors.country_code = "Country code is required";
//       isValid = false;
//     }

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

//     if (form.total_properties && parseInt(form.total_properties) < 0) {
//       newErrors.total_properties = "Total properties cannot be negative";
//       isValid = false;
//     }

//     if (form.total_units && parseInt(form.total_units) < 0) {
//       newErrors.total_units = "Total units cannot be negative";
//       isValid = false;
//     }

//     if (form.description && form.description.length > 500) {
//       newErrors.description = "Description cannot exceed 500 characters";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case "community_name":
//         if (!value.trim()) return "Community name is required";
//         if (value.length < 3) return "Community name must be at least 3 characters";
//         if (value.length > 150) return "Community name cannot exceed 150 characters";
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

//       case "total_properties":
//         if (value && parseInt(value) < 0)
//           return "Total properties cannot be negative";
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
//     const truncated = digitsOnly.slice(0, requiredDigits);
//     handleInputChange("manager_contact", truncated);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error("Validation Error", "Please fix the errors in the form before submitting.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Get the country name from the selected country code
//       const selectedCountryName = selectedCountry?.country || 'UAE';
      
//       // Get user ID
//       const userId = getCurrentUserId();

//       // Create FormData and append each field individually (same as AddCommunity)
//       const formData = new FormData();
      
//       // Append all fields individually
//       formData.append('community_name', form.community_name.trim());
//       formData.append('address_line1', form.address1.trim());
//       formData.append('address_line2', form.address2?.trim() || '');
//       formData.append('city', form.city.trim());
//       formData.append('country', selectedCountryName);
//       formData.append('manager_name', form.manager_name?.trim() || '');
      
//       // Combine country code and phone number for manager_contact
//       const fullPhoneNumber = form.manager_contact ? `${form.country_code}${form.manager_contact}` : '';
//       formData.append('manager_contact', fullPhoneNumber);
      
//       formData.append('total_properties', form.total_properties || '0');
//       formData.append('total_units', form.total_units || '0');
//       formData.append('community_description', form.description?.trim() || '');
//       formData.append('updated_by', userId || '');
      
//       // Append file if selected
//       if (file) {
//         formData.append('profile_image', file);
//       }

//       // Log FormData contents for debugging
//       console.log("Updating community with FormData:");
//       for (let pair of formData.entries()) {
//         if (pair[0] === 'profile_image' && pair[1] instanceof File) {
//           console.log(pair[0] + ': File - ' + pair[1].name);
//         } else {
//           console.log(pair[0] + ': ' + pair[1]);
//         }
//       }

//       // Get the correct community ID
//       const communityIdToUpdate = communityId || community?.community_id;
      
//       if (!communityIdToUpdate) {
//         throw new Error("Community ID is missing");
//       }

//       // Make API call
//       const response = await fetch(`${baseURL}/api/communities/${communityIdToUpdate}`, {
//         method: 'PUT',
//         body: formData,
//       });

//       // Check if response is OK
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Server error response:", errorText);
//         throw new Error(`Server responded with status ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Server response:", data);

//       // Check the response format
//       if (data.success || (data.id && data.message)) {
//         toast.success("Success", "Community updated successfully!");
//         if (onSuccess) onSuccess(data);
//         if (onClose) onClose();
//       } else {
//         throw new Error(data.error || data.message || "Failed to update community");
//       }
//     } catch (error) {
//       console.error("Error updating community:", error);
//       toast.error("Error", error.message || "Failed to update community. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasErrors = () => {
//     return Object.values(errors).some((error) => error !== "");
//   };

//   const isFormValid = () => {
//     return form.community_name.trim() !== "" &&
//       form.address1.trim() !== "" &&
//       form.city.trim() !== "" &&
//       form.country_code !== "" &&
//       !hasErrors();
//   };

//   const requiredDigits = getCurrentCountryDigits();

//   if (fetchLoading) {
//     return (
//       <div
//         className="flex flex-col h-full rounded-lg items-center justify-center"
//         style={{ backgroundColor: themeUtils.getBgColor("default") }}
//       >
//         <div className="text-center p-8">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
//             style={{ borderColor: "#6366f1" }}
//           ></div>
//           <p className="mt-4" style={{ color: themeUtils.getTextColor(true) }}>
//             Loading community details...
//           </p>
//         </div>
//       </div>
//     );
//   }

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
//                 Community Profile Picture
//               </h3>

//               {/* Image Preview or Upload Area */}
//               {previewUrl || existingImage ? (
//                 <div className="relative">
//                   <img
//                     src={previewUrl || existingImage}
//                     alt="Community Preview"
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
//                   onClick={() => document.getElementById('community-image')?.click()}
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
//                 id="community-image"
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png,image/webp"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//           </div>

//           {/* Right Column: Form Fields */}
//           <div className="lg:col-span-2 space-y-2">
//             {/* Row 1: Community Name and City (2 columns) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {/* Community Name */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{ color: themeUtils.getTextColor(false) }}
//                   >
//                     Community Name *
//                   </label>
//                   <span
//                     className="text-[10px]"
//                     style={{ color: themeUtils.getTextColor(false, true) }}
//                   >
//                     {form.community_name.length}/150
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={form.community_name}
//                   onChange={(e) =>
//                     handleInputChange("community_name", e.target.value)
//                   }
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.community_name
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.community_name
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="e.g. Palm Jumeirah"
//                   maxLength={150}
//                 />
//                 {errors.community_name && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.community_name}
//                   </p>
//                 )}
//               </div>

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
//             </div>

//             {/* Row 2: Address 1 and Address 2 (2 columns) */}
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

//             {/* Row 3: Total Properties and Total Units */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {/* Total Properties */}
//               <div>
//                 <label
//                   className="block text-sm font-medium mb-1"
//                   style={{ color: themeUtils.getTextColor(false) }}
//                 >
//                   Total Properties
//                 </label>
//                 <input
//                   type="number"
//                   value={form.total_properties}
//                   onChange={(e) =>
//                     handleInputChange("total_properties", e.target.value)
//                   }
//                   min="0"
//                   className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
//                     errors.total_properties
//                       ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: themeUtils.getBgColor("input"),
//                     borderColor: errors.total_properties
//                       ? "#ef4444"
//                       : themeUtils.getBorderColor(),
//                     color: themeUtils.getTextColor(true),
//                   }}
//                   placeholder="0"
//                 />
//                 {errors.total_properties && (
//                   <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
//                     <span>⚠</span> {errors.total_properties}
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
//                   Community Description
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
//                 placeholder="Brief description of the community..."
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
//             {loading ? "Updating..." : "Update"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCommunity;




import React, { useState, useEffect } from "react";
import { Upload, X, ChevronDown, Search } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import { API_URL_COMMUNITY } from "../../../../../config";

const EditCommunity = ({ communityId, community, onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!community);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [form, setForm] = useState({
    community_name: "",
    address1: "",
    address2: "",
    city: "",
    country_code: "+971",
    manager_name: "",
    manager_contact: "",
    total_properties: "",
    total_units: "",
    description: "",
  });

  // Validation errors state - now only for format validation, not required
  const [errors, setErrors] = useState({
    community_name: "",
    address1: "",
    address2: "",
    city: "",
    country_code: "",
    manager_name: "",
    manager_contact: "",
    total_properties: "",
    total_units: "",
    description: "",
  });

  // Country codes with digit validation rules (same as AddCommunity)
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

  // Base URL for API from config
  const baseURL = API_URL_COMMUNITY || "http://192.168.1.68:5000";

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

  // Initialize form with passed community data if available
  useEffect(() => {
    if (community) {
      // Extract contact number without country code
      let contactNumber = "";
      let countryCode = "+971";
      
      if (community.manager_contact) {
        const contactStr = community.manager_contact.toString();
        
        // Try to extract country code
        const foundCountry = countryCodes.find(c => contactStr.startsWith(c.code.replace('+', '')) || contactStr.startsWith(c.code));
        if (foundCountry) {
          countryCode = foundCountry.code;
          contactNumber = contactStr.replace(foundCountry.code.replace('+', ''), '').replace(foundCountry.code, '');
        } else if (contactStr.startsWith("971")) {
          countryCode = "+971";
          contactNumber = contactStr.substring(3);
        } else {
          contactNumber = contactStr;
        }
      }

      setForm({
        community_name: community.community_name || "",
        address1: community.address_line1 || "",
        address2: community.address_line2 || "",
        city: community.city || "",
        country_code: countryCode,
        manager_name: community.manager_name || "",
        manager_contact: contactNumber,
        total_properties: community.total_properties || "",
        total_units: community.total_units || "",
        description: community.community_description || "",
      });

      // Set existing image if available
      if (community.profile_image) {
        setExistingImage(`${baseURL}${community.profile_image}`);
      }
      
      setFetchLoading(false);
    }
  }, [community, baseURL]);

  // Fetch community details from API only if no community data passed
  useEffect(() => {
    const fetchCommunity = async () => {
      if (!communityId || community) return;
      
      try {
        setFetchLoading(true);
        
        const response = await fetch(`${baseURL}/api/communities/${communityId}`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        const communityData = data.data || data;

        if (communityData) {
          // Extract contact number without country code
          let contactNumber = "";
          let countryCode = "+971";
          
          if (communityData.manager_contact) {
            const contactStr = communityData.manager_contact.toString();
            
            // Try to extract country code
            const foundCountry = countryCodes.find(c => contactStr.startsWith(c.code.replace('+', '')) || contactStr.startsWith(c.code));
            if (foundCountry) {
              countryCode = foundCountry.code;
              contactNumber = contactStr.replace(foundCountry.code.replace('+', ''), '').replace(foundCountry.code, '');
            } else if (contactStr.startsWith("971")) {
              countryCode = "+971";
              contactNumber = contactStr.substring(3);
            } else {
              contactNumber = contactStr;
            }
          }

          setForm({
            community_name: communityData.community_name || "",
            address1: communityData.address_line1 || "",
            address2: communityData.address_line2 || "",
            city: communityData.city || "",
            country_code: countryCode,
            manager_name: communityData.manager_name || "",
            manager_contact: contactNumber,
            total_properties: communityData.total_properties || "",
            total_units: communityData.total_units || "",
            description: communityData.community_description || "",
          });

          // Set existing image if available
          if (communityData.profile_image) {
            setExistingImage(`${baseURL}${communityData.profile_image}`);
          }
        } else {
          throw new Error("Community not found");
        }
      } catch (error) {
        console.error("Fetch community error:", error);
        toast.error("Error", error.message || "Failed to load community details");
        if (onClose) onClose();
      } finally {
        setFetchLoading(false);
      }
    };

    if (communityId && !community) {
      fetchCommunity();
    }
  }, [communityId, community, baseURL, toast, onClose]);

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
    setExistingImage(null);
    const fileInput = document.getElementById('community-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validation rules - only format validation, no required checks
  const validateField = (name, value) => {
    switch (name) {
      case "community_name":
        if (value && value.length > 150) return "Community name cannot exceed 150 characters";
        return "";

      case "address1":
        if (value && value.length > 200) return "Address cannot exceed 200 characters";
        return "";

      case "address2":
        if (value && value.length > 200) return "Address cannot exceed 200 characters";
        return "";

      case "city":
        if (value && value.length > 100) return "City cannot exceed 100 characters";
        return "";

      case "country_code":
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

      case "total_properties":
        if (value && parseInt(value) < 0)
          return "Total properties cannot be negative";
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
    const truncated = digitsOnly.slice(0, requiredDigits);
    handleInputChange("manager_contact", truncated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Get the country name from the selected country code
      const selectedCountryName = selectedCountry?.country || 'UAE';
      
      // Get user ID
      const userId = getCurrentUserId();

      // Create FormData and append each field individually (same as AddCommunity)
      const formData = new FormData();
      
      // Append all fields individually
      formData.append('community_name', form.community_name.trim() || '');
      formData.append('address_line1', form.address1.trim() || '');
      formData.append('address_line2', form.address2?.trim() || '');
      formData.append('city', form.city.trim() || '');
      formData.append('country', selectedCountryName);
      formData.append('manager_name', form.manager_name?.trim() || '');
      
      // Combine country code and phone number for manager_contact
      const fullPhoneNumber = form.manager_contact ? `${form.country_code}${form.manager_contact}` : '';
      formData.append('manager_contact', fullPhoneNumber);
      
      formData.append('total_properties', form.total_properties || '0');
      formData.append('total_units', form.total_units || '0');
      formData.append('community_description', form.description?.trim() || '');
      formData.append('updated_by', userId || '');
      
      // Append file if selected
      if (file) {
        formData.append('profile_image', file);
      }

      // Log FormData contents for debugging
      console.log("Updating community with FormData:");
      for (let pair of formData.entries()) {
        if (pair[0] === 'profile_image' && pair[1] instanceof File) {
          console.log(pair[0] + ': File - ' + pair[1].name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      // Get the correct community ID
      const communityIdToUpdate = communityId || community?.community_id;
      
      if (!communityIdToUpdate) {
        throw new Error("Community ID is missing");
      }

      // Make API call
      const response = await fetch(`${baseURL}/api/communities/${communityIdToUpdate}`, {
        method: 'PUT',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      // Check the response format
      if (data.success || (data.id && data.message)) {
        toast.success("Success", "Community updated successfully!");
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      } else {
        throw new Error(data.error || data.message || "Failed to update community");
      }
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Error", error.message || "Failed to update community. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const requiredDigits = getCurrentCountryDigits();

  if (fetchLoading) {
    return (
      <div
        className="flex flex-col h-full rounded-lg items-center justify-center"
        style={{ backgroundColor: themeUtils.getBgColor("default") }}
      >
        <div className="text-center p-8">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "#6366f1" }}
          ></div>
          <p className="mt-4" style={{ color: themeUtils.getTextColor(true) }}>
            Loading community details...
          </p>
        </div>
      </div>
    );
  }

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
                Community Profile Picture
              </h3>

              {/* Image Preview or Upload Area */}
              {previewUrl || existingImage ? (
                <div className="relative">
                  <img
                    src={previewUrl || existingImage}
                    alt="Community Preview"
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
                  onClick={() => document.getElementById('community-image')?.click()}
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
                id="community-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-2">
            {/* Row 1: Community Name and City (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Community Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Community Name
                  </label>
                  <span
                    className="text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.community_name.length}/150
                  </span>
                </div>
                <input
                  type="text"
                  value={form.community_name}
                  onChange={(e) =>
                    handleInputChange("community_name", e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.community_name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.community_name
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. Palm Jumeirah"
                  maxLength={150}
                />
                {errors.community_name && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.community_name}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    City
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
            </div>

            {/* Row 2: Address 1 and Address 2 (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Address 1 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Address 1
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

            {/* Row 3: Total Properties and Total Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Total Properties */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Total Properties
                </label>
                <input
                  type="number"
                  value={form.total_properties}
                  onChange={(e) =>
                    handleInputChange("total_properties", e.target.value)
                  }
                  min="0"
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.total_properties
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.total_properties
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="0"
                />
                {errors.total_properties && (
                  <p className="mt-0.5 text-[10px] text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.total_properties}
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
                  Community Description
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
                placeholder="Brief description of the community..."
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
                  <p
                    className="mt-0.5 text-[10px]"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {requiredDigits} digits for {selectedCountry?.country || 'UAE'}
                  </p>
                </div>
              </div>
            </div>
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
          {hasErrors() && (
            <span className="text-red-500">
              {Object.values(errors).filter((e) => e).length} validation error(s)
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
            disabled={loading}
            themeUtils={themeUtils}
            size="sm"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCommunity;