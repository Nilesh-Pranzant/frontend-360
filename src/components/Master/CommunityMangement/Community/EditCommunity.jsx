import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import { API_URL_COMMUNITY } from "../../../../../config";

const EditCommunity = ({ communityId, community, onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!community); // Only loading if no community data
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [form, setForm] = useState({
    community_code: "",
    community_name: "",
    location: "",
    city: "",
    country: "UAE",
    manager_name: "",
    manager_contact: "",
    total_properties: "",
    total_units: "",
    description: "",
  });

  // Base URL for API
  const baseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";

  // Validation errors state
  const [errors, setErrors] = useState({
    community_code: "",
    community_name: "",
    location: "",
    city: "",
    country: "",
    manager_name: "",
    manager_contact: "",
    total_properties: "",
    total_units: "",
    description: "",
  });

  // Initialize form with passed community data if available
  useEffect(() => {
    if (community) {
      // Extract contact number without country code if it has +971
      let contactNumber = "";
      if (community.manager_contact) {
        const contactStr = community.manager_contact.toString();
        if (contactStr.startsWith("+971")) {
          contactNumber = contactStr.substring(4);
        } else if (contactStr.startsWith("971")) {
          contactNumber = contactStr.substring(3);
        } else {
          contactNumber = contactStr;
        }
      }

      setForm({
        community_code: community.community_code || "",
        community_name: community.community_name || "",
        location: community.location || "",
        city: community.city || "",
        country: community.country || "UAE",
        manager_name: community.manager_name || "",
        manager_contact: contactNumber,
        total_properties: community.total_properties || "",
        total_units: community.total_units || "",
        description: community.description || "",
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
      if (!communityId || community) return; // Skip if we already have community data
      
      try {
        setFetchLoading(true);
        
        const response = await fetch(`${baseURL}/api/communities/${communityId}`);
        const data = await response.json();

        if (response.ok) {
          // Extract contact number without country code if it has +971
          let contactNumber = "";
          if (data.manager_contact) {
            const contactStr = data.manager_contact.toString();
            if (contactStr.startsWith("+971")) {
              contactNumber = contactStr.substring(4);
            } else if (contactStr.startsWith("971")) {
              contactNumber = contactStr.substring(3);
            } else {
              contactNumber = contactStr;
            }
          }

          setForm({
            community_code: data.community_code || "",
            community_name: data.community_name || "",
            location: data.location || "",
            city: data.city || "",
            country: data.country || "UAE",
            manager_name: data.manager_name || "",
            manager_contact: contactNumber,
            total_properties: data.total_properties || "",
            total_units: data.total_units || "",
            description: data.description || "",
          });

          // Set existing image if available
          if (data.profile_image) {
            setExistingImage(`${baseURL}${data.profile_image}`);
          }
        } else {
          throw new Error(data.message || "Failed to load community details");
        }
      } catch (error) {
        console.error("Fetch community error:", error);
        toast.error("Error", error.message || "Failed to load community details");
      } finally {
        setFetchLoading(false);
      }
    };

    if (communityId && !community) {
      fetchCommunity();
    }
  }, [communityId, community, baseURL]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid File Type", "Please upload a valid image file (JPG, PNG, WEBP).");
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", "Image size should be less than 5MB.");
        return;
      }

      setFile(selectedFile);

      // Create preview URL
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
    // Reset file input
    const fileInput = document.getElementById('community-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validation rules
  const validateForm = () => {
    const newErrors = {
      community_code: "",
      community_name: "",
      location: "",
      city: "",
      country: "",
      manager_name: "",
      manager_contact: "",
      total_properties: "",
      total_units: "",
      description: "",
    };
    let isValid = true;

    // Community Code validation
    if (!form.community_code.trim()) {
      newErrors.community_code = "Community code is required";
      isValid = false;
    } else if (form.community_code.length < 3) {
      newErrors.community_code = "Community code must be at least 3 characters";
      isValid = false;
    } else if (form.community_code.length > 50) {
      newErrors.community_code = "Community code cannot exceed 50 characters";
      isValid = false;
    }

    // Community Name validation
    if (!form.community_name.trim()) {
      newErrors.community_name = "Community name is required";
      isValid = false;
    } else if (form.community_name.length < 3) {
      newErrors.community_name = "Community name must be at least 3 characters";
      isValid = false;
    } else if (form.community_name.length > 150) {
      newErrors.community_name = "Community name cannot exceed 150 characters";
      isValid = false;
    }

    // Location validation
    if (!form.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    } else if (form.location.length > 200) {
      newErrors.location = "Location cannot exceed 200 characters";
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

    // Country validation
    if (!form.country.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    // Manager name validation - only letters and spaces
    if (form.manager_name) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(form.manager_name.trim())) {
        newErrors.manager_name =
          "Manager name can only contain letters and spaces";
        isValid = false;
      } else if (form.manager_name.trim().length > 100) {
        newErrors.manager_name = "Manager name cannot exceed 100 characters";
        isValid = false;
      }
    }

    // Manager Contact validation
    if (form.manager_contact) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(form.manager_contact)) {
        newErrors.manager_contact =
          "Please enter a valid phone number (0-9 digits)";
        isValid = false;
      }
    }

    // Total Properties validation
    if (form.total_properties && parseInt(form.total_properties) < 0) {
      newErrors.total_properties = "Total properties cannot be negative";
      isValid = false;
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

  // Real-time validation for specific fields
  const validateField = (name, value) => {
    switch (name) {
      case "community_code":
        if (!value.trim()) return "Community code is required";
        if (value.length < 3) return "Community code must be at least 3 characters";
        if (value.length > 50) return "Community code cannot exceed 50 characters";
        return "";

      case "community_name":
        if (!value.trim()) return "Community name is required";
        if (value.length < 3) return "Community name must be at least 3 characters";
        if (value.length > 150) return "Community name cannot exceed 150 characters";
        return "";

      case "location":
        if (!value.trim()) return "Location is required";
        if (value.length > 200) return "Location cannot exceed 200 characters";
        return "";

      case "city":
        if (!value.trim()) return "City is required";
        if (value.length > 100) return "City cannot exceed 100 characters";
        return "";

      case "country":
        if (!value.trim()) return "Country is required";
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
          const phoneRegex = /^[0-9]{7,15}$/;
          if (!phoneRegex.test(value))
            return "Please enter a valid phone number (0-9 digits)";
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

  // Handle input change with validation
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Validation Error", "Please fix the errors in the form before submitting.");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for API call
      const formData = new FormData();
      formData.append("community_code", form.community_code.trim());
      formData.append("community_name", form.community_name.trim());
      formData.append("location", form.location.trim());
      formData.append("city", form.city.trim());
      formData.append("country", form.country.trim());
      formData.append("manager_name", form.manager_name.trim() || "");
      
      // Format phone number with +971 if it doesn't have it
      let phoneNumber = form.manager_contact.trim();
      if (phoneNumber && !phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.startsWith('971') ? `+${phoneNumber}` : `+971${phoneNumber}`;
      }
      formData.append("manager_contact", phoneNumber || "");
      
      formData.append("total_properties", form.total_properties || "0");
      formData.append("total_units", form.total_units || "0");
      formData.append("description", form.description.trim() || "");

      // Append new image if selected
      if (file) {
        formData.append("profile_image", file);
      }

      // Make API call
      const response = await fetch(`${baseURL}/api/communities/${communityId || community?.community_id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Removed the toast.success from here to prevent double message
        // Let the parent component handle the success message through onSuccess
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      } else {
        throw new Error(data.message || "Failed to update community");
      }
    } catch (error) {
      console.error("Edit Community Error:", error);
      toast.error("Error", error.message || "Failed to update community");
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const isFormValid = () => {
    return form.community_code.trim() !== "" &&
      form.community_name.trim() !== "" &&
      form.location.trim() !== "" &&
      form.city.trim() !== "" &&
      form.country.trim() !== "" &&
      !hasErrors();
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

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
      <div className="flex-1 p-2">
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
                className="text-sm font-medium mb-4"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Community Profile Picture
              </h3>

              {/* Image Preview or Upload Area */}
              {(previewUrl || existingImage) ? (
                <div className="relative">
                  <img
                    src={previewUrl || existingImage}
                    alt="Community"
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
                    className="mx-auto mb-3"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  />
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    Click to upload image
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
          <div className="lg:col-span-2 space-y-5">
            {/* Row 1: Community Code and Community Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Community Code */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Community Code *
                  </label>
                  <span
                    className="text-xs"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.community_code.length}/50
                  </span>
                </div>
                <input
                  type="text"
                  value={form.community_code}
                  onChange={(e) =>
                    handleInputChange("community_code", e.target.value.toUpperCase())
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.community_code
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                    }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.community_code
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. COM001"
                  maxLength={50}
                />
                {errors.community_code && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.community_code}
                  </p>
                )}
              </div>

              {/* Community Name */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Community Name *
                  </label>
                  <span
                    className="text-xs"
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.community_name
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
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.community_name}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Location */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Location *
                  </label>
                  <span
                    className="text-xs"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    {form.location.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.location
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                    }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.location
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. Near Sahara Mall"
                  maxLength={200}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: City and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    City *
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.city
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
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.city}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Country *
                </label>
                <select
                  value={form.country}
                  onChange={(e) =>
                    handleInputChange("country", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all ${errors.country
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                    }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.country
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                >
                  <option value="UAE">UAE</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Oman">Oman</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Total Properties and Total Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Properties */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.total_properties
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
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.total_properties}
                  </p>
                )}
              </div>

              {/* Total Units */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.total_units
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
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.total_units}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-sm font-medium"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Community Description
                </label>
                <span
                  className="text-xs"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  {form.description.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none placeholder:text-gray-400 ${errors.description
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
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.description}
                </p>
              )}
            </div>

            {/* Manager Details */}
            <div className="pt-2">
              <h3
                className="text-sm font-semibold mb-4 opacity-70 uppercase tracking-wider"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Manager Details (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
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
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.manager_name
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
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.manager_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={form.manager_contact}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 15);
                      handleInputChange("manager_contact", val);
                    }}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${errors.manager_contact
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
                    placeholder="501234567"
                  />
                  {errors.manager_contact && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.manager_contact}
                    </p>
                  )}
                  <p
                    className="mt-1 text-xs"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    Enter digits only (e.g., 501234567)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-3 p-5 border-t"
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        <div
          className="text-sm"
          style={{ color: themeUtils.getTextColor(false, true) }}
        >
          * Required fields
          {hasErrors() && (
            <span className="ml-2 text-red-500">
              Please fix {Object.values(errors).filter((e) => e).length}{" "}
              error(s) above
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            themeUtils={themeUtils}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !isFormValid()}
            themeUtils={themeUtils}
            className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
          >
            {loading ? "Updating..." : "Update Community"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCommunity;