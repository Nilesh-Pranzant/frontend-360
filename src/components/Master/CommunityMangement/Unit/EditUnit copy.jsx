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
    floor_number: "",
    unit_type: "",
    status: "",
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
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, [communityBaseURL]);

  // Fetch properties function
  const fetchProperties = async (communityId) => {
    if (!communityId) {
      setProperties([]);
      return;
    }

    try {
      setLoadingProperties(true);
      const response = await fetch(
        `${propertyBaseURL}/api/properties/by-community/${communityId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setProperties(
          data.data.map((p) => ({
            ...p,
            property_id: Number(p.property_id),
            total_floors: Number(p.total_floors),
          }))
        );
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Load unit data on component mount
  useEffect(() => {
    const loadUnitData = async () => {
      // Get unit ID from various sources
      const unitId = propUnit?.unit_id || 
                     propUnit?.id || 
                     location.state?.unit?.unit_id || 
                     location.state?.unit?.id || 
                     id;

      if (!unitId) {
        console.error("No unit ID available");
        toast.error("Error", "No unit ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        let unitData = null;
        
        // If we have propUnit, use it directly
        if (propUnit) {
          unitData = propUnit;
        } 
        // Otherwise fetch from API
        else {
          const response = await fetch(`${baseURL}/api/units/${unitId}`);
          const result = await response.json();
          
          if (response.ok && result.success) {
            unitData = result.data;
          } else {
            throw new Error(result.message || "Failed to load unit details");
          }
        }
        
        // Populate form with unit data
        if (unitData) {
          console.log("Unit data from API:", unitData); // Debug log
          
          // Normalize status to lowercase to match select options
          const statusValue = unitData.status ? unitData.status.toLowerCase() : "unsold";
          
          console.log("Normalized status value:", statusValue); // Debug log
          
          setForm({
            unit_id: unitData.unit_id || unitData.id || "",
            community_id: unitData.community_id ? Number(unitData.community_id) : "",
            community_name: unitData.community_name || "",
            property_id: unitData.property_id ? Number(unitData.property_id) : "",
            property_name: unitData.property_name || "",
            unit_number: unitData.unit_number || "",
            customer_name: unitData.customer_name || "",
            floor_number: unitData.floor_number !== null && unitData.floor_number !== undefined ? String(unitData.floor_number) : "",
            unit_type: unitData.unit_type || "",
            status: statusValue, // Use lowercase status
            description: unitData.unit_description || unitData.description || ""
          });
          
          // Fetch properties for this community
          if (unitData.community_id) {
            await fetchProperties(unitData.community_id);
          }
        }
        
      } catch (error) {
        console.error("Error loading unit:", error);
        toast.error("Error", error.message || "Failed to load unit details");
      } finally {
        setLoading(false);
      }
    };

    loadUnitData();
  }, [id, propUnit, location.state, baseURL]);

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
    // Validation
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
      setSaving(true);

      const unitData = {
        community_id: parseInt(form.community_id),
        property_id: parseInt(form.property_id),
        unit_number: form.unit_number,
        customer_name: form.customer_name || null,
        floor_number: form.floor_number ? parseInt(form.floor_number) : null,
        unit_type: form.unit_type || null,   
        status: form.status || "unsold",
        unit_description: form.description || null
      };

      console.log("Updating unit with data:", unitData);

      const response = await fetch(`${baseURL}/api/units/${form.unit_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading unit details...</p>
        </div>
      </div>
    );
  }

  const selectedProperty = properties.find(
    (p) => Number(p.property_id) === Number(form.property_id)
  );

  const floors = Number(selectedProperty?.total_floors || 0);

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
      <Card>
        <CardContent>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Community Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Community Name *
                </label>
                <select
                  value={form.community_id}
                  onChange={(e) => handleCommunityChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={saving || loadingCommunities}
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
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Property Name *
                </label>
                <select
                  value={form.property_id}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={!form.community_id || saving || loadingProperties}
                >
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p.property_id} value={p.property_id}>
                      {p.property_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Number */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Unit Number *
                </label>
                <input
                  type="text"
                  value={form.unit_number}
                  onChange={(e) => setForm({ ...form, unit_number: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter unit number"
                  disabled={saving}
                />
              </div>

              {/* Status - Now properly shows the value */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => {
                    setForm({ 
                      ...form, 
                      status: e.target.value,
                      customer_name: e.target.value === "unsold" ? "" : form.customer_name 
                    });
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  <option value="unsold">Unsold</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>

              {/* Floor Number */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Floor Number
                </label>
                <select
                  value={form.floor_number}
                  onChange={(e) => setForm({ ...form, floor_number: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={saving || !form.property_id}
                >
                  <option value="">Select Floor</option>
                  <option value="0">Ground Floor</option>
                  {[...Array(floors)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Floor {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Unit Type
                </label>
                <select
                  value={form.unit_type}
                  onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  <option value="">Select Unit Type (optional)</option>
                  <option value="Studio">Studio</option>
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="4BHK">4 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Duplex">Duplex</option>
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter customer name"
                  disabled={saving || form.status === "unsold"}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows="3"
                  placeholder="Enter additional details"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={saving}
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
      </Card>
    </div>
  );
};

export default EditUnit;