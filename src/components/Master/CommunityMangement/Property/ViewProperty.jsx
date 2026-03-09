
// pages/Property/ViewProperty.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Building, MapPin, Globe, Phone, User, Home, Layers, Hash, Calendar, Mail, Map } from "lucide-react";
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
import { API_URL_PROPERTY } from "../../../../../config";

const ViewProperty = ({ propertyId, onClose, baseURL: propBaseURL }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [communityName, setCommunityName] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API
  const baseURL = propBaseURL || API_URL_PROPERTY || "http://localhost:5000";

  // Check if modal/drawer mode
  const isModal = !!onClose;

  // Fetch community name by ID
  const fetchCommunityName = async (communityId) => {
    if (!communityId) return null;
    
    try {
      const response = await fetch(`${baseURL}/api/communities/${communityId}`);
      const data = await response.json();
      
      if (response.ok) {
        const community = data.data || data;
        return community.community_name || community.communityName || "N/A";
      }
    } catch (err) {
      console.error("Error fetching community:", err);
    }
    return null;
  };

  // Fetch property from API
  useEffect(() => {
    console.log("ViewBuilding mounted");
    
    const fetchProperty = async () => {
      // Get property ID from props or URL params
      const propertyIdToUse = propertyId || id;
      
      if (!propertyIdToUse) {
        setError("Building ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching building from:", `${baseURL}/api/properties/${propertyIdToUse}`);
        
        const response = await fetch(`${baseURL}/api/properties/${propertyIdToUse}`);
        const data = await response.json();
        
        console.log("API Response:", data);

        if (response.ok) {
          const propertyData = data.data || data;
          setProperty(propertyData);
          setError(null);
          
          // Fetch community name if community_id exists
          if (propertyData.community_id) {
            const name = await fetchCommunityName(propertyData.community_id);
            setCommunityName(name);
          }
        } else {
          throw new Error(data.message || "Failed to load building details");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load building details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, id, baseURL]);

  // Fetch units for this property (mock data for now)
  useEffect(() => {
    if (!property?.property_id) {
      setUnits([]);
      return;
    }

    setLoadingUnits(true);
    
    // Mock units data - replace with actual API call when available
    setTimeout(() => {
      const mockUnits = [
        {
          id: 1,
          unit_number: "101",
          unit_type: "1 Bedroom",
          floor: 1,
          status: "Occupied",
          size_sqft: 850,
        },
        {
          id: 2,
          unit_number: "102",
          unit_type: "2 Bedroom",
          floor: 1,
          status: "Vacant",
          size_sqft: 1200,
        },
        {
          id: 3,
          unit_number: "201",
          unit_type: "1 Bedroom",
          floor: 2,
          status: "Occupied",
          size_sqft: 850,
        },
        {
          id: 4,
          unit_number: "202",
          unit_type: "Studio",
          floor: 2,
          status: "Maintenance",
          size_sqft: 650,
        },
      ];
      
      setUnits(mockUnits);
      setLoadingUnits(false);
    }, 500);
  }, [property?.property_id]);

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

  // Table headers for units
  const unitHeaders = [
    "Unit Number",
    "Unit Type",
    "Floor",
    "Size (sq.ft)",
    "Status",
    "Action",
  ];

  // Render unit row
  const renderUnitRow = (unit, index) => (
    <>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {unit.unit_number}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {unit.unit_type}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        Floor {unit.floor}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {unit.size_sqft}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        <span
          className="px-2 py-1 rounded-full text-xs"
          style={{
            backgroundColor: 
              unit.status === "Occupied" ? "#10b98120" :
              unit.status === "Vacant" ? "#6366f120" :
              "#f59e0b20",
            color:
              unit.status === "Occupied" ? "#10b981" :
              unit.status === "Vacant" ? "#6366f1" :
              "#f59e0b",
          }}
        >
          {unit.status}
        </span>
      </td>
      <td className="px-3 py-1.5 text-center">
        <button
          onClick={() => {
            console.log("View unit:", unit);
          }}
          className="transition-colors hover:opacity-80"
          style={{ color: theme.headerBg || "#6366f1" }}
          title="View Unit"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </>
  );

  if (loading) {
    return (
      <div className={isModal ? "p-4" : "p-6"}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          ></div>
          <p style={{ color: themeUtils.getTextColor(true) }}>
            Loading building details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    const errorMessage = error || "Building not found";
    
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
          onClick={() => navigate("/community-management/Property")}
          themeUtils={themeUtils}
        >
          Back to Properties
        </Button>
      </div>
    );
  }

  console.log("Building data:", property);

  return (
    <>
      <div className={isModal ? "space-y-6" : "space-y-6 py-4 px-6"}>
        {/* Header - Only show if NOT a modal */}
        {!isModal && (
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <CardTitle themeUtils={themeUtils}>
                Building Information
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => navigate("/community-management/Property")}
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
            {/* Property Image/Icon and Basic Info in Card Format */}
            <div 
              className="rounded-lg border p-6 mb-6"
              style={{ 
                borderColor: themeUtils.getBorderColor(),
                backgroundColor: themeUtils.getBgColor("card")
              }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Building Icon or Property Image */}
                <div className="md:w-1/4 flex flex-col items-center">
                  <div 
                    className="flex justify-center items-center mb-4 w-48 h-48 rounded-lg"
                    style={{
                      backgroundColor: `${theme.headerBg || "#6366f1"}10`,
                      border: `1px solid ${themeUtils.getBorderColor()}`,
                    }}
                  >
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
                      <Building
                        className="w-32 h-32"
                        style={{ color: theme.headerBg || "#6366f1" }}
                      />
                    )}
                  </div>
                  
                  {/* Property Code Badge */}
                  {property.property_code && (
                    <div className="text-center">
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: `${theme.headerBg || "#6366f1"}20`,
                          color: theme.headerBg || "#6366f1"
                        }}
                      >
                        Code: {property.property_code}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side: Property Basic Info */}
                <div className="md:w-3/4">
                  <h3 
                    className="text-lg font-semibold mb-4 pb-2 border-b"
                    style={{ 
                      color: theme.headerBg || "#6366f1",
                      borderColor: themeUtils.getBorderColor() 
                    }}
                  >
                    Building Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Building Name</p>
                          <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                            {property.property_name || "N/A"}
                          </p>
                        </div>
                      </div>

                   

                      <div className="flex items-start gap-3">
                        <Hash className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Building Code</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property.property_code || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Location</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property?.location || property?.address_line1 || "N/A"}
                          </p>
                        </div>
                      </div>

                     
                    </div>

                    {/* center Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Manager Name</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property.manager_name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Manager Contact</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {formatContact(property.manager_contact)}
                          </p>
                        </div>
                      </div>
                       <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>City, Country</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property?.city || "-"}, {property?.country || "UAE"}
                          </p>
                        </div>
                      </div>

                     
                    </div>
                     {/* right Column */}
                     <div className="space-y-4">
                        <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {communityName || `ID: ${property.community_id || "N/A"}`}
                          </p>
                        </div>
                      </div>
 <div className="flex items-start gap-3">
                        <Layers className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Total Floors</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property.total_floors || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                        <div>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Total Units</p>
                          <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                            {property.total_units || 0}
                          </p>
                        </div>
                      </div>
                     

                    
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details - Full Width */}
              {(property.address_line1 || property.address_line2) && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <p className="text-sm mb-2" style={{ color: themeUtils.getTextColor(false, true) }}>Address Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.address_line1 && (
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        <span className="text-sm opacity-70">Line 1:</span> {property.address_line1}
                      </p>
                    )}
                    {property.address_line2 && (
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        <span className="text-sm opacity-70">Line 2:</span> {property.address_line2}
                      </p>
                    )}
                  </div>
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
                    <Home className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Total Floors</p>
                    <p className="text-2xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
                      {property.total_floors || 0}
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
                    <Layers className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Total Units</p>
                    <p className="text-2xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
                      {property.total_units || 0}
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
                    <Map className="w-5 h-5" style={{ color: theme.headerBg || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Occupancy Rate</p>
                    <p className="text-2xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
                      {units.length > 0 
                        ? Math.round((units.filter(u => u.status === "Occupied").length / units.length) * 100) 
                        : 0}%
                    </p>
                  </div>
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
            <Button variant="danger" onClick={onClose} themeUtils={themeUtils}>
              Close
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewProperty;