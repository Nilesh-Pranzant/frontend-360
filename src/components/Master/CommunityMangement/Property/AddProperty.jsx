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
import { API_URL_PROPERTY, API_URL_COMMUNITY } from "../../../../../config";

const AddProperty = ({ onClose, onSuccess, baseURL: propBaseURL }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isModal = !!onClose;

  // Base URL for API
  const baseURL = propBaseURL || API_URL_PROPERTY || "http://192.168.1.63:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.63:5000";

  const [form, setForm] = useState({
    community_id: "",
    property_name: "",
    total_units: "",
    // address_line1: "",
    // address_line2: "",
    // country: "UAE",
    // city: "Dubai",
    // zip_code: "",
    // location: ""
  });

  const selectedCommunity = communities.find(
    (c) => c.community_id === form.community_id
  );

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);

        const response = await fetch(`${communityBaseURL}/api/communities`);
        const result = await response.json();

        if (response.ok) {
          const communityList = Array.isArray(result)
            ? result
            : result.data || [];

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
  }, [communityBaseURL]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid File Type", "Please upload a valid image file (JPG, PNG, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", "Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('property-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!form.community_id || !form.property_name) {
      toast.error("Validation Error", "Community and Property Name are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("community_id", Number(form.community_id));
      formData.append("property_name", form.property_name.trim());
      formData.append("total_units", form.total_units || "0");
      formData.append( 
        "property_code", 
        `PROP-${Date.now()}` 
        );

      if (selectedImage) {
        formData.append("property_image", selectedImage);
      }

      const response = await fetch(`${baseURL}/api/properties`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add property");
      }

      toast.success("Success", "Property added successfully!");

    } catch (err) {
      toast.error("Error", err.message);
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

                <div className="relative w-full" style={{ height: '220px' }}>
                  <input
                    id="property-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={loading}
                  />

                  {!imagePreview ? (
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
                          (Optional) PNG, JPG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 w-full h-full"
                      style={{
                        borderColor: theme.headerBg || "#6366f1",
                      }}
                    >
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors z-10 shadow-lg"
                        disabled={loading}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>

                      <img
                        src={imagePreview}
                        alt="Property preview"
                        className="w-full h-full object-cover"
                      />

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
                      name="community_id"
                      value={form.community_id}
                      onChange={(e) =>
                        setForm({ ...form, community_id: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all appearance-none"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        borderColor: themeUtils.getBorderColor(),
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

                    {/* ← Added here: Community Address display */}
                    {selectedCommunity && (
                      <div
                        className="mt-4 p-4 rounded-lg border text-sm"
                        style={{
                          borderColor: themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                          color: themeUtils.getTextColor(true),
                        }}
                      >
                        <h5 className="font-semibold mb-2">Community Address</h5>
                        <p><strong>Location:</strong> {selectedCommunity.location || "-"}</p>
                        <p><strong>City:</strong> {selectedCommunity.city || "-"}</p>
                        <p><strong>Country:</strong> {selectedCommunity.country || "-"}</p>
                      </div>
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
                      value={selectedCommunity?.location || form.location || ""}
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
                      name="address_line1"
                      value={form.address_line1 || ""}
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
                      name="address_line2"
                      value={form.address_line2 || ""}
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
                      name="zip_code"
                      value={form.zip_code || ""}
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
              disabled={loading || !form.community_id || !form.property_name}
            >
              {loading ? "Adding..." : "Submit"}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default AddProperty;