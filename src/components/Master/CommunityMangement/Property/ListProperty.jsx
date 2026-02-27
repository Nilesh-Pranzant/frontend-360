// pages/ListProperty/ListProperty.js
import React, { useState, useEffect, useRef } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import SearchBar from "../../../../ui/Common/SearchBar";
import RecordsPerPage from "../../../../ui/Common/RecordsPerPage";
import Table from "../../../../ui/Common/Table";
import ThreeDotsMenu from "../../../../ui/common/ThreeDotsMenu";
import CommonDialog from "../../../../ui/Common/CommonDialog";
import ViewProperty from "./ViewProperty";
import AddProperty from "./AddProperty";
import EditProperty from "./EditProperty";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import Pagination from "../../../../ui/Common/Pagination";
import { API_URL_PROPERTY } from "../../../../../config";

const ListProperty = () => {
  const { theme, themeUtils } = useTheme();
  const toast = useToast();

  // Ref to prevent double delete execution
  const deleteInProgress = useRef(false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);

  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Base URL for API
  const baseURL = API_URL_PROPERTY || "http://192.168.1.39:5000";

  /* ================= FETCH PROPERTIES ================= */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const url = search 
        ? `${baseURL}/api/properties?search=${encodeURIComponent(search)}`
        : `${baseURL}/api/properties`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // Normalize data for frontend UI
        const normalized = data.map((p) => ({
          id: p.property_id,
          property_id: p.property_id,
          PropertyName: p.property_name || "-",
          property_name: p.property_name || "-",
          communityName: p.community_name || "-",
          community_id: p.community_id,
          totalUnits: p.total_units || 0,
          total_units: p.total_units || 0,
          subscription: p.subscription || "-",
          city: p.city || "-",
          country: p.country || "-",
          location: p.location || "-",
          totalFloors: p.total_floors || 0,
          total_floors: p.total_floors || 0,
          addressLine1: p.address_line1 || "",
          address_line1: p.address_line1 || "",
          addressLine2: p.address_line2 || "",
          address_line2: p.address_line2 || "",
          zipCode: p.zip_code || "",
          zip_code: p.zip_code || "",
          property_image: p.property_image || null,
          description: p.description || "",
          is_active: p.is_active,
        }));

        setProperties(normalized);
      } else {
        console.error("Error fetching properties:", data);
        toast.error("Error", "Failed to fetch properties. Please try again.");
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Error", "Failed to load properties. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch on search change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProperties();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  /* ================= FILTER + PAGINATION ================= */
  const filteredProperty = properties; // Search is handled by API

  const paginatedProperty =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? filteredProperty
      : filteredProperty.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? 1
      : Math.ceil(filteredProperty.length / perPage);

  /* ================= ACTIONS ================= */
  const handleAdd = () => setIsAddDrawerOpen(true);

  const handleView = (property) => {
    setSelectedProperty(property);
    setIsViewDrawerOpen(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (id) => {
    // Prevent double execution
    if (deleteInProgress.current) {
      console.log("Delete already in progress, skipping...");
      return;
    }

    deleteInProgress.current = true;

    confirmDialog({
      message: "Do you want to delete this Property? This action cannot be undone.",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      accept: async () => {
        try {
          const response = await fetch(`${baseURL}/api/properties/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const result = await response.json();
          
          if (response.ok) {
            setProperties((prev) => prev.filter((p) => p.id !== id));
            toast.error("Deleted!", "Property deleted successfully.");
          } else {
            throw new Error(result.message || "Failed to delete");
          }
        } catch (err) {
          console.error("Delete Property Error:", err);
          toast.error("Error", err.message || "Failed to delete property. Please try again.");
        } finally {
          setTimeout(() => {
            deleteInProgress.current = false;
          }, 2000);
        }
      },
      reject: () => {
        deleteInProgress.current = false;
      },
      onHide: () => {
        deleteInProgress.current = false;
      }
    });
  };

  const handleRefresh = async () => {
    await fetchProperties();
    toast.success("Refreshed", "Property list updated successfully!");
  };

  const handleAddSuccess = () => {
    fetchProperties();
    setIsAddDrawerOpen(false);
    toast.success("Success", "Property added successfully!");
  };

  const handleEditSuccess = () => {
    fetchProperties();
    setIsEditDrawerOpen(false);
    toast.success("Success", "Property updated successfully!");
  };

  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Name",
      "Property Name",
      "Location",
      "City",
      "Country",
      "Total Units",
    ];

    const csv = [
      headers.join(","),
      ...filteredProperty.map((p, i) =>
        [
          i + 1,
          `"${p.communityName?.replace(/"/g, '""') || ""}"`,
          `"${p.PropertyName?.replace(/"/g, '""') || ""}"`,
          `"${p.location?.replace(/"/g, '""') || ""}"`,
          `"${p.city?.replace(/"/g, '""') || ""}"`,
          `"${p.country?.replace(/"/g, '""') || ""}"`,
          p.totalUnits || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Properties_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Export Successful", "Properties exported to CSV successfully!");
  };

  const truncateText = (text, maxLength = 20) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  /* ================= TABLE ================= */
  const tableHeaders = [
    "Sr No",
    "Community Name",
    "Property Name",
    "Location",
    "City",
    "Country",
    "Total Units",
    "Actions",
  ];

  const renderRow = (property, index) => (
    <>
      <td
        className="px-4 py-2 text-sm text-center"
        style={{ color: themeUtils.getTextColor(false) }}
      >
        {perPage === "All" || perPage === Infinity || perPage <= 0
          ? index + 1
          : (currentPage - 1) * perPage + index + 1}
      </td>

      <td
        className="px-4 py-2 text-sm text-left truncate max-w-[180px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={property.communityName || "-"}
      >
        {truncateText(property.communityName)}
      </td>

      <td
        className="px-4 py-2 text-sm text-left truncate max-w-[180px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={property.PropertyName || "-"}
      >
        {truncateText(property.PropertyName)}
      </td>

      <td
        className="px-4 py-2 text-sm text-left truncate max-w-[180px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={property.location || "-"}
      >
        {truncateText(property.location)}
      </td>

      <td
        className="px-4 py-2 text-sm text-left truncate max-w-[120px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={property.city || "-"}
      >
        {truncateText(property.city)}
      </td>

      <td
        className="px-4 py-2 text-sm text-left truncate max-w-[120px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={property.country || "-"}
      >
        {truncateText(property.country)}
      </td>

      <td
        className="px-4 py-2 text-center text-sm"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {property.totalUnits || 0}
      </td>

      <td className="px-4 py-2 text-center">
        <ThreeDotsMenu
          onView={() => handleView(property)}
          onEdit={() => handleEdit(property)}
          onDelete={() => handleDelete(property.id)}
          viewTitle="View Property"
          editTitle="Edit Property"
          deleteTitle="Delete Property"
          menuAlignment="right"
        />
      </td>
    </>
  );

  return (
    <div className="space-y-4">
      <ConfirmDialog />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-2">
        <div className="space-y-1">
          <CardTitle themeUtils={themeUtils}>Property Management</CardTitle>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <RecordsPerPage
              value={perPage}
              onChange={setPerPage}
              className="shrink-0"
            />
            <SearchBar
              placeholder="Search Property"
              value={search}
              onChange={setSearch}
              size="medium"
              className="w-full md:min-w-64"
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

      <CardContent>
        <div className="overflow-x-auto hide-scrollbar px-4 py-0">
          <div className="inline-block min-w-full align-middle">
            <Table
              headers={tableHeaders}
              data={paginatedProperty}
              renderRow={renderRow}
              loading={loading}
              emptyMessage="No properties found. Click 'Add' to create your first property."
            />
          </div>
        </div>

        {/* Use the shared Pagination component */}
        {paginatedProperty.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            themeUtils={themeUtils}
          />
        )}
      </CardContent>

      {/* Drawers / Dialogs */}
      <CommonDialog
        header="Property Details"
        visible={isViewDrawerOpen}
        onHide={() => setIsViewDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <ViewProperty
          property={selectedProperty}
          onClose={() => setIsViewDrawerOpen(false)}
          baseURL={baseURL}
        />
      </CommonDialog>

      <CommonDialog
        header="Add New Property"
        visible={isAddDrawerOpen}
        onHide={() => setIsAddDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <AddProperty
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={handleAddSuccess}
          baseURL={baseURL}
        />
      </CommonDialog>

      <CommonDialog
        header="Edit Property"
        visible={isEditDrawerOpen}
        onHide={() => setIsEditDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <EditProperty
          property={selectedProperty}
          propertyId={selectedProperty?.id}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={handleEditSuccess}
          baseURL={baseURL}
        />
      </CommonDialog>
    </div>
  );
};

export default ListProperty;