// pages/Property/EditProperty.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Upload, X, ChevronDown, Search, Pencil } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import { API_URL_PROPERTY, API_URL_COMMUNITY } from "../../../../../config";

const EditProperty = ({ property: propProperty, onClose, onSuccess, baseURL: propBaseURL }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [originalProperty, setOriginalProperty] = useState(null);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_PROPERTY || "http://192.168.1.39:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";

  // Check if modal mode
  const isModal = !!propProperty || !!onClose;

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

  const [form, setForm] = useState({
    community_id: "",
    property_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    country_code: "+971",
    manager_name: "",
    manager_contact: "",
    total_floors: "", // Added total_floors field
    total_units: "",
    property_description: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    community_id: "",
    property_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    country_code: "",
    manager_name: "",
    manager_contact: "",
    total_floors: "", // Added total_floors error field
    total_units: "",
    property_description: "",
  });

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
        const data = await response.json();

        if (response.ok) {
          const communityList = Array.isArray(data) ? data : data.data || [];
          setCommunities(communityList);
        } else {
          toast.error("Error", data.message || "Failed to load communities");
        }
      } catch (error) {
        toast.error("Error", "Failed to load communities. Please check your connection.");
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, [communityBaseURL]);

  // Fetch complete property data from API
  useEffect(() => {
    const fetchCompleteProperty = async () => {
      // Get property ID
      const propertyId = 
        propProperty?.property_id || 
        propProperty?.id || 
        location.state?.property?.property_id ||
        location.state?.property?.id ||
        id;

      if (!propertyId) {
        console.error("No building ID available");
        toast.error("Error", "No building ID found. Please go back and try again.");
        if (!isModal) navigate("/community-management/Property");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching complete building data for ID:", propertyId);
        
        // Always fetch from API to get complete data
        const response = await fetch(`${baseURL}/api/properties/${propertyId}`);
        const data = await response.json();

        console.log("Complete building data from API:", data);

        if (response.ok) {
          const propertyData = data.data || data;
          setOriginalProperty(propertyData);
          populateForm(propertyData);
        } else {
          throw new Error(data.message || "Failed to load building details");
        }
      } catch (error) {
        console.error("Error fetching building:", error);
        toast.error("Error", error.message || "Failed to load building details");
        if (!isModal) navigate("/community-management/Property");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleteProperty();
  }, [id, propProperty, location.state, isModal, baseURL]);

  const populateForm = (property) => {
    console.log("Populating form with complete building data:", property);

    // Extract contact number and country code
    let contactNumber = "";
    let countryCode = "+971";
    
    if (property.manager_contact) {
      const contactStr = property.manager_contact.toString();
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
      community_id: property.community_id || "",
      property_name: property.building_name || "",
      address_line1: property.address_line1 || "",
      address_line2: property.address_line2 || "",
      city: property.city || "",
      country_code: countryCode,
      manager_name: property.manager_name || "",
      manager_contact: contactNumber,
      total_floors: property.total_floors?.toString() || "", // Added total_floors
      total_units: property.total_units?.toString() || "0",
      property_description: property.property_description || property.description || "",
    });

    // Set existing image if available
    if (property.profile_picture) {
  const imageUrl = property.profile_picture.startsWith('http')
    ? property.profile_picture
    : `${baseURL}${property.profile_picture}`;
      setExistingImage(imageUrl);
      setPreviewUrl(imageUrl);
    }
  };

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
        setExistingImage(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setExistingImage(null);
    const fileInput = document.getElementById('property-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "community_id":
        if (!value) return "Community is required";
        return "";
      case "property_name":
        if (!value.trim()) return "Building name is required";
        return "";
      case "country_code":
        if (!value) return "Country code is required";
        return "";
      case "total_floors":
        if (value && (parseInt(value) < 0 || parseInt(value) > 1000)) {
          return "Total floors must be between 0 and 1000";
        }
        return "";
      case "total_units":
        if (value && (parseInt(value) < 0 || parseInt(value) > 10000)) {
          return "Total units must be between 0 and 10000";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      community_id: "",
      property_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      country_code: "",
      manager_name: "",
      manager_contact: "",
      total_floors: "",
      total_units: "",
      property_description: "",
    };
    let isValid = true;

    if (!form.community_id) {
      newErrors.community_id = "Community is required";
      isValid = false;
    }

    if (!form.property_name.trim()) {
      newErrors.property_name = "Building name is required";
      isValid = false;
    }

    if (!form.country_code) {
      newErrors.country_code = "Country code is required";
      isValid = false;
    }

    // Validate total_floors if provided
    if (form.total_floors) {
      const floorsError = validateField("total_floors", form.total_floors);
      if (floorsError) {
        newErrors.total_floors = floorsError;
        isValid = false;
      }
    }

    // Validate total_units if provided
    if (form.total_units) {
      const unitsError = validateField("total_units", form.total_units);
      if (unitsError) {
        newErrors.total_units = unitsError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

const handleInputChange = (field, value) => {
  const updatedForm = {
    ...form,
    [field]: value,
  };

  setForm(updatedForm);

  let newErrors = { ...errors };

  const floors = parseInt(updatedForm.total_floors || 0);
  const units = parseInt(updatedForm.total_units || 0);

  // Floors validation
  if (field === "total_floors") {
    if (floors < 0) {
      newErrors.total_floors = "Total floors cannot be negative";
    } 
    else if (units && floors > units) {
      newErrors.total_floors = "Total floors must be less than or equal to total units";
    } 
    else {
      newErrors.total_floors = "";
    }
  }

  // Units validation
  if (field === "total_units") {
    if (units < 0) {
      newErrors.total_units = "Total units cannot be negative";
    } 
    else if (floors && floors > units) {
      newErrors.total_units = "Total units must be greater than or equal to total floors";
    } 
    else {
      newErrors.total_units = "";
      newErrors.total_floors = "";
    }
  }

  setErrors(newErrors);
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

  /* ================= UPDATE PROPERTY ================= */
  const handleSubmit = async () => {
    // Get property ID
    const propertyId = 
      originalProperty?.property_id || 
      propProperty?.property_id || 
      propProperty?.id || 
      id;

    if (!propertyId) {
      toast.error("Error", "Building ID is missing. Please go back and try again.");
      return;
    }

    if (!validateForm()) {
      toast.error("Validation Error", "Please fix the errors in the form before submitting.");
      return;
    }

    setSaving(true);

    try {
      // Get the country name from the selected country code
      const selectedCountryName = selectedCountry?.country || 'UAE';
      
      // Get user ID
      const userId = getCurrentUserId();

      // Prepare JSON data
        const jsonData = {
        building_id: propertyId,
        community_id: parseInt(form.community_id),
        building_name: form.property_name.trim(),
        address_line1: form.address_line1?.trim() || null,
        address_line2: form.address_line2?.trim() || null,
        city: form.city?.trim() || null,
        manager_name: form.manager_name?.trim() || null,
        manager_contact: form.manager_contact
          ? `${form.country_code}${form.manager_contact}`
          : null,
        total_floors: form.total_floors ? parseInt(form.total_floors) : null,
        total_units: form.total_units ? parseInt(form.total_units) : 0,
        building_description: form.property_description?.trim() || null,
        updated_by: userId
      };

      console.log("Sending update data:", jsonData);

      let response;
      
      if (file) {
        // Use FormData if there's a file
        const formData = new FormData();
        formData.append('data', JSON.stringify(jsonData));
       formData.append('profile_picture', file);
        
        response = await fetch(`${baseURL}/api/properties/${propertyId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Send as JSON directly
        response = await fetch(`${baseURL}/api/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        // toast.success("Success", "Property updated successfully!");

        if (onSuccess) {
          onSuccess(data);
        }
        
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1000);
      } else {
        throw new Error(data.message || data.error || "Failed to update building");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error", error.message || "Failed to update building. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate("/community-management/Property");
    }
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const isFormValid = () => {
    return form.community_id !== "" &&
      form.property_name.trim() !== "" &&
      form.country_code !== "" &&
      !hasErrors();
  };

  const requiredDigits = getCurrentCountryDigits();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          ></div>
          <p className="mt-4" style={{ color: themeUtils.getTextColor(true) }}>
            Loading Building details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-2 px-4"}>
      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between py-2">
            <div>
              <CardTitle themeUtils={themeUtils}>Edit Building</CardTitle>
            </div>

            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/community-management/Property")}
                themeUtils={themeUtils}
                className="ml-auto"
              >
                <RiArrowGoBackFill />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent>
        <div className="space-y-6 p-2">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Left Column: Image Upload */}
              <div className="lg:col-span-1 flex items-start justify-center ">
                <div
                  className="p-5 rounded-lg border w-full"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-3"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    Building Image
                  </h3>

                  {/* Image Preview or Upload Area */}
                  {previewUrl  ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Building"
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
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                {/* Row 1: Community and Property Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all appearance-none ${
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
                      disabled={saving || loadingCommunities}
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
                      <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
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
                        Building Name *
                      </label>
                      <span
                        className="text-xs"
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
                      className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
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
                      disabled={saving}
                    />
                    {errors.property_name && (
                      <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.property_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Address 1 and Address 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address 1 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Address Line 1
                      </label>
                      <span
                        className="text-xs"
                        style={{ color: themeUtils.getTextColor(false, true) }}
                      >
                        {form.address_line1.length}/200
                      </span>
                    </div>
                    <input
                      type="text"
                      value={form.address_line1}
                      onChange={(e) =>
                        handleInputChange("address_line1", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Street address, P.O. Box"
                      maxLength={200}
                      disabled={saving}
                    />
                  </div>

                  {/* Address 2 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Address Line 2
                      </label>
                      <span
                        className="text-xs"
                        style={{ color: themeUtils.getTextColor(false, true) }}
                      >
                        {form.address_line2.length}/200
                      </span>
                    </div>
                    <input
                      type="text"
                      value={form.address_line2}
                      onChange={(e) =>
                        handleInputChange("address_line2", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      maxLength={200}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Row 3: City and Total Floors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="text-xs"
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
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="e.g. Dubai"
                      maxLength={100}
                      disabled={saving}
                    />
                  </div>

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
                      max="10000"
                      className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
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
                      disabled={saving}
                    />
                    {errors.total_units && (
                      <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.total_units}
                      </p>
                    )}
                  </div>

                  {/* Total Floors - NEW FIELD */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Total Floors
                    </label>
                    <input
                      type="number"
                      value={form.total_floors}
                      onChange={(e) =>
                        handleInputChange("total_floors", e.target.value)
                      }
                      min="0"
                      max="1000"
                      className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                        errors.total_floors
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: errors.total_floors
                          ? "#ef4444"
                          : themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="e.g. 25"
                      disabled={saving}
                    />
                    {errors.total_floors && (
                      <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.total_floors}
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
                      Building Description
                    </label>
                    <span
                      className="text-xs"
                      style={{ color: themeUtils.getTextColor(false, true) }}
                    >
                      {form.property_description.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={form.property_description}
                    onChange={(e) =>
                      handleInputChange("property_description", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none placeholder:text-gray-400"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Brief description of the building..."
                    maxLength={500}
                    disabled={saving}
                  />
                </div>

                {/* Manager Details */}
                <div className="pt-2">
                  <h3
                    className="text-sm font-semibold mb-3 opacity-70 uppercase tracking-wider"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    Manager Details (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                        placeholder="Manager Name"
                        maxLength={100}
                        disabled={saving}
                      />
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
                              className={`w-full px-2 py-2 text-sm rounded-lg border flex items-center justify-between ${
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
                              disabled={saving}
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
                                <div className="max-h-60 ">
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
                                          <span className="text-xs ml-2 opacity-50">({country.digits} digits)</span>
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
                            className={`flex-1 px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
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
                            disabled={saving}
                          />
                        </div>
                      </div>
                      {errors.manager_contact && (
                        <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {errors.manager_contact}
                        </p>
                      )}
                      {errors.country_code && (
                        <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {errors.country_code}
                        </p>
                      )}
                      <p
                        className="mt-0.5 text-xs"
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

          {/* Footer with Actions */}
          <div
            className="flex items-center justify-between gap-3 p-3 border-t mt-6"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <div
              className="text-xs"
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
                onClick={handleCancel}
                disabled={saving}
                themeUtils={themeUtils}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={saving}
                disabled={saving || !isFormValid()}
                themeUtils={themeUtils}
                size="sm"
                className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
              >
                {saving ? "Updating..." : "Update Building"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EditProperty;