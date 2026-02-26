// pages/Unit/EditUnit.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../../ui/Common/SweetAlert";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";

const EditUnit = ({ unit: propUnit, onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { showAlert, AlertComponent } = useSweetAlert();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Static data for dropdowns
  const [communities, setCommunities] = useState([]);
  const [properties, setProperties] = useState([]);

  // Check if modal mode
  const isModal = !!propUnit || !!onClose;

  const [form, setForm] = useState({
    communityId: "",
    communityName: "",
    propertyId: "",
    propertyName: "",
    unitNumber: "",
    customerName: "",
    floors: "",
    unitType: "",
    occupancyStatus: "VACANT",
    meterNumber: "Not Assigned"
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

  // Load unit data on component mount
  useEffect(() => {
    loadUnitData();
  }, [propUnit, location.state, id]);

  const loadUnitData = () => {
    setLoading(true);
    
    // Get unit data from props, location state, or localStorage
    let unitData = null;
    
    if (propUnit) {
      unitData = propUnit;
    } else if (location.state?.unit) {
      unitData = location.state.unit;
    } else if (id) {
      // Try to get from localStorage using ID
      const existingUnits = JSON.parse(localStorage.getItem("units") || "[]");
      unitData = existingUnits.find(u => u.id === parseInt(id) || u.id === id);
    }

    if (unitData) {
      // Find community ID from community name
      const community = communities.find(c => c.community_name === unitData.community_name);
      
      setForm({
        id: unitData.id || "",
        communityId: community?.community_id || unitData.community_id || "",
        communityName: unitData.community_name || "",
        propertyId: unitData.property_id || "",
        propertyName: unitData.property_name || "",
        unitNumber: unitData.unit_number || "",
        customerName: unitData.customer_name || "",
        floors: unitData.floors || "",
        unitType: unitData.unit_type || "",
        occupancyStatus: unitData.occupancy_status || "VACANT",
        meterNumber: unitData.meter_number || "Not Assigned"
      });

      // Load properties for the community
      if (unitData.community_id || community?.community_id) {
        loadProperties(community?.community_id || unitData.community_id);
      }
    }
    
    setLoading(false);
  };

  // Load properties based on community ID
  const loadProperties = (communityId) => {
    const dummyProperties = {
      1001: [ // Sunset Villas
        { property_id: 101, property_name: "Building A", community_id: 1001 },
        { property_id: 102, property_name: "Building B", community_id: 1001 },
        { property_id: 103, property_name: "Building C", community_id: 1001 },
      ],
      1002: [ // Oakwood Heights
        { property_id: 201, property_name: "Tower 1", community_id: 1002 },
        { property_id: 202, property_name: "Tower 2", community_id: 1002 },
        { property_id: 203, property_name: "Tower 3", community_id: 1002 },
      ],
      1003: [ // Riverside Apartments
        { property_id: 301, property_name: "Building C", community_id: 1003 },
        { property_id: 302, property_name: "Building D", community_id: 1003 },
        { property_id: 303, property_name: "Building E", community_id: 1003 },
      ],
      1004: [ // Meadowbrook Estates
        { property_id: 401, property_name: "Building E", community_id: 1004 },
        { property_id: 402, property_name: "Building F", community_id: 1004 },
        { property_id: 403, property_name: "Building G", community_id: 1004 },
      ],
      1005: [ // Palm Gardens
        { property_id: 501, property_name: "Building G", community_id: 1005 },
        { property_id: 502, property_name: "Building H", community_id: 1005 },
        { property_id: 503, property_name: "Building I", community_id: 1005 },
      ],
      1006: [ // Harbor View
        { property_id: 601, property_name: "Tower A", community_id: 1006 },
        { property_id: 602, property_name: "Tower B", community_id: 1006 },
        { property_id: 603, property_name: "Tower C", community_id: 1006 },
      ],
    };

    const communityIdNum = parseInt(communityId);
    setProperties(dummyProperties[communityIdNum] || []);
  };

  // Handle community change
  const handleCommunityChange = (communityId) => {
    const selectedCommunity = communities.find(c => c.community_id === parseInt(communityId));
    setForm({ 
      ...form, 
      communityId, 
      communityName: selectedCommunity?.community_name || "",
      propertyId: "", 
      propertyName: "" 
    });
    setProperties([]);
    if (communityId) {
      loadProperties(communityId);
    }
  };

  // Handle property change
  const handlePropertyChange = (propertyId) => {
    const selectedProperty = properties.find(p => p.property_id === parseInt(propertyId));
    setForm({ 
      ...form, 
      propertyId, 
      propertyName: selectedProperty?.property_name || "" 
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing units from localStorage
      const existingUnits = JSON.parse(localStorage.getItem("units") || "[]");
      
      // Find the unit to update
      const unitIndex = existingUnits.findIndex(u => u.id === form.id);
      
      if (unitIndex !== -1) {
        // Update existing unit
        existingUnits[unitIndex] = {
          ...existingUnits[unitIndex],
          community_name: form.communityName,
          property_name: form.propertyName,
          unit_number: form.unitNumber,
          customer_name: form.customerName || "Customer Not Assigned",
          floors: form.floors || "Ground Floor",
          unit_type: form.unitType || "1 BHK",
          occupancy_status: form.occupancyStatus,
          property_id: parseInt(form.propertyId),
          community_id: parseInt(form.communityId),
          meter_number: form.meterNumber
        };
        
        // Save back to localStorage
        localStorage.setItem("units", JSON.stringify(existingUnits));

        showAlert({
          type: "success",
          title: "Success",
          message: "Unit updated successfully!",
          autoClose: true,
          autoCloseTime: 2000,
          variant: "toast",
          showConfirm: false,
        });

        // Call success callback and close
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (isModal && onClose) onClose();
          if (!isModal) navigate("/community-management/units", { replace: true });
        }, 2000);
      } else {
        throw new Error("Unit not found");
      }
      
    } catch (error) {
      console.error("Update error:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to update unit",
        autoClose: true,
        autoCloseTime: 3000,
        variant: "toast",
        showConfirm: false,
      });
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
      <div className="p-6 text-center">
        <p style={{ color: themeUtils.getTextColor(true) }}>
          Loading unit details...
        </p>
      </div>
    );
  }

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-2 px-4"}>
      <AlertComponent />

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
                Community Name
              </label>
              <select
                value={form.communityId}
                onChange={(e) => handleCommunityChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={saving}
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
                Property Name
              </label>
              <select
                value={form.propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={!form.communityId || saving}
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Unit Number
              </label>
              <input
                type="text"
                value={form.unitNumber}
                onChange={(e) =>
                  setForm({ ...form, unitNumber: e.target.value })
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
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
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

            {/* Floors */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Floor
              </label>
              <select
                value={form.floors}
                onChange={(e) => setForm({ ...form, floors: e.target.value })}
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
                value={form.unitType}
                onChange={(e) => setForm({ ...form, unitType: e.target.value })}
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

            {/* Occupancy Status */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                Occupancy Status
              </label>
              <select
                value={form.occupancyStatus}
                onChange={(e) =>
                  setForm({ ...form, occupancyStatus: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
                disabled={saving}
              >
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
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
                value={form.meterNumber}
                onChange={(e) =>
                  setForm({ ...form, meterNumber: e.target.value })
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
              disabled={saving}
            >
              Update Unit
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EditUnit