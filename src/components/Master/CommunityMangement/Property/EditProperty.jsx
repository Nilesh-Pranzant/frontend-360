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

const EditProperty = ({ property: propProperty, onClose, onSuccess }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Check if modal mode
  const isModal = !!propProperty || !!onClose;

  const [form, setForm] = useState({
    communityId: "",
    communityName: "",
    propertyName: "",
    totalUnits: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    location: "",
    zipCode: ""
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

  /* ================= GET PROPERTY DATA ================= */
  useEffect(() => {
    // Get property from location state (passed during navigation)
    if (location.state?.property) {
      populateForm(location.state.property);
      setLoading(false);
    }
    // Get property from prop
    else if (propProperty) {
      populateForm(propProperty);
      setLoading(false);
    }
    // Try to get from localStorage if we have ID in URL
    else if (id) {
      loadPropertyFromStorage(id);
    } else {
      console.error("No property data available");
      toast.error("Error", "No property data found. Please go back and try again.");
      if (!isModal) navigate("/community-management/Property");
      setLoading(false);
    }
  }, [id, propProperty, location.state]);

  const loadPropertyFromStorage = (propertyId) => {
    try {
      setLoading(true);

      // Get properties from localStorage
      const existingProperties = JSON.parse(localStorage.getItem("properties") || "[]");

      // Find property by id
      const foundProperty = existingProperties.find(p => p.id === parseInt(propertyId) || p.id === propertyId);

      if (foundProperty) {
        populateForm(foundProperty);
      } else {
        console.error("Property not found in localStorage");
        toast.error("Error", "Property not found");
        if (!isModal) navigate("/community-management/Property");
      }
    } catch (error) {
      console.error("Error loading property from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (property) => {
    console.log("Populating form with property:", property);

    // Find community ID from community name
    const community = communities.find(c => c.community_name === property.community_name);

    setForm({
      communityId: community?.community_id || property.community_id || "",
      communityName: property.community_name || property.communityName || "",
      propertyName: property.property_name || property.PropertyName || "",
      totalUnits: property.total_units?.toString() || property.totalUnits?.toString() || "",
      addressLine1: property.address_line1 || property.addressLine1 || "",
      addressLine2: property.address_line2 || property.addressLine2 || "",
      country: property.country || "",
      city: property.city || "",
      location: property.location || property.address_line1 || "",
      zipCode: property.zip_code || property.zipCode || "",
    });

    // Set image preview if property has an image
    if (property.property_image) {
      setImagePreview(property.property_image);
    }
  };

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

  /* ================= UPDATE PROPERTY ================= */
  const handleSubmit = async () => {
    // Get property ID
    const propertyId =
      location.state?.property?.id ||
      location.state?.property?.property_id ||
      propProperty?.id ||
      propProperty?.property_id ||
      id;

    if (!propertyId) {
      toast.error("Error", "Property ID is missing. Please go back and try again.");
      return;
    }

    // Validate required fields (only Property Name is required)
    if (!form.propertyName.trim()) {
      toast.error("Validation Error", "Property Name is required.");
      return;
    }

    setSaving(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing properties from localStorage
      const existingProperties = JSON.parse(localStorage.getItem("properties") || "[]");

      // Find the property to update
      const propertyIndex = existingProperties.findIndex(p =>
        p.id === parseInt(propertyId) || p.id === propertyId
      );

      if (propertyIndex !== -1) {
        // Update existing property
        existingProperties[propertyIndex] = {
          ...existingProperties[propertyIndex],
          property_name: form.propertyName,
          community_name: form.communityName,
          community_id: parseInt(form.communityId) || existingProperties[propertyIndex].community_id,
          total_units: form.totalUnits ? parseInt(form.totalUnits) : 0,
          address_line1: form.addressLine1 || "",
          address_line2: form.addressLine2 || "",
          country: form.country || "UAE",
          city: form.city || "Dubai",
          location: form.location || form.addressLine1 || "",
          zip_code: form.zipCode || "",
          property_image: imagePreview || existingProperties[propertyIndex].property_image // Update image if changed
        };

        // Save back to localStorage
        localStorage.setItem("properties", JSON.stringify(existingProperties));

        toast.warn("Success", "Property updated successfully!");

        // Navigate after auto-close timeout
        setTimeout(() => {
          if (isModal && onClose) onClose();
          if (onSuccess) onSuccess();
          if (!isModal) navigate("/community-management/Property", { replace: true });
        }, 2000);
      } else {
        throw new Error("Property not found in storage");
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
      {/* No AlertComponent needed with global toast */}

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
                    accept="image/*"
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
                      {/* Image preview - Now using object-cover to fill completely */}
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
                  {/* Community Name - Display only */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Community Name
                    </label>
                    <input
                      type="text"
                      value={form.communityName || ""}
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-gray-100"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
                        color: themeUtils.getTextColor(true),
                      }}
                      disabled
                      readOnly
                    />
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
              disabled={saving}
            >
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EditProperty;