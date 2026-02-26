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

const AddUnit = ({ onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  // Check if modal mode
  const isModal = !!onClose;

  const [loading, setLoading] = useState(false);

  // Static data for dropdowns
  const [communities, setCommunities] = useState([]);
  const [properties, setProperties] = useState([]);

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
  });

  // Static communities data
  useEffect(() => {
    // Static communities data
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

  // Static properties data based on selected community
  useEffect(() => {
    if (!form.communityId) {
      setProperties([]);
      setForm(prev => ({ ...prev, propertyId: "", propertyName: "" }));
      return;
    }

    // Static properties data mapped to communities
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

    // Convert communityId to number for comparison
    const communityIdNum = parseInt(form.communityId);
    setProperties(dummyProperties[communityIdNum] || []);
    setForm(prev => ({ ...prev, propertyId: "", propertyName: "" }));
  }, [form.communityId]);

  // Update property name when property ID changes
  useEffect(() => {
    if (form.propertyId) {
      const selectedProperty = properties.find(p => p.property_id === parseInt(form.propertyId));
      if (selectedProperty) {
        setForm(prev => ({ ...prev, propertyName: selectedProperty.property_name }));
      }
    }
  }, [form.propertyId, properties]);

  // Update community name when community ID changes
  useEffect(() => {
    if (form.communityId) {
      const selectedCommunity = communities.find(c => c.community_id === parseInt(form.communityId));
      if (selectedCommunity) {
        setForm(prev => ({ ...prev, communityName: selectedCommunity.community_name }));
      }
    }
  }, [form.communityId, communities]);

  const handleSubmit = async () => {
    // Validation - only community, property, and unit number are mandatory
    if (!form.communityId) {
      toast.error("Validation Error", "Please select a community.");
      return;
    }

    if (!form.propertyId) {
      toast.error("Validation Error", "Please select a property.");
      return;
    }

    if (!form.unitNumber) {
      toast.error("Validation Error", "Please enter unit number.");
      return;
    }

    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set default values for optional fields if not provided
      const floorsValue = form.floors || "Ground Floor";
      const unitTypeValue = form.unitType || "1 BHK";
      const customerNameValue = form.customerName || "Customer Not Assigned";

      // Create new unit object with all fields
      const newUnit = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
        community_name: form.communityName,
        property_name: form.propertyName,
        unit_number: form.unitNumber,
        customer_name: customerNameValue,
        floors: floorsValue,
        unit_type: unitTypeValue,
        occupancy_status: form.occupancyStatus,
        property_id: parseInt(form.propertyId),
        community_id: parseInt(form.communityId),
        is_active: true,
        meter_number: "Not Assigned"
      };

      // Store in localStorage to persist across sessions
      const existingUnits = JSON.parse(localStorage.getItem("units") || "[]");
      existingUnits.push(newUnit);
      localStorage.setItem("units", JSON.stringify(existingUnits));

      // Show success alert
      toast.success("Success", "Unit added successfully!");

      // Call success callback and close
      setTimeout(() => {
        if (onSuccess) onSuccess(newUnit);
        if (isModal && onClose) onClose();
        if (!isModal) navigate("/community-management/units", { replace: true });
      }, 2000);

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
      {/* No AlertComponent needed with global toast */}

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
                  value={form.communityId}
                  onChange={(e) => {
                    const communityId = e.target.value;
                    setForm({
                      ...form,
                      communityId,
                      propertyId: "",
                      propertyName: "",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                >
                  <option value="">Select Community</option>
                  {communities.map((c) => (
                    <option key={c.community_id} value={c.community_id}>
                      {c.community_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Name *
                </label>
                <select
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  disabled={!form.communityId}
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
                <label className="block text-sm font-medium mb-1">
                  Unit Number *
                </label>
                <input
                  type="text"
                  value={form.unitNumber}
                  onChange={(e) => setForm({ ...form, unitNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  placeholder="e.g., 101"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                  placeholder="Enter customer name (optional)"
                />
              </div>

              {/* Floors */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Floor
                </label>
                <select
                  value={form.floors}
                  onChange={(e) => setForm({ ...form, floors: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
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
                  value={form.unitType}
                  onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
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

              {/* Occupancy Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Occupancy Status
                </label>
                <select
                  value={form.occupancyStatus}
                  onChange={(e) => setForm({ ...form, occupancyStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    color: themeUtils.getTextColor(true),
                    borderColor: themeUtils.getBorderColor(),
                  }}
                >
                  <option value="VACANT">Vacant</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
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
                disabled={loading}
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