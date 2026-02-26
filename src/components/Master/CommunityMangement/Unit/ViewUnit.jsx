import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";

const ViewUnit = ({ unit: propUnit, onClose }) => {
  const { themeUtils, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isModal = !!propUnit || !!onClose;
  
  // Get unit data from props, location state, or use default
  const unitData = propUnit || location.state?.unit || {
    community_name: "AZIZI AURA",
    property_name: "Azizi Aura Jebel Ali",
    unit_number: "202",
    floors: "2nd Floor",
    unit_type: "2 BHK",
    occupancy_status: "OCCUPIED",
    customer_name: "John Smith",
    meter_number: "Not Assigned",
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "OCCUPIED") return "bg-green-100 text-green-800";
    if (statusUpper === "MAINTENANCE") return "bg-yellow-100 text-yellow-800";
    if (statusUpper === "VACANT") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className={isModal ? "space-y-6" : "space-y-6 py-4 px-6"}>
      {/* Header - Hide in Modal */}
      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <CardTitle themeUtils={themeUtils}>Unit Information</CardTitle>
            <Button
              variant="ghost"
              onClick={() => navigate("/community-management/units")}
              themeUtils={themeUtils}
            >
              <RiArrowGoBackFill className="w-4 h-3.5" />
            </Button>
          </div>
        </CardHeader>
      )}

      {/* Main Details Card */}
      <div className="grid grid-cols-1 gap-8">
        {/* Status Badge at the top */}
        <div className="flex justify-end">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              unitData.occupancy_status
            )}`}
          >
            {unitData.occupancy_status || "VACANT"}
          </span>
        </div>

        {/* All Details */}
        <div className="space-y-6">
          {/* Property Details */}
          <div>
            <h4
              className="text-md font-semibold mb-4"
              style={{
                color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
              }}
            >
              Property Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Community Name:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.community_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Property Name:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.property_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Unit Number:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.unit_number}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Floor:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.floors || "Ground Floor"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Unit Type:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.unit_type || "1 BHK"}
                </p>
              </div>
            </div>
          </div>

          <hr
            className="my-4 border-none h-px opacity-50"
            style={{ backgroundColor: themeUtils.getTextColor(true) }}
          />

          {/* Customer Details */}
          <div>
            <h4
              className="text-md font-semibold mb-4"
              style={{
                color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
              }}
            >
              Customer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Customer Name:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.customer_name || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>

          <hr
            className="my-4 border-none h-px opacity-50"
            style={{ backgroundColor: themeUtils.getTextColor(true) }}
          />

          {/* Meter Details */}
          <div>
            <h4
              className="text-md font-semibold mb-4"
              style={{
                color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
              }}
            >
              Meter Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Meter Number:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {unitData.meter_number || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons for Modal */}
      {isModal && (
        <div
          className="flex justify-end gap-3 pt-4 border-t mt-4"
          style={{ borderColor: themeUtils.getBorderColor() }}
        >
          <Button variant="outline" onClick={onClose} themeUtils={themeUtils}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewUnit;