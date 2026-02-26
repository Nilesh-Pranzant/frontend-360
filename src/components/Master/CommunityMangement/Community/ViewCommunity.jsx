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

const ViewCommunity = ({ community: propCommunity, onClose }) => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isModal = !!propCommunity;
  const communityData = propCommunity || location.state?.community;

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [error, setError] = useState(null);

  // State for nested Property View drawer
  const [isPropertyDrawerOpen, setIsPropertyDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Normalize community data
  const normalizedCommunity = communityData
    ? {
        name: communityData.community_name || communityData.name,
        location: communityData.location || "-",
        city: communityData.city || "-",
        country: communityData.country || "-",
        manager: communityData.manager_name || communityData.manager,
        contact: communityData.manager_contact || communityData.contact,
        totalProperties: communityData.total_properties || 0,
        totalUnits: communityData.total_units || 0,
        description: communityData.community_description || communityData.description,
      }
    : null;

  // Mock properties data for static demo
  useEffect(() => {
    if (!communityData?.community_id) {
      setLoadingProperties(false);
      return;
    }

    // Simulate loading properties
    setLoadingProperties(true);
    
    // Mock properties data
    setTimeout(() => {
      const mockProperties = [
        {
          id: 101,
          PropertyName: "Palm Tower A",
          totalFloors: 15,
          totalUnits: 120,
        },
        {
          id: 102,
          PropertyName: "Palm Tower B",
          totalFloors: 12,
          totalUnits: 96,
        },
        {
          id: 103,
          PropertyName: "Garden Villas",
          totalFloors: 2,
          totalUnits: 24,
        },
        {
          id: 104,
          PropertyName: "Ocean Heights",
          totalFloors: 25,
          totalUnits: 200,
        },
      ];
      
      setProperties(mockProperties);
      setLoadingProperties(false);
    }, 500);
  }, [communityData?.community_id]);

  if (!normalizedCommunity) {
    if (isModal)
      return <div className="p-4 text-center">Community not found</div>;

    return (
      <div className="p-6 text-center">
        <p style={{ color: themeUtils.getTextColor(true) }}>
          Community not found
        </p>
        <Button
          variant="danger"
          onClick={() => navigate("/community-management/communities")}
          className="mt-4"
          themeUtils={themeUtils}
        >
          Back to Communities
        </Button>
      </div>
    );
  }

  // Format contact
  const formattedContact = (contact) => {
    if (!contact) return "N/A";
    if (contact.startsWith("+971")) {
      return contact.substring(0, 4) + "-" + contact.substring(4);
    }
    return contact;
  };

  // Table headers
  const propertyHeaders = [
    "Property Name",
    "Total Floors",
    "Total Units",
    "Action",
  ];

  // Render row - with drawer open instead of navigate
  const renderPropertyRow = (proj, index) => (
    <>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.PropertyName ||
          proj.projectName ||
          proj.name ||
          "Unnamed Property"}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.totalFloors || "-"}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {proj.totalUnits || proj.totalApartments || "-"}
      </td>
      <td className="px-3 py-1.5 text-center">
        <button
          onClick={() => {
            setSelectedProperty(proj);
            setIsPropertyDrawerOpen(true);
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

        {/* Main Content - No Image */}
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
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Community Name</p>
                      <p className="text-base font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                        {normalizedCommunity.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Location</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {normalizedCommunity.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>City, Country</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {normalizedCommunity.city}, {normalizedCommunity.country}
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
                        {normalizedCommunity.manager || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Manager Contact</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {formattedContact(normalizedCommunity.contact)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 mt-0.5" style={{ color: theme.headerBg || "#6366f1" }} />
                    <div>
                      <p className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>Properties</p>
                      <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                        {normalizedCommunity.totalProperties} Properties, {normalizedCommunity.totalUnits} Units
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              {normalizedCommunity.description && normalizedCommunity.description !== "-" && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <p className="text-sm mb-2" style={{ color: themeUtils.getTextColor(false, true) }}>Description</p>
                  <p className="text-base" style={{ color: themeUtils.getTextColor(true) }}>
                    {normalizedCommunity.description}
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
                      {normalizedCommunity.totalProperties}
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
                      {normalizedCommunity.totalUnits}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property List */}
            <div 
              className="rounded-lg border p-6"
              style={{ 
                borderColor: themeUtils.getBorderColor(),
                backgroundColor: themeUtils.getBgColor("card")
              }}
            >
              <h4
                className="text-md font-semibold mb-4"
                style={{ color: theme.headerBg || "#6366f1" }}
              >
                Property List
              </h4>

              <div className="overflow-x-hidden -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table
                    headers={propertyHeaders}
                    data={properties || []}
                    renderRow={renderPropertyRow}
                    loading={loadingProperties}
                    emptyMessage={
                      loadingProperties
                        ? "Loading properties..."
                        : error
                          ? `Error: ${error}`
                          : "No properties associated with this community."
                    }
                  />
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