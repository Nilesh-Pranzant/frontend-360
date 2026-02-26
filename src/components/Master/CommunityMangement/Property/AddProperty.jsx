// pages/Property/AddProperty.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";

const AddProperty = ({ onClose, onSuccess }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isModal = !!onClose;

  const [form, setForm] = useState({
    communityId: "",
    communityName: "",
    propertyName: "",
    totalUnits: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    zipCode: "",
    location: ""
  });

  // Static communities data
  useEffect(() => {
    const dummyCommunities = [
      { community_id: 1001, community_name: "Sunset Villas" },
      { community_id: 1002, community_name: "Oakwood Heights" },
      { community_id: 1003, community_name: "Riverside Apartments" },
      { community_id: 1004, community_name: "Meadowbrook Estates" },
      { community_id: 1005, community_name: "Palm Gardens" },
      { community_id: 1006, community_name: "Harbor View" },
    ];
    setCommunities(dummyCommunities);
  }, []);

  // Update community name when ID changes
  useEffect(() => {
    if (form.communityId) {
      const selectedCommunity = communities.find(c => c.community_id === parseInt(form.communityId));
      if (selectedCommunity) {
        setForm(prev => ({ ...prev, communityName: selectedCommunity.community_name }));
      }
    }
  }, [form.communityId, communities]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('property-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // ────────────────────────────────────────────────
  // Form submission
  // ────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Validation - only community and property name are required
    const missingFields = [];
    if (!form.communityId) missingFields.push("Community");
    if (!form.propertyName) missingFields.push("Property Name");

    if (missingFields.length > 0) {
      toast.error("Validation Error", `Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingProperties = JSON.parse(localStorage.getItem("properties") || "[]");

      let imageUrl = null;
      if (imagePreview) {
        imageUrl = imagePreview;
      }

      const newProperty = {
        id: Math.floor(Math.random() * 1000) + 100,
        property_name: form.propertyName,
        community_name: form.communityName,
        community_id: parseInt(form.communityId),
        total_units: form.totalUnits ? parseInt(form.totalUnits) : 0,
        address_line1: form.addressLine1 || "",
        address_line2: form.addressLine2 || "",
        country: form.country || "UAE",
        city: form.city || "Dubai",
        location: form.location || form.addressLine1 || "",
        zip_code: form.zipCode || "",
        subscription: "Standard",
        total_floors: 0,
        property_image: imageUrl
      };

      existingProperties.push(newProperty);
      localStorage.setItem("properties", JSON.stringify(existingProperties));

      toast.success("Success", "Property added successfully!");

      setTimeout(() => {
        if (isModal && onClose) onClose();
        if (onSuccess) onSuccess(newProperty);
        if (!isModal) navigate("/community-management/Property", { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Add property error:", err);
      toast.error("Error", err.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate("/community-management/Property");
    }
  };

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-2 px-4"}>
      {/* No AlertComponent needed with global toast */}

      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between py-2">
            <CardTitle themeUtils={themeUtils}>Add New Property</CardTitle>
            <Button
              variant="ghost"
              onClick={() => navigate("/community-management/Property")}
              themeUtils={themeUtils}
            >
              <RiArrowGoBackFill />
            </Button>
          </div>
        </CardHeader>
      )}

      <CardContent>
        <div className="space-y-6 p-2">
          {/* Main Content - Image on Left, Fields on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - Image Upload */}
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
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={loading}
                  />

                  {!imagePreview ? (
                    // Upload placeholder with fixed height
                    <div
                      onClick={() => !loading && document.getElementById('property-image-upload').click()}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors w-full h-full flex items-center justify-center"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload
                          className="w-10 h-10"
                          style={{ color: themeUtils.getTextColor(false) }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{ color: themeUtils.getTextColor(false) }}
                        >
                          Click to upload
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: themeUtils.getTextColor(false) }}
                        >
                          (Optional)
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Image preview with full coverage
                    <div className="relative rounded-lg overflow-hidden border-2 w-full h-full"
                      style={{
                        borderColor: theme.headerBg || "#6366f1",
                      }}
                    >
                      {/* Close button */}
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors z-10 shadow-lg"
                        disabled={loading}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>

                      {/* Image preview - Now using object-cover to fill completely */}
                      <img
                        src={imagePreview}
                        alt="Property preview"
                        className="w-full h-full object-cover"
                      />

                      {/* Change image overlay */}
                      <div
                        onClick={() => !loading && document.getElementById('property-image-upload').click()}
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <span className="text-white text-xs font-medium">Change</span>
                      </div>
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
                  {/* Community */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Community Name *
                    </label>
                    <select
                      name="communityId"
                      value={form.communityId}
                      onChange={(e) =>
                        setForm({ ...form, communityId: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all appearance-none"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      disabled={loading}
                    >
                      <option value="">Select Community</option>
                      {communities.map((c) => (
                        <option key={c.community_id} value={c.community_id}>
                          {c.community_name}
                        </option>
                      ))}
                    </select>
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
                      name="propertyName"
                      value={form.propertyName}
                      onChange={(e) =>
                        setForm({ ...form, propertyName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter Property name"
                      disabled={loading}
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
                      name="totalUnits"
                      value={form.totalUnits}
                      onChange={(e) =>
                        setForm({ ...form, totalUnits: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter total units"
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={(e) =>
                        setForm({ ...form, addressLine1: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter address line 1"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={(e) =>
                        setForm({ ...form, addressLine2: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter address line 2"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={(e) =>
                        setForm({ ...form, zipCode: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      placeholder="Enter zip code"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex justify-end gap-4 pt-6 border-t mt-6"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <Button variant="danger" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default AddProperty;