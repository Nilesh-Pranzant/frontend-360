import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import { API_URL_UNIT } from "../../../../../config";

const ViewUnit = ({ unit: propUnit, onClose, baseURL: propBaseURL }) => {
  const { themeUtils, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [unitData, setUnitData] = useState(null);
  const [error, setError] = useState(null);

  const isModal = !!propUnit || !!onClose;

  // Base URL for API
  const baseURL = propBaseURL || API_URL_UNIT || "http://192.168.1.39:5000";

  // Fetch unit from API
  useEffect(() => {
    const fetchUnit = async () => {
      // If in modal mode and unit is passed directly, use it
      if (isModal && propUnit) {
        setUnitData(propUnit);
        setLoading(false);
        return;
      }

      // Get unit ID from props, location state, or URL params
      const unitId = propUnit?.unit_id || propUnit?.id || location.state?.unit?.unit_id || location.state?.unit?.id || id;

      if (!unitId) {
        setError("Unit ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/units/${unitId}`);
        const data = await response.json();

        if (response.ok) {
          setUnitData(data);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to load unit details");
        }
      } catch (error) {
        console.error("Error fetching unit:", error);
        setError(error.message || "Failed to load unit details");
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id, propUnit, location.state, isModal, baseURL]);

  // Function to get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "sold" || statusLower === "occupied") return "bg-green-100 text-green-800";
    if (statusLower === "reserved" || statusLower === "maintenance") return "bg-yellow-100 text-yellow-800";
    if (statusLower === "unsold" || statusLower === "vacant") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
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
            Loading unit details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !unitData) {
    return (
      <div className="p-6 text-center space-y-4">
        <p style={{ color: themeUtils.getTextColor(true) }}>
          {error || "Unit not found"}
        </p>
        {!isModal && (
          <Button
            variant="primary"
            onClick={() => navigate("/community-management/units")}
            themeUtils={themeUtils}
          >
            Back to Units
          </Button>
        )}
        {isModal && (
          <Button variant="outline" onClick={onClose} themeUtils={themeUtils}>
            Close
          </Button>
        )}
      </div>
    );
  }

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
              unitData.status
            )}`}
          >
            {unitData.status || "unsold"}
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
                  {unitData.community_name || "N/A"}
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
                  {unitData.property_name || "N/A"}
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
                  {unitData.unit_number || "N/A"}
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
                  {unitData.floor || "Ground Floor"}
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

          {/* Description - if exists */}
          {unitData.description && (
            <>
              <hr
                className="my-4 border-none h-px opacity-50"
                style={{ backgroundColor: themeUtils.getTextColor(true) }}
              />
              <div>
                <h4
                  className="text-md font-semibold mb-4"
                  style={{
                    color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
                  }}
                >
                  Additional Details
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start space-x-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: themeUtils.getTextColor(false, true) }}
                    >
                      Description:
                    </p>
                    <p style={{ color: themeUtils.getTextColor(true) }}>
                      {unitData.description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
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