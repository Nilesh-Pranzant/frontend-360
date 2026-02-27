// pages/Unit/UnitList.js
import React, { useState, useEffect, useRef } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import { confirmDialog } from "primereact/confirmdialog";
import SearchBar from "../../../../ui/Common/SearchBar";
import RecordsPerPage from "../../../../ui/Common/RecordsPerPage";
import Table from "../../../../ui/Common/Table";
import ThreeDotsMenu from "../../../../ui/common/ThreeDotsMenu";
import CommonDialog from "../../../../ui/Common/CommonDialog";
import Button from "../../../../ui/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../ui/Common/Card";
import Pagination from "../../../../ui/Common/Pagination";
import { API_URL_UNIT } from "../../../../../config";
import CustomConfirmDialog from "../../../../ui/common/CustomConfirmDialog"; // Import the custom component

import AddUnit from "./AddUnit";
import EditUnit from "./EditUnit";
import ViewUnit from "./ViewUnit";

const UnitList = () => {
  const { theme, themeUtils } = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // State for custom confirm dialog
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [unitToToggle, setUnitToToggle] = useState(null);

  // Modal States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [units, setUnits] = useState([]);

  // Base URL for API
  const baseURL = API_URL_UNIT || "http://192.168.1.39:5000";

  // Deduplication for toasts (prevents double messages)
  const lastShownToast = useRef({ message: "", timestamp: 0 });

  // Status change in progress flag
  const statusInProgress = useRef(false);

  const showSingleToast = (severity, summary, detail) => {
    const now = Date.now();
    const messageKey = `${severity}-${summary}-${detail}`;

    if (messageKey === lastShownToast.current.message && now - lastShownToast.current.timestamp < 1500) {
      return; // skip duplicate
    }

    lastShownToast.current = { message: messageKey, timestamp: now };
    toast.show(severity, summary, detail);
  };

  /* ================= FETCH UNITS ================= */
  const fetchUnits = async () => {
    try {
      setLoading(true);
      
      const url = search 
        ? `${baseURL}/api/units?search=${encodeURIComponent(search)}`
        : `${baseURL}/api/units`;
      
      const response = await fetch(url);
      const data = await response.json();
      // console.log("Fetched Units:", data);
      

      if (response.ok) {
        // Normalize data for frontend UI based on actual API response
        const normalized = data.map((unit) => ({
          id: unit.unit_id,
          unit_id: unit.unit_id,
          community_id: unit.community_id,
          community_name: unit.community_name || "N/A",
          property_id: unit.property_id,
          property_name: unit.property_name || "N/A",
          unit_code: unit.unit_code || "-",
          unit_number: unit.unit_number || "-",
          unit_type: unit.unit_type || "-",
          floor: unit.floor_number || "-",
          floor_number: unit.floor_number || "-",
          status: unit.status || "unsold",
          customer_name: unit.customer_name || "Customer Not Assigned",
          customer_id: unit.customer_id,
          area_sqft: unit.area_sqft || "-",
          is_occupied: unit.is_occupied || false,
          is_active: unit.is_active,
          description: unit.description || "",
        }));

        setUnits(normalized);
        console.log("Normalized Units:", normalized);
        setCurrentPage(1);
      } else {
        console.error("Error fetching units:", data);
        showSingleToast("error", "Error", "Failed to load units.");
      }
    } catch (error) {
      console.error("Error loading units:", error);
      showSingleToast("error", "Error", "Failed to load units. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch on search change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUnits();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const truncateText = (text, maxLength = 15) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusColor = (status) => {
    if (status === "sold") return "text-green-600 font-medium";
    if (status === "reserved") return "text-yellow-600 font-medium";
    return "text-red-600 font-medium";
  };

  /* ================= FILTER + PAGINATION ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, perPage]);

  const filteredUnits = units; // Search is handled by API

  const paginatedUnits =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? filteredUnits
      : filteredUnits.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? 1
      : Math.ceil(filteredUnits.length / perPage);

  /* ================= ACTIONS ================= */
  const handleAdd = () => setIsAddDrawerOpen(true);

  const handleView = (unit) => {
    setSelectedUnit(unit);
    setIsViewDrawerOpen(true);
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setIsEditDrawerOpen(true);
  };

  const handleToggleClick = (unit) => {
    if (statusInProgress.current) return;
    setUnitToToggle(unit);
    setConfirmDialogVisible(true);
  };

  const handleToggleConfirm = async () => {
    if (!unitToToggle) return;
    
    const { id, is_active: isActive } = unitToToggle;
    
    statusInProgress.current = true;
    setConfirmDialogVisible(false);
    
    try {
      // API call to delete/deactivate unit
      const response = await fetch(`${baseURL}/api/units/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state
        const updatedUnits = units.map((u) =>
          u.id === id ? { ...u, is_active: !isActive, status: !isActive ? "unsold" : u.status } : u
        );
        setUnits(updatedUnits);

        if (isActive) {
          toast.error("Success", "Unit deactivated successfully!");
        } else {
          toast.success("Success", "Unit activated successfully!");
        }
      } else {
        throw new Error(result.message || "Failed to update unit status");
      }
    } catch (err) {
      console.error("Status Change Error:", err);
      toast.error("Error", err.message || "Something went wrong while changing status");
    } finally {
      setTimeout(() => {
        statusInProgress.current = false;
        setUnitToToggle(null);
      }, 1000);
    }
  };

  const handleToggleReject = () => {
    setConfirmDialogVisible(false);
    setUnitToToggle(null);
    statusInProgress.current = false;
  };

  const handleAddSuccess = () => {
    fetchUnits();
    setIsAddDrawerOpen(false);
    toast.success("Success", "Unit added successfully!");
  };

  const handleEditSuccess = () => {
    fetchUnits();
    setIsEditDrawerOpen(false);
    toast.success("Success", "Unit updated successfully!");
  };

  const handleRefresh = async () => {
    await fetchUnits();
    toast.success("Refreshed", "Unit list updated successfully!");
  };

  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Name",
      "Property Name",
      "Unit No",
      "Customer Name",
      "Floor",
      "Unit Type",
      "Status",
    ];

    const csv = [
      headers.join(","),
      ...filteredUnits.map((unit, i) =>
        [
          i + 1,
          `"${unit.community_name?.replace(/"/g, '""') || ""}"`,
          `"${unit.property_name?.replace(/"/g, '""') || ""}"`,
          `"${unit.unit_number || ""}"`,
          `"${unit.customer_name || "Customer Not Assigned"}"`,
          `"${unit.floor || ""}"`,
          `"${unit.unit_type || ""}"`,
          `"${unit.area_sqft || ""}"`,
          `"${unit.status || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Units_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Export Successful", "Units exported to CSV successfully!");
  };

  /* ================= TABLE CONFIG ================= */
  const tableHeaders = [
    "Sr. No",
    "Community Name",
    "Property Name",
    "Unit No",
    "Customer Name",
    "Floor",
    "Unit Type",
    "Status",
    "Action",
  ];

  const renderRow = (unit, index) => {
    return (
      <>
        <td
          className="px-3 py-2 text-sm text-center"
          style={{ color: themeUtils.getTextColor(false) }}
        >
          {perPage === "All" || perPage === Infinity || perPage <= 0
            ? index + 1
            : (currentPage - 1) * perPage + index + 1}
        </td>
        <td
          className="px-3 py-2 text-sm text-left truncate max-w-[150px]"
          style={{ color: themeUtils.getTextColor(true) }}
          title={unit.community_name}
        >
          {truncateText(unit.community_name)}
        </td>
        <td
          className="px-3 py-2 text-sm text-left truncate max-w-[150px]"
          style={{ color: themeUtils.getTextColor(true) }}
          title={unit?.propertyName || unit?.property_name || "-"}
        >
          {truncateText(unit?.propertyName || unit?.property_name || "-")}
        </td>
        <td
          className="px-3 py-2 text-sm text-center"
          style={{ color: themeUtils.getTextColor(true) }}
        >
          {unit.unit_number}
        </td>
        <td
          className="px-3 py-2 text-sm text-left truncate max-w-[150px]"
          style={{ color: themeUtils.getTextColor(true) }}
          title={unit.customer_name}
        >
          {truncateText(unit.customer_name)}
        </td>
        <td
          className="px-3 py-2 text-sm text-center"
          style={{ color: themeUtils.getTextColor(true) }}
        >
          {unit.floor}
        </td>
        <td
          className="px-3 py-2 text-sm text-center"
          style={{ color: themeUtils.getTextColor(true) }}
        >
          {unit.unit_type}
        </td>
        
        <td className="px-3 py-2 text-center">
          <span className={getStatusColor(unit.status)}>
            {unit.status || "unsold"}
          </span>
        </td>
        <td className="px-3 py-2 text-center">
          <ThreeDotsMenu
            onView={() => handleView(unit)}
            onEdit={() => handleEdit(unit)}
            onDelete={() => handleToggleClick(unit)}
            viewTitle="View Unit"
            editTitle="Edit Unit"
            deleteTitle={unit.is_active ? "Deactivate Unit" : "Activate Unit"}
            menuAlignment="right"
          />
        </td>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Custom ConfirmDialog with glass effect overlay */}
      <CustomConfirmDialog
        visible={confirmDialogVisible}
        onHide={handleToggleReject}
        header="Are you sure?"
        message={unitToToggle?.is_active 
          ? "Do you want to deactivate this unit?" 
          : "Do you want to activate this unit?"}
        accept={handleToggleConfirm}
        reject={handleToggleReject}
        acceptLabel="Yes"
        rejectLabel="No"
      />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-2">
          <div className="space-y-1">
            <CardTitle themeUtils={themeUtils}>Unit List</CardTitle>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <RecordsPerPage
                value={perPage}
                onChange={setPerPage}
                className="shrink-0"
              />
              <SearchBar
                placeholder="Search units..."
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
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto hide-scrollbar -mx-4 sm:mx-0 pl-4 pr-4">
          <div className="inline-block min-w-full align-middle">
            <Table
              headers={tableHeaders}
              data={paginatedUnits}
              renderRow={renderRow}
              loading={loading}
              emptyMessage="No units found. Click 'Add' to create your first unit."
              sortable={false}
            />
          </div>
        </div>

        {paginatedUnits.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            themeUtils={themeUtils}
          />
        )}
      </CardContent>

      {/* Dialogs */}
      <CommonDialog
        header="Add New Unit"
        visible={isAddDrawerOpen}
        onHide={() => setIsAddDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <AddUnit
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={handleAddSuccess}
          baseURL={baseURL}
        />
      </CommonDialog>

      <CommonDialog
        header="Edit Unit"
        visible={isEditDrawerOpen}
        onHide={() => setIsEditDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <EditUnit
          unit={selectedUnit}
          unitId={selectedUnit?.unit_id || selectedUnit?.id}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={handleEditSuccess}
          baseURL={baseURL}
        />
      </CommonDialog>

      <CommonDialog
        header="Unit Details"
        visible={isViewDrawerOpen}
        onHide={() => setIsViewDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <ViewUnit
          unit={selectedUnit}
          onClose={() => setIsViewDrawerOpen(false)}
          baseURL={baseURL}
        />
      </CommonDialog>
    </div>
  );
};

export default UnitList;