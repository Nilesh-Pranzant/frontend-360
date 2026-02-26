import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../../ui/Common/SweetAlert";
import SearchBar from "../../../../ui/Common/SearchBar";
import RecordsPerPage from "../../../../ui/Common/RecordsPerPage";
import Table from "../../../../ui/Common/Table";
import ThreeDotsMenu from "../../../../ui/common/ThreeDotsMenu";
import Button from "../../../../ui/Common/Button";
import Card, { CardHeader, CardTitle } from "../../../../ui/Common/Card";
import CommonDialog from "../../../../ui/Common/CommonDialog";
import AddCommunity from "./AddCommunity";
import ViewCommunity from "./ViewCommunity";
import EditCommunity from "./EditCommunity";
import { useLocation } from "react-router-dom";
import Pagination from "../../../../ui/Common/Pagination";

const ListCommunity = () => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useSweetAlert();
  const location = useLocation();

  // Ref to prevent double delete execution
  const deleteInProgress = useRef(false);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  
  // Static building images from free CDN sources
  const buildingImages = [
    "https://images.unsplash.com/photo-1545324418-cc1d3fa86c52?w=150&h=150&fit=crop", // Modern apartment
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=150&h=150&fit=crop", // House
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&h=150&fit=crop", // Skyscraper
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop", // Office building
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=150&h=150&fit=crop", // Apartment complex
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=150&h=150&fit=crop", // Modern building
    "https://images.unsplash.com/photo-1558882224-dda1667339bb?w=150&h=150&fit=crop", // Luxury apartment
    "https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=150&h=150&fit=crop", // Residential building
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=150&h=150&fit=crop", // High rise
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=150&h=150&fit=crop", // Modern architecture
    "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=150&h=150&fit=crop", // Building facade
    "https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=150&h=150&fit=crop", // City building
    "https://images.unsplash.com/photo-1556911220-bde9b7cb8b0d?w=150&h=150&fit=crop", // Apartment building
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=150&h=150&fit=crop", // Residential complex
    "https://images.unsplash.com/photo-1556911073-5256ac39620c?w=150&h=150&fit=crop", // Modern apartment
  ];

  // Static data for communities with building images
  const [communities, setCommunities] = useState([
    {
      community_id: 1,
      community_name: "Al Nahda",
      location: "Near Sahara Mall",
      city: "Dubai",
      country: "UAE",
      manager_name: "Ahmed Al Mansouri",
      manager_contact: "+971501234567",
      total_properties: 25,
      total_units: 120,
      profile_picture: buildingImages[1],
    },
    {
      community_id: 2,
      community_name: "Al Furjan",
      location: "Near Ibn Battuta",
      city: "Dubai",
      country: "UAE",
      manager_name: "Fatima Al Hashemi",
      manager_contact: "+971551234567",
      total_properties: 18,
      total_units: 95,
      profile_picture: buildingImages[1],
    },
    {
      community_id: 3,
      community_name: "Khalifa City A",
      location: "Near Abu Dhabi International Airport",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Khalid Al Nuaimi",
      manager_contact: "+971561234567",
      total_properties: 32,
      total_units: 210,
      profile_picture: buildingImages[2],
    },
    {
      community_id: 4,
      community_name: "Al Reem Island",
      location: "Shams Abu Dhabi",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Mariam Al Zaabi",
      manager_contact: "+971502345678",
      total_properties: 45,
      total_units: 340,
      profile_picture: buildingImages[3],
    },
    {
      community_id: 5,
      community_name: "The Greens",
      location: "Barsha Heights",
      city: "Dubai",
      country: "UAE",
      manager_name: "Omar Al Qubaisi",
      manager_contact: "+971521234567",
      total_properties: 22,
      total_units: 180,
      profile_picture: buildingImages[4],
    },
    {
      community_id: 6,
      community_name: "Al Zahia",
      location: "University City Road",
      city: "Sharjah",
      country: "UAE",
      manager_name: "Noura Al Shamsi",
      manager_contact: "+97165123456",
      total_properties: 15,
      total_units: 88,
      profile_picture: buildingImages[5],
    },
    {
      community_id: 7,
      community_name: "Al Majaz",
      location: "Corniche Road",
      city: "Sharjah",
      country: "UAE",
      manager_name: "Saeed Al Tunaiji",
      manager_contact: "+971561239876",
      total_properties: 20,
      total_units: 105,
      profile_picture: buildingImages[5],
    },
    {
      community_id: 8,
      community_name: "Al Raha Beach",
      location: "Al Raha",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Layla Al Mazrouei",
      manager_contact: "+971501238765",
      total_properties: 38,
      total_units: 275,
      profile_picture: buildingImages[5],
    },
    {
      community_id: 9,
      community_name: "Jumeirah Golf Estates",
      location: "Al Qudra Road",
      city: "Dubai",
      country: "UAE",
      manager_name: "Rashid Al Falasi",
      manager_contact: "+971551238765",
      total_properties: 12,
      total_units: 60,
      profile_picture: buildingImages[8],
    },
    {
      community_id: 10,
      community_name: "Al Ghadeer",
      location: "Dubai-Abu Dhabi Border",
      city: "Dubai",
      country: "UAE",
      manager_name: "Hessa Al Marri",
      manager_contact: "+971561239874",
      total_properties: 9,
      total_units: 45,
      profile_picture: buildingImages[9],
    },
    {
      community_id: 11,
      community_name: "Al Muneera",
      location: "Al Raha Beach",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Hamad Al Shamsi",
      manager_contact: "971501234567",
      total_properties: 14,
      total_units: 72,
      profile_picture: buildingImages[10],
    },
    {
      community_id: 12,
      community_name: "Al Bandar",
      location: "Al Raha Beach",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Amal Al Ameri",
      manager_contact: "+971561239871",
      total_properties: 16,
      total_units: 84,
      profile_picture: buildingImages[11],
    },
    {
      community_id: 13,
      community_name: "Mirdif Hills",
      location: "Mirdif",
      city: "Dubai",
      country: "UAE",
      manager_name: "Faisal Al Falasi",
      manager_contact: "+971551239871",
      total_properties: 27,
      total_units: 135,
      profile_picture: buildingImages[12],
    },
    {
      community_id: 14,
      community_name: "Al Jadaf",
      location: "Dubai Creek",
      city: "Dubai",
      country: "UAE",
      manager_name: "Mona Al Qassimi",
      manager_contact: "+971501239872",
      total_properties: 11,
      total_units: 55,
      profile_picture: buildingImages[13],
    },
    {
      community_id: 15,
      community_name: "Al Samha",
      location: "Near Abu Dhabi",
      city: "Abu Dhabi",
      country: "UAE",
      manager_name: "Sultan Al Zaabi",
      manager_contact: "+971561239873",
      total_properties: 7,
      total_units: 28,
      profile_picture: buildingImages[14],
    },
  ]);

  /* ================= FILTER + PAGINATION LOGIC ================= */
  const filteredCommunities = communities.filter((c) =>
    (c.community_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCommunities =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? filteredCommunities
      : filteredCommunities.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? 1
      : Math.ceil(filteredCommunities.length / perPage);

  /* ================= ACTIONS ================= */
  const handleDelete = async (communityId) => {
    // Prevent double execution
    if (deleteInProgress.current) {
      console.log("Delete already in progress, skipping...");
      return;
    }
    
    deleteInProgress.current = true;

    showAlert({
      type: "warning",
      title: "Are you sure?",
      message: "Do you want to delete this Community?",
      showConfirm: true,
      confirmText: "Yes",
      showCancel: true,
      cancelText: "No",
      variant: "modal",
      onConfirm: async () => {
        try {
          // Simulate delete by filtering out the community
          setCommunities((prev) =>
            prev.filter((c) => c.community_id !== communityId)
          );
          
          // Add a small delay to ensure the modal is closed before showing toast
          setTimeout(() => {
            showAlert({
              type: "success",
              title: "Success",
              message: "Community deleted successfully!",
              autoClose: true,
              autoCloseTime: 2500,
              variant: "toast",
              showConfirm: false,
            });
          }, 100);
        } catch (error) {
          console.error("Delete failed:", error);
          setTimeout(() => {
            showAlert({
              type: "error",
              title: "Error",
              message: "Failed to delete community. Please try again.",
              autoClose: true,
              autoCloseTime: 2500,
              variant: "toast",
              showConfirm: false,
            });
          }, 100);
        } finally {
          // Reset the flag after a delay
          setTimeout(() => {
            deleteInProgress.current = false;
          }, 2000);
        }
      },
      onCancel: () => {
        deleteInProgress.current = false;
      },
      onClose: () => {
        deleteInProgress.current = false;
      },
    });
  };

  const handleView = (community) => {
    setSelectedCommunity(community);
    setIsViewDrawerOpen(true);
  };

  const handleEdit = (community) => {
    setSelectedCommunity(community);
    setIsEditDrawerOpen(true);
  };

  const handleAdd = () => setIsAddDrawerOpen(true);

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Name",
      "Location",
      "City",
      "Country",
      "Community Manager",
      "Manager Contact",
      "Properties",
      "Units",
    ];

    const csv = [
      headers.join(","),
      ...filteredCommunities.map((c, i) =>
        [
          i + 1,
          `"${c.community_name?.replace(/"/g, '""') || ""}"`,
          `"${c.location?.replace(/"/g, '""') || ""}"`,
          `"${c.city?.replace(/"/g, '""') || ""}"`,
          `"${c.country?.replace(/"/g, '""') || ""}"`,
          `"${c.manager_name?.replace(/"/g, '""') || ""}"`,
          `"${c.manager_contact?.replace(/"/g, '""') || ""}"`,
          c.total_properties || 0,
          c.total_units || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `communities_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    showAlert({
      type: "success",
      title: "Export Successful",
      message: "Communities exported to CSV successfully!",
      autoClose: true,
      autoCloseTime: 2500,
      variant: "toast",
      showConfirm: false,
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate a short delay for UI feedback
    setTimeout(() => {
      setLoading(false);
      showAlert({
        type: "info",
        title: "Static Mode",
        message: "Sync is not available in static demo mode.",
        autoClose: true,
        autoCloseTime: 2000,
        variant: "toast",
        showConfirm: false,
      });
    }, 500);
  };

  // Helper: truncate long text
  const truncateText = (text) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= 15) return text;
    return text.substring(0, 15) + "...";
  };

  // Format and validate UAE-style phone number
  const formatManagerContact = (contact) => {
    if (!contact) return "-";
    const cleaned = contact.replace(/[^\d+]/g, "");
    const uaePhoneRegex = /^\+971[0-9]{9}$/;
    if (uaePhoneRegex.test(cleaned)) {
      return cleaned.substring(0, 4) + "-" + cleaned.substring(4);
    }
    return `${contact} ⚠️`;
  };

  /* ================= TABLE COLUMNS ================= */
  const tableHeaders = [
    "Sr. No",
    "Profile",
    "Community Name",
    "Location",
    "City",
    "Country",
    "Community Manager",
    "Manager Contact",
    "Properties",
    "Units",
    "Action",
  ];

  const renderRow = (community, index) => (
    <>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(false) }}
      >
        {perPage === "All" || perPage === Infinity || perPage <= 0
          ? index + 1
          : (currentPage - 1) * perPage + index + 1}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        <div className="flex justify-center">
          <img
            src={community.profile_picture}
            alt={community.community_name || "Community"}
            className="w-10 h-10 rounded-full object-cover border-2"
            style={{ 
              borderColor: theme.headerBg || "#6366f1",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(community.community_name)}&background=6366f1&color=fff&size=40&bold=true`;
            }}
          />
        </div>
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[200px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.community_name || "-"}
      >
        {truncateText(community.community_name)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[200px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.location || "-"}
      >
        {truncateText(community.location)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[150px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.city || "-"}
      >
        {truncateText(community.city)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[150px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.country || "-"}
      >
        {truncateText(community.country)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[200px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.manager_name || "-"}
      >
        {truncateText(community.manager_name)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left"
        style={{
          color:
            community.manager_contact &&
            !/^\+971[0-9]{9}$/.test(
              community.manager_contact.replace(/[^\d+]/g, "")
            )
              ? "#e53e3e"
              : themeUtils.getTextColor(true),
        }}
        title={community.manager_contact || "-"}
      >
        {formatManagerContact(community.manager_contact)}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.total_properties ?? 0}
      </td>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.total_units ?? 0}
      </td>
      <td className="px-3 py-1.5 text-center">
        <ThreeDotsMenu
          onView={() => handleView(community)}
          onEdit={() => handleEdit(community)}
          onDelete={() => handleDelete(community.community_id)}
          viewTitle="View Community"
          editTitle="Edit Community"
          deleteTitle="Delete Community"
          menuAlignment="right"
        />
      </td>
    </>
  );

  return (
    <div className="space-y-4">
      <AlertComponent />

      {/* Header */}
      <CardHeader>
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 px-4 py-2">
          <div className="shrink-0">
            <CardTitle themeUtils={themeUtils}>Community List</CardTitle>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <RecordsPerPage
                value={perPage}
                onChange={setPerPage}
                className="shrink-0"
              />
              <SearchBar
                placeholder="Search Communities"
                value={search}
                onChange={setSearch}
                size="medium"
                className="w-full sm:w-64"
              />
            </div>

            <div className="flex flex-row items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleAdd}
                className="whitespace-nowrap shrink-0"
              >
                Add
              </Button>
             
              <Button
                variant="success"
                icon={Download}
                onClick={exportCSV}
                className="whitespace-nowrap shrink-0"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 sm:mx-0 pl-4 pr-4">
        <div className="inline-block min-w-full align-middle">
          <Table
            headers={tableHeaders}
            data={paginatedCommunities}
            renderRow={renderRow}
            loading={loading}
            emptyMessage="No communities found. Click 'Add Community' to create one."
          />
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        themeUtils={themeUtils}
      />

      {/* Drawers / Dialogs */}
      <CommonDialog
        header="Add New Community"
        visible={isAddDrawerOpen}
        onHide={() => setIsAddDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <AddCommunity
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={() => {
            setIsAddDrawerOpen(false);
          }}
        />
      </CommonDialog>

      <CommonDialog
        header="Community Details"
        visible={isViewDrawerOpen}
        onHide={() => setIsViewDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <ViewCommunity
          community={selectedCommunity}
          onClose={() => setIsViewDrawerOpen(false)}
        />
      </CommonDialog>

      <CommonDialog
        header="Edit Community"
        visible={isEditDrawerOpen}
        onHide={() => setIsEditDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <EditCommunity
          communityId={selectedCommunity?.community_id}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
          }}
        />
      </CommonDialog>
    </div>
  );
};

export default ListCommunity;