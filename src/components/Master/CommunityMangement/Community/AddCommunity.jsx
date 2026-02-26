import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../../ui/Common/SweetAlert";
import Button from "../../../../ui/Common/Button";
import { useNavigate } from "react-router-dom";

const AddCommunity = ({ onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useSweetAlert();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    communityName: "",
    location: "",
    city: "",
    country: "UAE",
    managerName: "",
    managerContact: "",
    totalProperties: "",
    totalUnits: "",
    description: "",
  });
  const [countryCode, setCountryCode] = useState("+971");

  // Validation errors state
  const [errors, setErrors] = useState({
    communityName: "",
    location: "",
    city: "",
    country: "",
    managerName: "",
    managerContact: "",
    totalProperties: "",
    totalUnits: "",
    description: "",
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        showAlert({
          type: "error",
          title: "Invalid File Type",
          message: "Please select a valid image file (JPEG, PNG, or WEBP)",
          autoClose: true,
          autoCloseTime: 3000,
        });
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        showAlert({
          type: "error",
          title: "File Too Large",
          message: "Image size should be less than 5MB",
          autoClose: true,
          autoCloseTime: 3000,
        });
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
    // Reset file input
    const fileInput = document.getElementById('community-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validation rules
  const validateForm = () => {
    const newErrors = {
      communityName: "",
      location: "",
      city: "",
      country: "",
      managerName: "",
      managerContact: "",
      totalProperties: "",
      totalUnits: "",
      description: "",
    };
    let isValid = true;

    // Community Name validation
    if (!form.communityName.trim()) {
      newErrors.communityName = "Community name is required";
      isValid = false;
    } else if (form.communityName.length < 3) {
      newErrors.communityName = "Community name must be at least 3 characters";
      isValid = false;
    } else if (form.communityName.length > 100) {
      newErrors.communityName = "Community name cannot exceed 100 characters";
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
    if (form.managerName) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(form.managerName.trim())) {
        newErrors.managerName =
          "Manager name can only contain letters and spaces";
        isValid = false;
      } else if (form.managerName.trim().length > 50) {
        newErrors.managerName = "Manager name cannot exceed 50 characters";
        isValid = false;
      }
    }

    // Manager Contact validation
    if (form.managerContact) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(form.managerContact)) {
        newErrors.managerContact =
          "Please enter a valid phone number (0-9 digits)";
        isValid = false;
      }
    }

    // Total Properties validation
    if (form.totalProperties && parseInt(form.totalProperties) < 0) {
      newErrors.totalProperties = "Total properties cannot be negative";
      isValid = false;
    }

    // Total Units validation
    if (form.totalUnits && parseInt(form.totalUnits) < 0) {
      newErrors.totalUnits = "Total units cannot be negative";
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
      case "communityName":
        if (!value.trim()) return "Community name is required";
        if (value.length < 3)
          return "Community name must be at least 3 characters";
        if (value.length > 100)
          return "Community name cannot exceed 100 characters";
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

      case "managerName":
        if (value) {
          const trimmed = value.trim();
          const nameRegex = /^[A-Za-z\s]+$/;
          if (!nameRegex.test(trimmed)) {
            return "Manager name can only contain letters and spaces";
          }
          if (trimmed.length > 50) {
            return "Manager name cannot exceed 50 characters";
          }
        }
        return "";

      case "managerContact":
        if (value) {
          const phoneRegex = /^[0-9]{7,15}$/;
          if (!phoneRegex.test(value))
            return "Please enter a valid phone number (0-9 digits)";
        }
        return "";

      case "totalProperties":
        if (value && parseInt(value) < 0)
          return "Total properties cannot be negative";
        return "";

      case "totalUnits":
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the form before submitting.",
        autoClose: true,
        autoCloseTime: 3000,
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setLoading(false);
      
      showAlert({
        type: "success",
        title: "Success",
        message: "Community added successfully!",
        autoClose: true,
        autoCloseTime: 2200,
        confirmButtonText: "OK",
        onConfirm: () => {
          if (onClose) onClose();
          if (onSuccess) onSuccess();
          navigate("/community-management/communities", { replace: true });
        },
        onClose: () => {
          if (onClose) onClose();
          if (onSuccess) onSuccess();
          navigate("/community-management/communities", { replace: true });
        },
      });
    }, 1000);
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const isFormValid = () => {
    return form.communityName.trim() !== "" && 
           form.location.trim() !== "" && 
           form.city.trim() !== "" && 
           form.country.trim() !== "" && 
           !hasErrors();
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <AlertComponent />


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
                className="text-sm font-medium mb-4"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Community Profile Picture
              </h3>
              
              {/* Image Preview or Upload Area */}
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
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
            {/* Row 1: Community Name and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {form.communityName.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  value={form.communityName}
                  onChange={(e) =>
                    handleInputChange("communityName", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.communityName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.communityName
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="e.g. Palm Jumeirah"
                  maxLength={100}
                />
                {errors.communityName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.communityName}
                  </p>
                )}
              </div>

              {/* Location */}
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.location
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

            {/* Row 2: City and Country */}
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
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
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all ${
                    errors.country
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

            {/* Row 3: Total Properties and Total Units */}
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
                  value={form.totalProperties}
                  onChange={(e) =>
                    handleInputChange("totalProperties", e.target.value)
                  }
                  min="0"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.totalProperties
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.totalProperties
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="0"
                />
                {errors.totalProperties && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.totalProperties}
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
                  value={form.totalUnits}
                  onChange={(e) =>
                    handleInputChange("totalUnits", e.target.value)
                  }
                  min="0"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                    errors.totalUnits
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: errors.totalUnits
                      ? "#ef4444"
                      : themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="0"
                />
                {errors.totalUnits && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.totalUnits}
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
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none placeholder:text-gray-400 ${
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
                    value={form.managerName}
                    onChange={(e) =>
                      handleInputChange("managerName", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                      errors.managerName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.managerName
                        ? "#ef4444"
                        : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Manager Name"
                    maxLength={50}
                  />
                  {errors.managerName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.managerName}
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
                  <div className="flex">
                    <input
                      type="text"
                      value={countryCode}
                      readOnly
                      className="w-20 px-3 py-2.5 text-sm rounded-l-lg border-y border-l focus:z-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-center"
                      style={{
                        backgroundColor: themeUtils.getBgColor("hover"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                    />
                    <input
                      type="tel"
                      value={form.managerContact}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 15);
                        handleInputChange("managerContact", val);
                      }}
                      className={`flex-1 px-4 py-2.5 text-sm rounded-r-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${
                        errors.managerContact
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: errors.managerContact
                          ? "#ef4444"
                          : themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="50 123 4567"
                    />
                  </div>
                  {errors.managerContact && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.managerContact}
                    </p>
                  )}
                  <p
                    className="mt-1 text-xs"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  >
                    Enter 0-9 digits only
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
            onClick={onClose}
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
            {loading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCommunity;