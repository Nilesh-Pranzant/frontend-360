import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Building, MapPin, Globe, Phone, User, Home, Layers } from "lucide-react";
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
import { API_URL_COMMUNITY } from "../../../../../config";

const ViewCommunity = ({ community: propCommunity, onClose }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [error, setError] = useState(null);

  const isModal = !!propCommunity;
  const communityId = propCommunity?.community_id || location.state?.communityId;

  // Base URL for API
  const baseURL = API_URL_COMMUNITY || "http://192.168.1.39:5000";

  // Fetch community details from API
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!communityId) {
        setError("Community ID not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/api/communities/${communityId}`);
        const data = await response.json();

        if (response.ok) {
          setCommunityData(data);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to load community details");
        }
      } catch (error) {
        console.error("Error fetching community:", error);
        setError(error.message || "Failed to load community details");
      } finally {
        setLoading(false);
      }
    };

    // If propCommunity is provided directly, use it
    if (propCommunity) {
      setCommunityData(propCommunity);
    } else if (communityId) {
      fetchCommunityDetails();
    } else {
      setError("Community not found");
      setLoading(false);
    }
  }, [communityId, propCommunity, baseURL]);

  // Fetch properties for this community (mock data for now - you can replace with actual API)
  useEffect(() => {
    if (!communityData?.community_id) {
      setProperties([]);
      return;
    }

    // Simulate loading properties
    setLoadingProperties(true);
    
    // Mock properties data - replace with actual API call when available
    setTimeout(() => {
      const mockProperties = [
        {
          id: 101,
          PropertyName: `${communityData.community_name} Tower A`,
          totalFloors: 15,
          totalUnits: Math.floor(communityData.total_units / 2) || 120,
        },
        {
          id: 102,
          PropertyName: `${communityData.community_name} Tower B`,
          totalFloors: 12,
          totalUnits: Math.floor(communityData.total_units / 2) || 96,
        },
      ];
      
      setProperties(mockProperties);
      setLoadingProperties(false);
    }, 500);
  }, [communityData?.community_id, communityData?.community_name, communityData?.total_units]);

  if (loading) {
    return (
      <div className={isModal ? "p-4" : "p-6"}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          ></div>
          <p style={{ color: themeUtils.getTextColor(true) }}>
            Loading community details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !communityData) {
    const errorMessage = error || "Community not found";
    
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
          onClick={() => navigate("/community-management/communities")}
          themeUtils={themeUtils}
        >
          Back to Communities
        </Button>
      </div>
    );
  }

  // Format contact
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

  // Table headers
  const propertyHeaders = [
    "Property Name",
    "Total Floors",
    "Total Units",
    "Action",
  ];

  // Render row
  const renderPropertyRow = (proj, index) => (
    <>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.PropertyName}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.totalFloors}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.totalUnits}
      </td>
      <td className="px-3 py-1.5 text-center">
        <button
          onClick={() => {
            // Handle view property - you can implement this later
            console.log("View property:", proj);
          }}
          className="transition-colors hover:opacity-80"
          style={{ color: theme.headerBg || "#6366f1" }}
          title="View Property"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </>
  );

  return (
    <>
      <div className={isModal ? "space-y-6" : "space-y-6 py-4 px-6"}>
        {/* Header - Only show if NOT a modal */}
        {!isModal && (
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <CardTitle themeUtils={themeUtils}>
                Community Information
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => navigate("/community-management/communities")}
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
            {/* Community Details in Card Format */}
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
                Community Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community Code</p>
                      <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.community_code || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community Name</p>
                      <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.community_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Location</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.location || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>City, Country</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.city || "-"}, {communityData.country || "UAE"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community Manager</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.manager_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Manager Contact</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {formatContact(communityData.manager_contact)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Properties</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {communityData.total_properties || 0} Properties, {communityData.total_units || 0} Units
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              {communityData.description && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <p className="text-sm mb-2" style={{ color: themeUtils.getTextColor(false, true) }}>Description</p>
                  <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                    {communityData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                    <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Total Properties</p>
                    <p className="text-2xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
                      {communityData.total_properties || 0}
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
                      {communityData.total_units || 0}
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

export default ViewCommunity;