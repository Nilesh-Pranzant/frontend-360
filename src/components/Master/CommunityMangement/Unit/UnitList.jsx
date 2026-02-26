// pages/Unit/UnitList.js
import React, { useState, useEffect, useRef } from "react";
import { Plus, Download } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useToast } from "../../../../ui/common/CostumeTost";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
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

  // Modal States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [units, setUnits] = useState([]);

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
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);

      // Static dummy data with status as "sold" or "unsold"
      const dummyData = [
        {
          id: 1,
          community_name: "Sunset Villas",
          property_name: "Building A",
          unit_number: "101",
          customer_name: "John Smith",
          floors: "1st Floor",
          unit_type: "1 BHK",
          status: "sold",
          meter_number: "MTR001",
          property_id: 101,
          community_id: 1001,
          is_active: true
        },
        {
          id: 2,
          community_name: "Sunset Villas",
          property_name: "Building A",
          unit_number: "102",
          customer_name: "Customer Not Assigned",
          floors: "1st Floor",
          unit_type: "2 BHK",
          status: "unsold",
          meter_number: "Not Assigned",
          property_id: 101,
          community_id: 1001,
          is_active: true
        },
        {
          id: 3,
          community_name: "Sunset Villas",
          property_name: "Building B",
          unit_number: "201",
          customer_name: "Sarah Johnson",
          floors: "2nd Floor",
          unit_type: "3 BHK",
          status: "sold",
          meter_number: "MTR003",
          property_id: 102,
          community_id: 1001,
          is_active: true
        },
        {
          id: 4,
          community_name: "Oakwood Heights",
          property_name: "Tower 1",
          unit_number: "1501",
          customer_name: "Customer Not Assigned",
          floors: "15th Floor",
          unit_type: "Studio",
          status: "unsold",
          meter_number: "MTR004",
          property_id: 201,
          community_id: 1002,
          is_active: true
        },
        {
          id: 5,
          community_name: "Oakwood Heights",
          property_name: "Tower 1",
          unit_number: "1502",
          customer_name: "Michael Brown",
          floors: "15th Floor",
          unit_type: "1 BHK",
          status: "sold",
          meter_number: "MTR005",
          property_id: 201,
          community_id: 1002,
          is_active: true
        },
        {
          id: 6,
          community_name: "Oakwood Heights",
          property_name: "Tower 2",
          unit_number: "1601",
          customer_name: "Customer Not Assigned",
          floors: "16th Floor",
          unit_type: "2 BHK",
          status: "unsold",
          meter_number: "Not Assigned",
          property_id: 202,
          community_id: 1002,
          is_active: true
        },
        {
          id: 7,
          community_name: "Riverside Apartments",
          property_name: "Building C",
          unit_number: "301",
          customer_name: "Emily Davis",
          floors: "3rd Floor",
          unit_type: "3 BHK",
          status: "sold",
          meter_number: "MTR006",
          property_id: 301,
          community_id: 1003,
          is_active: true
        },
        {
          id: 8,
          community_name: "Riverside Apartments",
          property_name: "Building C",
          unit_number: "302",
          customer_name: "David Wilson",
          floors: "3rd Floor",
          unit_type: "2 BHK",
          status: "sold",
          meter_number: "MTR007",
          property_id: 301,
          community_id: 1003,
          is_active: true
        },
        {
          id: 9,
          community_name: "Riverside Apartments",
          property_name: "Building D",
          unit_number: "401",
          customer_name: "Customer Not Assigned",
          floors: "4th Floor",
          unit_type: "1 BHK",
          status: "unsold",
          meter_number: "Not Assigned",
          property_id: 302,
          community_id: 1003,
          is_active: true
        },
        {
          id: 10,
          community_name: "Meadowbrook Estates",
          property_name: "Building E",
          unit_number: "501",
          customer_name: "Customer Not Assigned",
          floors: "5th Floor",
          unit_type: "Studio",
          status: "unsold",
          meter_number: "MTR008",
          property_id: 401,
          community_id: 1004,
          is_active: true
        },
        {
          id: 11,
          community_name: "Meadowbrook Estates",
          property_name: "Building E",
          unit_number: "502",
          customer_name: "James Martinez",
          floors: "5th Floor",
          unit_type: "2 BHK",
          status: "sold",
          meter_number: "MTR009",
          property_id: 401,
          community_id: 1004,
          is_active: true
        },
        {
          id: 12,
          community_name: "Meadowbrook Estates",
          property_name: "Building F",
          unit_number: "601",
          customer_name: "Customer Not Assigned",
          floors: "6th Floor",
          unit_type: "3 BHK",
          status: "unsold",
          meter_number: "Not Assigned",
          property_id: 402,
          community_id: 1004,
          is_active: true
        },
        {
          id: 13,
          community_name: "Palm Gardens",
          property_name: "Building G",
          unit_number: "701",
          customer_name: "Patricia Garcia",
          floors: "7th Floor",
          unit_type: "1 BHK",
          status: "sold",
          meter_number: "MTR010",
          property_id: 501,
          community_id: 1005,
          is_active: true
        },
        {
          id: 14,
          community_name: "Palm Gardens",
          property_name: "Building G",
          unit_number: "702",
          customer_name: "Customer Not Assigned",
          floors: "7th Floor",
          unit_type: "2 BHK",
          status: "unsold",
          meter_number: "Not Assigned",
          property_id: 501,
          community_id: 1005,
          is_active: true
        },
        {
          id: 15,
          community_name: "Harbor View",
          property_name: "Tower A",
          unit_number: "801",
          customer_name: "Robert Taylor",
          floors: "8th Floor",
          unit_type: "3 BHK",
          status: "sold",
          meter_number: "MTR011",
          property_id: 601,
          community_id: 1006,
          is_active: true
        }
      ];

      setUnits(dummyData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading units:", error);
      showSingleToast("error", "Error", "Failed to load units.");
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= 15) return text;
    return text.substring(0, 15) + "...";
  };

  const getStatusColor = (status) => {
    if (status === "sold") return "text-green-600 font-medium";
    return "text-red-600 font-medium";
  };

  /* ================= FILTER + PAGINATION ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, perPage]);

  const filteredUnits = units.filter(
    (unit) =>
      (unit.community_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (unit.property_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (unit.unit_number || "").toString().toLowerCase().includes(search.toLowerCase()) ||
      (unit.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (unit.unit_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (unit.floors || "").toLowerCase().includes(search.toLowerCase()) ||
      (unit.status || "").toLowerCase().includes(search.toLowerCase())
  );

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

  const handleDelete = (unit) => {
    const { id, is_active: isActive } = unit;

    if (statusInProgress.current) return;
    statusInProgress.current = true;
    confirmDialog({
      message: `Do you want to ${isActive ? "deactivate" : "activate"} this unit?`,
      header: "Are you sure?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: isActive ? "p-button-danger" : "p-button-success",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: async () => {
        try {
          const updatedUnits = units.map((u) =>
            u.id === id ? { ...u, is_active: !isActive } : u
          );
          setUnits(updatedUnits);
          // Assuming localStorage is used for persistence, if not, this line can be removed or replaced with an API call
          localStorage.setItem("units", JSON.stringify(updatedUnits));

          if (isActive) {
            toast.error("Success", "Unit deactivated successfully!");
          } else {
            toast.success("Success", "Unit activated successfully!");
          }
        } catch (err) {
          console.error("Status Change Error:", err);
          toast.error("Error", "Something went wrong while changing status");
        } finally {
          setTimeout(() => {
            statusInProgress.current = false;
          }, 1000);
        }
      },
      reject: () => {
        statusInProgress.current = false;
      },
      onHide: () => {
        statusInProgress.current = false;
      }
    });
  };

  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Name",
      "Property Name",
      "Unit No",
      "Customer Name",
      "Floors",
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
          `"${unit.floors || ""}"`,
          `"${unit.unit_type || ""}"`,
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

  // No additional duplicate needed

  /* ================= TABLE CONFIG ================= */
  const tableHeaders = [
    "Sr. No",
    "Community Name",
    "Property Name",
    "Unit No",
    "Customer Name",
    "Floors",
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
          title={unit.property_name}
        >
          {truncateText(unit.property_name)}
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
          {unit.floors}
        </td>
        <td
          className="px-3 py-2 text-sm text-center"
          style={{ color: themeUtils.getTextColor(true) }}
        >
          {unit.unit_type}
        </td>
        <td className="px-3 py-2 text-center">
          <span className={getStatusColor(unit.status)}>
            {unit.status}
          </span>
        </td>
        <td className="px-3 py-2 text-center">
          <ThreeDotsMenu
            onView={() => handleView(unit)}
            onEdit={() => handleEdit(unit)}
            onDelete={() => handleDelete(unit)}
            viewTitle="View Unit"
            editTitle="Edit Unit"
            deleteTitle="Deactivate Unit"
            menuAlignment="right"
          />
        </td>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog />

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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
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
          onClose={() => {
            setIsAddDrawerOpen(false);
            fetchUnits();
          }}
          onSuccess={() => {
            setIsAddDrawerOpen(false);
            fetchUnits();
          }}
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
          onClose={() => {
            setIsEditDrawerOpen(false);
            fetchUnits();
          }}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            fetchUnits();
          }}
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
        />
      </CommonDialog>
    </div>
  );
};

export default UnitList;