// pages/Property/ViewProperty.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
} from "../../../../ui/Common/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import { API_URL_PROPERTY } from "../../../../../config";

const ViewProperty = ({ property: propProperty, onClose, baseURL: propBaseURL }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_PROPERTY || "http://192.168.1.63:5000";

  // Check if modal/drawer mode
  const isModal = !!propProperty || !!onClose;

  // Fetch property from API
  useEffect(() => {
    const fetchProperty = async () => {
      // If in modal mode and property is passed directly, use it
      if (isModal && propProperty) {
        setProperty(propProperty);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API using ID
      const propertyId = id || propProperty?.property_id;
      
      if (!propertyId) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/properties/${propertyId}`);
        console.log("response", response.json());
        const data = await response.json();
        console.log("our data", data);

        if (response.ok) {
          setProperty(data);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to load property details");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(error.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, propProperty, isModal, baseURL]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: theme.headerBg || "#6366f1" }}
        ></div>
        <p style={{ color: themeUtils.getTextColor(true) }}>
          Loading property details...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6 text-center space-y-4">
        <p style={{ color: themeUtils.getTextColor(true) }}>
          {error || "Property not found"}
        </p>
        {!isModal && (
          <Button
            variant="primary"
            onClick={() => navigate("/community-management/Property")}
            themeUtils={themeUtils}
          >
            Back to Properties
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
    <div className={isModal ? "space-y-6" : "py-4 px-6 space-y-6"}>
      {/* Header - Hide in modal mode */}
      {!isModal && (
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <CardTitle themeUtils={themeUtils}>Property Information</CardTitle>
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

      {/* Main Content with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Building Icon or Property Image */}
        <div className="col-span-3 flex flex-col items-center">
          <div className="flex justify-center items-center mb-6 bg-[#d4e6ef] w-50 h-50 rounded-lg">
            {property.property_image ? (
              <img
                src={`${baseURL}${property.property_image}`}
                alt={property.property_name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div class="p-8 rounded-lg" style="background-color: ${theme.headerBg || '#6366f1'}20">
                      <svg class="w-32 h-32" style="color: ${theme.headerBg || '#6366f1'}" ...></svg>
                    </div>
                  `;
                }}
              />
            ) : (
              <div
                className="p-8 rounded-lg"
                style={{
                  backgroundColor: `${theme.headerBg || "#6366f1"}20`,
                }}
              >
                <Building
                  className="w-32 h-32"
                  style={{ color: theme.headerBg || "#6366f1" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: All Details */}
        <div className="col-span-9 space-y-6">
          {/* Property Information */}
          <div>
            <h4
              className="text-md font-semibold mb-4"
              style={{
                color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
              }}
            >
              Property Details
              {console.log("property", property)}
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
                  {/* {console.log("Community name",property?.communityName)} */}
                  {property?.communityName || "N/A"}
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
                  {property.property_name || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Total Units:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property.total_units || 0}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Total Floors:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property.total_floors || 0}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Location:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.location || property?.address_line1 || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  City:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.city || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Country:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.country || "UAE"}
                </p>
              </div>
            </div>
          </div>

          <hr
            className="my-4 border-none h-px opacity-50"
            style={{ backgroundColor: themeUtils.getTextColor(true) }}
          />

          {/* Address Details */}
          <div>
            <h4
              className="text-md font-semibold mb-4"
              style={{
                color: theme.mood === "Night" ? theme.navbarBg : theme.headerBg,
              }}
            >
              Address Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Address Line 1:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.address_line1 || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Address Line 2:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.address_line2 || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  Zip Code:
                </p>
                <p style={{ color: themeUtils.getTextColor(true) }}>
                  {property?.zip_code || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons in modal mode */}
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

export default ViewProperty;