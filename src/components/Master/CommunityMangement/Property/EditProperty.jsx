// pages/Property/EditProperty.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Upload, X, Pencil } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_PROPERTY || "http://192.168.1.39:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";

  // Check if modal mode
  const isModal = !!propProperty || !!onClose;

  const [form, setForm] = useState({
    community_id: "",
    community_name: "",
    property_name: "",
    total_units: "",
    address_line1: "",
    address_line2: "",
    country: "",
    city: "",
    location: "",
    zip_code: ""
  });

  // Fetch communities from API
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
        toast.error("Error", "Failed to load communities. Please check your connection.");
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, [communityBaseURL]);

  /* ================= GET PROPERTY DATA ================= */
  useEffect(() => {
    const fetchProperty = async () => {
      // Get property ID
      const propertyId = 
        propProperty?.property_id || 
        propProperty?.id || 
        location.state?.property?.property_id ||
        location.state?.property?.id ||
        id;

      if (!propertyId) {
        console.error("No property ID available");
        toast.error("Error", "No property ID found. Please go back and try again.");
        if (!isModal) navigate("/community-management/Property");
        setLoading(false);
        return;
      }

      // If we have the full property object from props, use it directly
      if (propProperty) {
        populateForm(propProperty);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/properties/${propertyId}`);
        const data = await response.json();

        if (response.ok) {
          populateForm(data);
        } else {
          throw new Error(data.message || "Failed to load property details");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Error", error.message || "Failed to load property details");
        if (!isModal) navigate("/community-management/Property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, propProperty, location.state, isModal, baseURL]);

  const populateForm = (property) => {
    console.log("Populating form with property:", property);

    setForm({
      community_id: property.community_id || "",
      community_name: property.community_name || "",
      property_name: property.property_name || "",
      total_units: property.total_units?.toString() || "",
      address_line1: property.address_line1 || "",
      address_line2: property.address_line2 || "",
      country: property.country || "UAE",
      city: property.city || "Dubai",
      location: property.location || property.address_line1 || "",
      zip_code: property.zip_code || "",
    });

    // Set image preview if property has an image
    if (property.property_image) {
      setExistingImage(`${baseURL}${property.property_image}`);
      setImagePreview(`${baseURL}${property.property_image}`);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid File Type", "Please upload a valid image file (JPG, PNG, WEBP)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", "Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setExistingImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExistingImage(null);
    const fileInput = document.getElementById('property-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /* ================= UPDATE PROPERTY ================= */
  const handleSubmit = async () => {
    // Get property ID
    const propertyId = 
      propProperty?.property_id || 
      propProperty?.id || 
      location.state?.property?.property_id ||
      location.state?.property?.id ||
      id;

    if (!propertyId) {
      toast.error("Error", "Property ID is missing. Please go back and try again.");
      return;
    }

    // Validate required fields (Property Name is required)
    if (!form.property_name.trim()) {
      toast.error("Validation Error", "Property Name is required.");
      return;
    }

    setSaving(true);

    try {
      // Create FormData for API call
      const formData = new FormData();
      
      formData.append("community_id", form.community_id || "");
      formData.append("property_name", form.property_name.trim());
      formData.append("total_units", form.total_units || "0");
      formData.append("address_line1", form.address_line1 || "");
      formData.append("address_line2", form.address_line2 || "");
      formData.append("country", form.country || "UAE");
      formData.append("city", form.city || "Dubai");
      formData.append("zip_code", form.zip_code || "");
      formData.append("location", form.location || form.address_line1 || "");
      
      // Append new image if selected
      if (selectedImage) {
        formData.append("property_image", selectedImage);
      }

      // Make API call
      const response = await fetch(`${baseURL}/api/properties/${propertyId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Success", "Property updated successfully!");

        setTimeout(() => {
          if (isModal && onClose) onClose();
          if (onSuccess) onSuccess(data);
          if (!isModal) navigate("/community-management/Property", { replace: true });
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error", error.message || "Failed to update property");
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          ></div>
          <p className="mt-4" style={{ color: themeUtils.getTextColor(true) }}>
            Loading Property details...
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
              <CardTitle themeUtils={themeUtils}>Edit Property</CardTitle>
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
          {/* Main Content - Image on Left, Fields on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - Image Upload/Display */}
            <div className="lg:col-span-4">
              <div className="flex flex-col items-center">
                <label
                  className="block text-sm font-medium mb-3 text-left w-full"
                  style={{ color: themeUtils.getTextColor(false) }}
                >
                  Property Image
                </label>

                {/* Image Upload Area - Fixed height container */}
                <div className="relative w-full" style={{ height: '220px' }}>
                  <input
                    id="property-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={saving}
                  />

                  {!imagePreview ? (
                    // No image - Blank space with pencil icon
                    <div
                      onClick={() => !saving && document.getElementById('property-image-upload').click()}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors w-full h-full flex items-center justify-center"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Pencil
                          className="w-8 h-8"
                          style={{ color: themeUtils.getTextColor(false) }}
                        />
                        <p
                          className="text-xs font-medium"
                          style={{ color: themeUtils.getTextColor(false) }}
                        >
                          Click to add image
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Image preview - Fixed height with full coverage
                    <div className="relative rounded-lg overflow-hidden border-2 w-full h-full"
                      style={{
                        borderColor: theme.headerBg || "#6366f1",
                      }}
                    >
                      {/* Image preview */}
                      <img
                        src={imagePreview}
                        alt="Property preview"
                        className="w-full h-full object-cover"
                      />

                      {/* Pencil overlay for editing */}
                      <div
                        onClick={() => !saving && document.getElementById('property-image-upload').click()}
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Pencil className="w-6 h-6 text-white" />
                          <span className="text-white text-xs font-medium">Change Image</span>
                        </div>
                      </div>

                      {/* Remove button (X) */}
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors z-10 shadow-lg"
                        disabled={saving}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              {/* Property Details Section */}
              <div>
                <h4
                  className="text-md font-semibold mb-4"
                  style={{
                    color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
                  }}
                >
                  Property Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Community Name - Dropdown */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Community Name *
                    </label>
                    <select
                      name="community_id"
                      value={form.community_id}
                      onChange={(e) => {
                        const selectedCommunity = communities.find(c => c.community_id === parseInt(e.target.value));
                        setForm({ 
                          ...form, 
                          community_id: e.target.value,
                          community_name: selectedCommunity?.community_name || ""
                        });
                      }}
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
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
                  </div>

                  {/* Property Name */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="property_name"
                      value={form.property_name}
                      onChange={(e) =>
                        setForm({ ...form, property_name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter Property name"
                      disabled={saving}
                    />
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
                      name="total_units"
                      value={form.total_units}
                      onChange={(e) =>
                        setForm({ ...form, total_units: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter total units"
                      disabled={saving}
                      min="0"
                      step="1"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter location"
                      disabled={saving}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter country"
                      disabled={saving}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter city"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <hr
                className="my-4 border-none h-px opacity-50"
                style={{ backgroundColor: themeUtils.getTextColor(true) }}
              />

              {/* Address Details Section */}
              <div>
                <h4
                  className="text-md font-semibold mb-4"
                  style={{
                    color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
                  }}
                >
                  Address Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address Line 1 */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={form.address_line1}
                      onChange={(e) =>
                        setForm({ ...form, address_line1: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter address line 1"
                      disabled={saving}
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={form.address_line2}
                      onChange={(e) =>
                        setForm({ ...form, address_line2: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter address line 2"
                      disabled={saving}
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={form.zip_code}
                      onChange={(e) =>
                        setForm({ ...form, zip_code: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter zip code"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div
            className="flex justify-end gap-4 pt-6 border-t mt-6"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <Button
              variant="danger"
              onClick={handleCancel}
              themeUtils={themeUtils}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={saving}
              disabled={saving || !form.property_name.trim()}
            >
              {saving ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EditProperty;