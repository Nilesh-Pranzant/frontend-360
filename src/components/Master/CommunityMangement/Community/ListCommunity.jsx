import React, { useState, useEffect, useRef } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import SearchBar from "../../../../ui/Common/SearchBar";
import RecordsPerPage from "../../../../ui/Common/RecordsPerPage";
import Table from "../../../../ui/Common/Table";
import ThreeDotsMenu from "../../../../ui/common/ThreeDotsMenu";
import Button from "../../../../ui/Common/Button";
import { CardHeader, CardTitle } from "../../../../ui/Common/Card";
import CommonDialog from "../../../../ui/Common/CommonDialog";
import AddCommunity from "./AddCommunity";
import ViewCommunity from "./ViewCommunity";
import EditCommunity from "./EditCommunity";
import Pagination from "../../../../ui/Common/Pagination";
import { API_URL_COMMUNITY } from "../../../../../config";

const ListCommunity = () => {
  const { themeUtils } = useTheme();
  const toast = useToast();

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
  const [communities, setCommunities] = useState([]);

  // Base URL for images
  const baseURL = API_URL_COMMUNITY || "http://192.168.1.39:8000";

  // Fetch communities from API
  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const url = search 
        ? `${baseURL}/api/communities?search=${encodeURIComponent(search)}`
        : `${baseURL}/api/communities`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setCommunities(data);
      } else {
        console.error("Error fetching communities:", data);
        toast.error("Error", "Failed to fetch communities. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Error", "Failed to fetch communities. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch on search change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCommunities();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  /* ================= FILTER + PAGINATION LOGIC ================= */
  const filteredCommunities = communities;

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
  const handleDelete = (communityId) => {
    if (deleteInProgress.current) return;

    confirmDialog({
      message: "Do you want to delete this Community? This action cannot be undone.",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      accept: async () => {
        deleteInProgress.current = true;
        try {
          const response = await fetch(`${baseURL}/api/communities/${communityId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const result = await response.json();
          
          if (response.ok) {
            setCommunities((prev) =>
              prev.filter((c) => c.community_id !== communityId)
            );
            toast.success("Deleted!", "Community deleted successfully.");
          } else {
            throw new Error(result.message || "Failed to delete");
          }
        } catch (error) {
          console.error("Delete failed:", error);
          toast.error("Delete Failed", error.message || "Failed to delete community. Please try again.");
        } finally {
          setTimeout(() => { deleteInProgress.current = false; }, 1500);
        }
      },
      reject: () => {
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

  const handleAddSuccess = () => {
    fetchCommunities();
    setIsAddDrawerOpen(false);
    toast.success("Success", "Community added successfully!");
  };

  const handleEditSuccess = () => {
    fetchCommunities();
    setIsEditDrawerOpen(false);
    toast.success("Success", "Community updated successfully!");
  };

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Code",
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
          `"${c.community_code?.replace(/"/g, '""') || ""}"`,
          `"${c.community_name?.replace(/"/g, '""') || ""}"`,
          `"${c.location?.replace(/"/g, '""') || ""}"`,
          `"${c.city?.replace(/"/g, '""') || ""}"`,
          `"${c.country?.replace(/"/g, '""') || "UAE"}"`,
          `"${c.manager_name?.replace(/"/g, '""') || ""}"`,
          `"${c.manager_contact?.toString().replace(/"/g, '""') || ""}"`,
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

    toast.success("Export Successful", "Communities exported to CSV successfully!");
  };

  const handleRefresh = async () => {
    await fetchCommunities();
    toast.success("Refreshed", "Community list updated successfully!");
  };

  // Helper: truncate long text
  const truncateText = (text, maxLength = 15) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format phone number
  const formatManagerContact = (contact) => {
    if (!contact) return "-";
    const contactStr = contact.toString();
    if (contactStr.length === 12 && contactStr.startsWith("971")) {
      return `+${contactStr.substring(0, 3)}-${contactStr.substring(3)}`;
    }
    return contactStr;
  };

  /* ================= TABLE COLUMNS ================= */
  const tableHeaders = [
    "Sr. No",
    "Profile",
    "Community Code",
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
            src={community.profile_image 
              ? `${baseURL}${community.profile_image}` 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(community.community_name || 'Community')}&background=6366f1&color=fff&size=40&bold=true`}
            alt={community.community_name || "Community"}
            className="w-10 h-10 rounded-full object-cover border"
            style={{
              borderColor: "#6366f1",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(community.community_name || 'Community')}&background=6366f1&color=fff&size=40&bold=true`;
            }}
          />
        </div>
      </td>
      <td
        className="px-3 py-1.5 text-sm text-left truncate max-w-[150px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.community_code || "-"}
      >
        {truncateText(community.community_code)}
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
        title={community.country || "UAE"}
      >
        {truncateText(community.country || "UAE")}
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
        style={{ color: themeUtils.getTextColor(true) }}
        title={community.manager_contact?.toString() || "-"}
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
      <ConfirmDialog />

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
                variant="secondary"
                icon={RefreshCw}
                onClick={handleRefresh}
                className="whitespace-nowrap shrink-0"
                loading={loading}
              >
                Refresh
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
            emptyMessage="No communities found. Click 'Add' to create one."
          />
        </div>
      </div>

      {/* Pagination */}
      {paginatedCommunities.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
      )}

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
          onSuccess={handleAddSuccess}
          baseURL={baseURL}
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
          baseURL={baseURL}
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
          community={selectedCommunity}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={handleEditSuccess}
          baseURL={baseURL}
        />
      </CommonDialog>
    </div>
  );
};

export default ListCommunity;