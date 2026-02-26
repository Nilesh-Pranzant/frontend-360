// pages/Unit/AddUnit.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import { API_URL_UNIT, API_URL_COMMUNITY, API_URL_PROPERTY } from "../../../../../config";

const AddUnit = ({ onClose, onSuccess, baseURL: propBaseURL }) => {
  const { themeUtils } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  // Check if modal mode
  const isModal = !!onClose;

  const [loading, setLoading] = useState(false);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // API data
  const [communities, setCommunities] = useState([]);
  const [properties, setProperties] = useState([]);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_UNIT || "http://192.168.1.39:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";
  const propertyBaseURL = API_URL_PROPERTY || "http://192.168.1.39:5000";

  const [form, setForm] = useState({
    community_id: "",
    community_name: "",
    property_id: "",
    property_name: "",
    unit_number: "",
    customer_name: "",
    floor: "",
    unit_type: "",
    status: "unsold",
    meter_number: "",
    description: ""
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

  // Fetch properties when community is selected
  useEffect(() => {
    const fetchProperties = async () => {
      if (!form.community_id) {
        setProperties([]);
        return;
      }

      try {
        setLoadingProperties(true);
        const response = await fetch(`${propertyBaseURL}/api/properties?community_id=${form.community_id}`);
        const data = await response.json();

        if (response.ok) {
          setProperties(data);
        } else {
          console.error("Error fetching properties:", data);
          toast.error("Error", "Failed to load properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Error", "Failed to load properties. Please check your connection.");
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [form.community_id, propertyBaseURL]);

  // Update community name when community ID changes
  useEffect(() => {
    if (form.community_id) {
      const selectedCommunity = communities.find(c => c.community_id === parseInt(form.community_id));
      if (selectedCommunity) {
        setForm(prev => ({ ...prev, community_name: selectedCommunity.community_name }));
      }
    }
  }, [form.community_id, communities]);

  // Update property name when property ID changes
  useEffect(() => {
    if (form.property_id) {
      const selectedProperty = properties.find(p => p.property_id === parseInt(form.property_id));
      if (selectedProperty) {
        setForm(prev => ({ ...prev, property_name: selectedProperty.property_name }));
      }
    }
  }, [form.property_id, properties]);

  const handleSubmit = async () => {
    // Validation - required fields
    if (!form.community_id) {
      toast.error("Validation Error", "Please select a community.");
      return;
    }

    if (!form.property_id) {
      toast.error("Validation Error", "Please select a property.");
      return;
    }

    if (!form.unit_number) {
      toast.error("Validation Error", "Please enter unit number.");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const unitData = {
        community_id: parseInt(form.community_id),
        property_id: parseInt(form.property_id),
        unit_number: form.unit_number,
        customer_name: form.customer_name || null,
        floor: form.floor || null,
        unit_type: form.unit_type || null,
        status: form.status || "unsold",
        meter_number: form.meter_number || null,
        description: form.description || null
      };

      // Make API call
      const response = await fetch(`${baseURL}/api/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Success", "Unit added successfully!");

        setTimeout(() => {
          if (onSuccess) onSuccess(data);
          if (isModal && onClose) onClose();
          if (!isModal) navigate("/community-management/units", { replace: true });
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to add unit");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate("/community-management/units");
    }
  };

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-2 px-4"}>
      {/* Header - Hide in Modal */}
      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between py-2">
            <CardTitle themeUtils={themeUtils}>Add New Unit</CardTitle>

            <Button
              variant="ghost"
              onClick={() => navigate("/community-management/units")}
              themeUtils={themeUtils}
            >
              <RiArrowGoBackFill />
            </Button>
          </div>
        </CardHeader>
      )}

      {/* Form */}
      <Card>
        <CardContent>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Community */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Community Name *
                </label>
                <select
                  value={form.community_id}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      community_id: e.target.value,
                      property_id: "",
                      property_name: "",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
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
              </div>

              {/* Property */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Name *
                </label>
                <select
                  value={form.property_id}
                  onChange={(e) => setForm({ ...form, property_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={!form.community_id || loading || loadingProperties}
                >
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p.property_id} value={p.property_id}>
                      {p.property_name}
                    </option>
                  ))}
                </select>
                {loadingProperties && (
                  <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                    Loading properties...
                  </p>
                )}
              </div>

              {/* Unit Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Unit Number *
                </label>
                <input
                  type="text"
                  value={form.unit_number}
                  onChange={(e) => setForm({ ...form, unit_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  placeholder="e.g., 101"
                  disabled={loading}
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  placeholder="Enter customer name (optional)"
                  disabled={loading}
                />
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Floor
                </label>
                <select
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={loading}
                >
                  <option value="">Select Floor (optional)</option>
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                  <option value="4th Floor">4th Floor</option>
                  <option value="5th Floor">5th Floor</option>
                  <option value="6th Floor">6th Floor</option>
                  <option value="7th Floor">7th Floor</option>
                  <option value="8th Floor">8th Floor</option>
                  <option value="9th Floor">9th Floor</option>
                  <option value="10th Floor">10th Floor</option>
                  <option value="11th Floor">11th Floor</option>
                  <option value="12th Floor">12th Floor</option>
                  <option value="13th Floor">13th Floor</option>
                  <option value="14th Floor">14th Floor</option>
                  <option value="15th Floor">15th Floor</option>
                  <option value="16th Floor">16th Floor</option>
                  <option value="17th Floor">17th Floor</option>
                  <option value="18th Floor">18th Floor</option>
                  <option value="19th Floor">19th Floor</option>
                  <option value="20th Floor">20th Floor</option>
                </select>
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Unit Type
                </label>
                <select
                  value={form.unit_type}
                  onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={loading}
                >
                  <option value="">Select Unit Type (optional)</option>
                  <option value="Studio">Studio</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Duplex">Duplex</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={loading}
                >
                  <option value="unsold">Unsold</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>

              {/* Meter Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meter Number
                </label>
                <input
                  type="text"
                  value={form.meter_number}
                  onChange={(e) => setForm({ ...form, meter_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  placeholder="Enter meter number (optional)"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  rows="3"
                  placeholder="Enter additional details (optional)"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading || !form.community_id || !form.property_id || !form.unit_number}
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUnit;