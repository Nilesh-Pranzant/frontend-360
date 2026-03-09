import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Eye, Building, MapPin, Home, User, Phone, Hash, Calendar, Mail, Layers, Grid, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import Button from "../../../../ui/Common/Button";
import Table from "../../../../ui/Common/Table";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import CommonDialog from "../../../../ui/Common/CommonDialog";
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

  // Format contact number
  const formatContact = (contact) => {
    if (!contact) return "N/A";
    const contactStr = contact.toString();
    if (contactStr.startsWith("+971")) {
      return contactStr.substring(0, 4) + "-" + contactStr.substring(4);
    }
    if (contactStr.startsWith("971")) {
      return "+" + contactStr.substring(0, 3) + "-" + contactStr.substring(3);
    }
    return contactStr;
  };

  // Function to get status badge color and icon
  const getStatusDetails = (status) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (statusLower === "sold" || statusLower === "occupied") {
      return {
        color: "#10b981",
        bgColor: "#10b98120",
        icon: CheckCircle,
        label: status || "Occupied"
      };
    }
    if (statusLower === "reserved") {
      return {
        color: "#f59e0b",
        bgColor: "#f59e0b20",
        icon: Calendar,
        label: status || "Reserved"
      };
    }
    if (statusLower === "maintenance") {
      return {
        color: "#f59e0b",
        bgColor: "#f59e0b20",
        icon: AlertCircle,
        label: status || "Maintenance"
      };
    }
    if (statusLower === "unsold" || statusLower === "vacant") {
      return {
        color: "#ef4444",
        bgColor: "#ef444420",
        icon: XCircle,
        label: status || "Vacant"
      };
    }
    return {
      color: "#6b7280",
      bgColor: "#6b728020",
      icon: Grid,
      label: status || "Unknown"
    };
  };

  if (loading) {
    return (
      <div className={isModal ? "p-4" : "p-6"}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          ></div>
          <p style={{ color: themeUtils.getTextColor(true) }}>
            Loading unit details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !unitData) {
    const errorMessage = error || "Unit not found";
    
    if (isModal) {
      return (
        <div className="p-6 text-center">
          <p style={{ color: themeUtils.getTextColor(true) }} className="mb-4">
            {errorMessage}
          </p>
          <Button variant="danger" onClick={onClose} themeUtils={themeUtils}>
            Close
          </Button>
        </div>
      );
    }

    return (
      <div className="p-6 text-center">
        <p style={{ color: themeUtils.getTextColor(true) }} className="mb-4">
          {errorMessage}
        </p>
        <Button
          variant="danger"
          onClick={() => navigate("/community-management/units")}
          themeUtils={themeUtils}
        >
          Back to Units
        </Button>
      </div>
    );
  }

  const statusDetails = getStatusDetails(unitData.status);
  const StatusIcon = statusDetails.icon;

  return (
    <>
      <div className={isModal ? "space-y-6" : "space-y-6 py-4 px-6"}>
        {/* Header - Only show if NOT a modal */}
        {!isModal && (
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <CardTitle themeUtils={themeUtils}>
                Unit Information
              </CardTitle>
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

        {/* Main Content */}
        <div className={isModal ? "" : "bg-card rounded-lg"}>
          <div className={isModal ? "" : "p-6"}>
            {/* Status Badge at the top */}
            <div className="flex justify-end mb-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: statusDetails.bgColor,
                  color: statusDetails.color,
                  border: `1px solid ${statusDetails.color}30`,
                }}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{statusDetails.label}</span>
              </div>
            </div>

            {/* Unit Details in Card Format */}
            <div 
              className="rounded-lg border p-6 mb-6"
              style={{ 
                borderColor: themeUtils.getBorderColor(),
                backgroundColor: themeUtils.getBgColor("card")
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 pb-2 border-b"
                style={{ 
                  color: theme.headerBg || "#6366f1",
                  borderColor: themeUtils.getBorderColor() 
                }}
              >
                Unit Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community Name</p>
                      <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.community_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Building Name</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.property_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Unit Number</p>
                      <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.unit_number || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Floor</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.floor ? `Floor ${unitData.floor}` : "Ground Floor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Grid className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Unit Type</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.unit_type || "1 BHK"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Size</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.size_sqft ? `${unitData.size_sqft} sq.ft` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Customer Name</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.customer_name || "Not Assigned"}
                      </p>
                    </div>
                  </div>

                  {unitData.meter_number && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                      <div>
                        <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Meter Number</p>
                        <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                          {unitData.meter_number}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description - Full Width */}
              {unitData.description && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <p className="text-sm mb-2" style={{ color: themeUtils.getTextColor(false, true) }}>Description</p>
                  <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                    {unitData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div 
                className="rounded-lg border p-4"
                style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("card")
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.headerBg || "#6366f1"}20` }}
                  >
                    <Building className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community</p>
                    <p className="text-base font-medium truncate max-w-[150px]" style={{ color: themeUtils.getTextColor(true) }}>
                      {unitData.community_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-lg border p-4"
                style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("card")
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.headerBg || "#6366f1"}20` }}
                  >
                    <Home className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Building</p>
                    <p className="text-base font-medium truncate max-w-[150px]" style={{ color: themeUtils.getTextColor(true) }}>
                      {unitData.property_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-lg border p-4"
                style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("card")
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.headerBg || "#6366f1"}20` }}
                  >
                    <User className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Customer</p>
                    <p className="text-base font-medium truncate max-w-[150px]" style={{ color: themeUtils.getTextColor(true) }}>
                      {unitData.customer_name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            {(unitData.additional_details || unitData.notes) && (
              <div 
                className="rounded-lg border overflow-hidden"
                style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("card")
                }}
              >
                <div 
                  className="px-4 py-3 border-b"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                >
                  <h3 
                    className="text-md font-semibold"
                    style={{ color: theme.headerBg || "#6366f1" }}
                  >
                    Additional Information
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {unitData.additional_details && (
                    <div>
                      <p className="text-sm mb-1" style={{ color: themeUtils.getTextColor(false, true) }}>Additional Details</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.additional_details}
                      </p>
                    </div>
                  )}
                  
                  {unitData.notes && (
                    <div>
                      <p className="text-sm mb-1" style={{ color: themeUtils.getTextColor(false, true) }}>Notes</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {unitData.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons for Modal */}
        {isModal && (
          <div
            className="flex justify-end gap-3 pt-4 border-t mt-4"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <Button variant="danger" onClick={onClose} themeUtils={themeUtils}>
              Close
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewUnit;