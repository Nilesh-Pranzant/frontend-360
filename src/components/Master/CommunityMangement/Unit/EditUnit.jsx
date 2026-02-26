// pages/Unit/EditUnit.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

const EditUnit = ({ unit: propUnit, onClose, onSuccess, baseURL: propBaseURL }) => {
  const { themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // API data
  const [communities, setCommunities] = useState([]);
  const [properties, setProperties] = useState([]);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_UNIT || "http://192.168.1.39:5000";
  const communityBaseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";
  const propertyBaseURL = API_URL_PROPERTY || "http://192.168.1.39:5000";

  // Check if modal mode
  const isModal = !!propUnit || !!onClose;

  const [form, setForm] = useState({
    unit_id: "",
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

  // Load unit data on component mount
  useEffect(() => {
    const fetchUnit = async () => {
      const unitId = propUnit?.unit_id || propUnit?.id || location.state?.unit?.unit_id || location.state?.unit?.id || id;

      if (!unitId) {
        console.error("No unit ID available");
        toast.error("Error", "No unit ID found");
        setLoading(false);
        return;
      }

      // If we have the full unit object from props, use it directly
      if (propUnit) {
        populateForm(propUnit);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/units/${unitId}`);
        const data = await response.json();

        if (response.ok) {
          populateForm(data);
        } else {
          throw new Error(data.message || "Failed to load unit details");
        }
      } catch (error) {
        console.error("Error fetching unit:", error);
        toast.error("Error", error.message || "Failed to load unit details");
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id, propUnit, location.state, baseURL]);

  const populateForm = (unit) => {
    setForm({
      unit_id: unit.unit_id || unit.id || "",
      community_id: unit.community_id || "",
      community_name: unit.community_name || "",
      property_id: unit.property_id || "",
      property_name: unit.property_name || "",
      unit_number: unit.unit_number || "",
      customer_name: unit.customer_name || "",
      floor: unit.floor || "",
      unit_type: unit.unit_type || "",
      status: unit.status || "unsold",
      meter_number: unit.meter_number || "",
      description: unit.description || ""
    });

    // Load properties for the community
    if (unit.community_id) {
      fetchProperties(unit.community_id);
    }
  };

  // Fetch properties when community is selected
  const fetchProperties = async (communityId) => {
    if (!communityId) {
      setProperties([]);
      return;
    }

    try {
      setLoadingProperties(true);
      const response = await fetch(`${propertyBaseURL}/api/properties?community_id=${communityId}`);
      const data = await response.json();

      if (response.ok) {
        setProperties(data);
      } else {
        console.error("Error fetching properties:", data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Handle community change
  const handleCommunityChange = (communityId) => {
    const selectedCommunity = communities.find(c => c.community_id === parseInt(communityId));
    setForm({
      ...form,
      community_id: communityId,
      community_name: selectedCommunity?.community_name || "",
      property_id: "",
      property_name: ""
    });
    fetchProperties(communityId);
  };

  // Handle property change
  const handlePropertyChange = (propertyId) => {
    const selectedProperty = properties.find(p => p.property_id === parseInt(propertyId));
    setForm({
      ...form,
      property_id: propertyId,
      property_name: selectedProperty?.property_name || ""
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

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
      const response = await fetch(`${baseURL}/api/units/${form.unit_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Success", "Unit updated successfully!");

        setTimeout(() => {
          if (onSuccess) onSuccess(data);
          if (isModal && onClose) onClose();
          if (!isModal) navigate("/community-management/units", { replace: true });
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to update unit");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error", error.message || "Failed to update unit");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate("/community-management/units");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "#6366f1" }}
          ></div>
          <p className="mt-4" style={{ color: themeUtils.getTextColor(true) }}>
            Loading unit details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-2 px-4"}>
      {/* Header - Hide in Modal */}
      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between py-2">
            <CardTitle themeUtils={themeUtils}>Edit Unit</CardTitle>

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
      <CardContent>
        <div className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Community Name */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Community Name *
              </label>
              <select
                value={form.community_id}
                onChange={(e) => handleCommunityChange(e.target.value)}
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
              <select
                value={form.property_id}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={!form.community_id || saving || loadingProperties}
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Unit Number *
              </label>
              <input
                type="text"
                value={form.unit_number}
                onChange={(e) =>
                  setForm({ ...form, unit_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                placeholder="Enter unit number"
                disabled={saving}
              />
            </div>

            {/* Customer Name */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Customer Name
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) =>
                  setForm({ ...form, customer_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                placeholder="Enter customer name"
                disabled={saving}
              />
            </div>

            {/* Floor */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Floor
              </label>
              <select
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={saving}
              >
                <option value="">Select Floor</option>
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Unit Type
              </label>
              <select
                value={form.unit_type}
                onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={saving}
              >
                <option value="">Select Unit Type</option>
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={saving}
              >
                <option value="unsold">Unsold</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {/* Meter Number */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Meter Number
              </label>
              <input
                type="text"
                value={form.meter_number}
                onChange={(e) =>
                  setForm({ ...form, meter_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                placeholder="Enter meter number"
                disabled={saving}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                rows="3"
                placeholder="Enter additional details"
                disabled={saving}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex justify-end gap-4 pt-6 border-t"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={saving}
              themeUtils={themeUtils}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={saving}
              disabled={saving || !form.community_id || !form.property_id || !form.unit_number}
            >
              Update Unit
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EditUnit;