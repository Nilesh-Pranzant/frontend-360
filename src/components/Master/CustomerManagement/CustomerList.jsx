import React, { useState, useEffect, useRef } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils.jsx";
import { useToast } from "../../../ui/common/CostumeTost.jsx";
import SearchBar from "../../../ui/common/SearchBar";
import RecordsPerPage from "../../../ui/common/RecordsPerPage";
import Table from "../../../ui/common/Table.jsx";
import ThreeDotsMenu from "../../../ui/common/ThreeDotsMenu";
import CommonDialog from "../../../ui/common/CommonDialog";
import { CardHeader, CardTitle } from "../../../ui/common/Card.jsx";
import AddCustomer from "./AddCustomer.jsx";
import ViewCustomer from "./ViewCustomer";
import EditCustomer from "./EditCustomer";
import Pagination from "../../../ui/common/Pagination.jsx";
import CustomConfirmDialog from "../../../ui/common/CustomConfirmDialog.jsx";
import Button from "../../../ui/Common/Button.jsx";

// ────────────────────────────────────────────────
// API BASE URL — using environment variable or default
// ────────────────────────────────────────────────
const API_BASE = `${import.meta.env.VITE_API_CUSTOMER_URL}/api`;
console.log("Using API Base URL:", API_BASE);

const ListCustomer = () => {
  const { themeUtils } = useTheme();
  const toast = useToast();
  const deleteInProgress = useRef(false);

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  // Fetch customers when search changes
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);

      try {
        const url = `${API_BASE}/customers?search=${encodeURIComponent(search.trim())}`;
        console.log("Fetching customers from:", url);

        const res = await fetch(url);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load customers");
        }

        // Format the customer data
        const formatted = await Promise.all((data.data || []).map(async (item) => {
          const customer = item.customer || item;
          const units = item.units || [];
          
          // Get community and building names based on unit count
          let communityName = "-";
          let buildingName = "-";
          let unitDisplay = "-";
          
          if (units.length === 1) {
            // Single unit - show actual names
            const firstUnit = units[0];
            communityName = firstUnit?.community_name || "-";
            buildingName = firstUnit?.building_name || "-";
            unitDisplay = firstUnit?.unit_number || "-";
          } else if (units.length > 1) {
            // Multiple units - show first unit + count
            const firstUnit = units[0];
            communityName = `${firstUnit?.community_name || "-"} +${units.length - 1}`;
            buildingName = `${firstUnit?.building_name || "-"} +${units.length - 1}`;
            unitDisplay = `${firstUnit?.unit_number || "-"} +${units.length - 1}`;
          }
          
          // Construct full profile picture URL
          let profilePictureUrl = null;
          if (customer.profile_picture) {
            if (customer.profile_picture.startsWith('http')) {
              profilePictureUrl = customer.profile_picture;
            } else {
              const baseUrl = API_BASE.replace('/api', '');
              profilePictureUrl = `${baseUrl}${customer.profile_picture}`;
            }
          }
          
          return {
            customer_id: customer.customer_id,
            customer_code: `C-${String(customer.customer_id).padStart(4, "0")}`,
            full_name: customer.full_name || "",
            gender: customer.gender || "-",
            email: customer.email || "",
            phone: customer.contact_number || "",
            nationality: customer.country || "-",
            country: customer.country || "-",
            city: customer.city || "-",
            address_line1: customer.address_line1 || "",
            address_line2: customer.address_line2 || "",
            community: communityName,
            property: buildingName,
            unit_count: units.length,
            unit_number: unitDisplay,
            status: customer.is_active ? "Active" : "Inactive",
            join_date: customer.joining_date
              ? new Date(customer.joining_date).toISOString().split("T")[0]
              : "-",
            profile_picture: profilePictureUrl,
            raw_units: units, // Store raw units for reference
          };
        }));

        console.log("Formatted customers:", formatted);
        setCustomers(formatted);
      } catch (err) {
        console.error("Error fetching customers:", err);
        toast.error("Error", "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search]);

  // ─── Pagination Logic ───────────────────────────────
  const filteredCustomers = customers;
  const paginatedCustomers =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? filteredCustomers
      : filteredCustomers.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? 1
      : Math.ceil(filteredCustomers.length / perPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ─── Actions ─────────────────────────────────────────
  const handleDeleteClick = (customerId) => {
    if (deleteInProgress.current) return;
    setCustomerToDelete(customerId);
    setConfirmDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    deleteInProgress.current = true;
    setConfirmDialogVisible(false);

    try {
      const res = await fetch(`${API_BASE}/customers/${customerToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Delete failed");
      }

      setCustomers((prev) => prev.filter((c) => c.customer_id !== customerToDelete));
      toast.success("Deleted!", "Customer deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error", err.message || "Failed to delete customer");
    } finally {
      deleteInProgress.current = false;
      setCustomerToDelete(null);
    }
  };

  const handleDeleteReject = () => {
    setConfirmDialogVisible(false);
    setCustomerToDelete(null);
    deleteInProgress.current = false;
  };

  const handleView = async (customer) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${customer.customer_id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCustomer(data.data);
      } else {
        setSelectedCustomer(customer);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setSelectedCustomer(customer);
    }
    setIsViewDrawerOpen(true);
  };


const handleEdit = async (customer) => {
  try {
    setLoading(true);
    console.log("Editing customer:", customer);
    
    // Fetch fresh data from API
    const res = await fetch(`${API_BASE}/customers/${customer.customer_id}`);
    const data = await res.json();
    
    if (data.success && data.data) {
      console.log("Fetched customer data for edit:", data.data);
      setSelectedCustomer(data.data);
    } else {
      // If API fails, use the customer from list
      console.log("Using list data for edit:", customer);
      setSelectedCustomer(customer);
    }
    setIsEditDrawerOpen(true);
  } catch (err) {
    console.error("Error fetching customer details:", err);
    // Still try to edit with list data
    setSelectedCustomer(customer);
    setIsEditDrawerOpen(true);
  } finally {
    setLoading(false);
  }
};

  const handleAdd = () => setIsAddDrawerOpen(true);

  const handleAddSuccess = () => {
    setSearch(search);
    setIsAddDrawerOpen(false);
    toast.success("Success", "Customer added successfully!");
  };

  const handleEditSuccess = () => {
    setSearch(search);
    setIsEditDrawerOpen(false);
    toast.success("Success", "Customer updated successfully!");
  };

  // ─── Export CSV ─────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Full Name",
      "Phone",
      "Community",
      "Property",
      "Unit Number",
      "Join Date",
    ];
    const csv = [
      headers.join(","),
      ...filteredCustomers.map((c, i) => [
        i + 1,
        `"${c.full_name?.replace(/"/g, '""') || ""}"`,
        `"${c.phone || ""}"`,
        `"${c.community?.replace(/"/g, '""') || ""}"`,
        `"${c.property?.replace(/"/g, '""') || ""}"`,
        `"${c.unit_number?.replace(/"/g, '""') || ""}"`,
        `"${c.join_date || ""}"`,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Export Successful", "Customers exported successfully!");
  };

  const handleRefresh = () => {
    setSearch("");
    toast.success("Refreshed", "Customer list refreshed.");
  };

  // Helpers
  const truncateText = (text, maxLength = 18) => {
    if (!text || typeof text !== "string") return text || "-";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("971") && cleaned.length === 12) {
      return `+${cleaned.substring(0,3)} ${cleaned.substring(3,6)} ${cleaned.substring(6)}`;
    }
    if (cleaned.startsWith("971") && cleaned.length === 9) {
      return `+971 ${cleaned.substring(3,6)} ${cleaned.substring(6)}`;
    }
    return phone;
  };

  // ─── TABLE COLUMNS ──────────────────────────────────
  const tableHeaders = [
    "Sr. No",
    "Profile",
    "Full Name",
    "Phone",
    "Community",
    "Property",
    "Unit",
    "Join Date",
    "Action",
  ];

  const renderRow = (customer, index) => (
    <>
      <td className="px-4 py-1.5 text-sm text-center" style={{ color: themeUtils.getTextColor(false) }}>
        {perPage === "All" || perPage === Infinity || perPage <= 0
          ? index + 1
          : (currentPage - 1) * perPage + index + 1}
      </td>
      <td className="px-4 py-1.5 text-center">
        <div className="flex justify-center">
          <img
            src={
              customer.profile_picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name || "User")}&background=8b5cf6&color=fff&size=40&bold=true`
            }
            alt={customer.full_name}
            className="w-10 h-10 rounded-full object-cover border"
            style={{
              borderColor: "#8b5cf6",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name || "User")}&background=8b5cf6&color=fff&size=40&bold=true`;
            }}
          />
        </div>
      </td>
      <td className="px-4 py-1.5 text-sm text-left truncate max-w-[180px]" title={customer.full_name} style={{ color: themeUtils.getTextColor(false) }}>
        {truncateText(customer.full_name)}
      </td>
      <td className="px-4 py-1.5 text-sm text-left" title={customer.phone} style={{ color: themeUtils.getTextColor(false) }}>
        {formatPhone(customer.phone)}
      </td>
      <td className="px-4 py-1.5 text-sm text-left truncate max-w-[180px]" title={customer.community} style={{ color: themeUtils.getTextColor(false) }}>
        {customer.unit_count > 0 ? (
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${customer.unit_count === 1 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            {truncateText(customer.community)}
          </span>
        ) : (
          truncateText(customer.community)
        )}
      </td>
      <td className="px-4 py-1.5 text-sm text-left truncate max-w-[160px]" title={customer.property} style={{ color: themeUtils.getTextColor(false) }}>
        {customer.unit_count > 0 ? (
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${customer.unit_count === 1 ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
            {truncateText(customer.property || "-")}
          </span>
        ) : (
          truncateText(customer.property || "-")
        )}
      </td>
      <td className="px-4 py-1.5 text-sm text-center" style={{ color: themeUtils.getTextColor(false) }}>
        {customer.unit_count > 0 ? (
          <span className={`px-2 py-1 rounded-full text-xs ${
            customer.unit_count === 1 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {customer.unit_count === 1 ? customer.unit_number : `${customer.unit_count} units`}
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-1.5 text-sm text-center" style={{ color: themeUtils.getTextColor(false) }}>
        {customer.join_date || "-"}
      </td>
      <td className="px-4 py-1.5 text-center">
        <ThreeDotsMenu
          onView={() => handleView(customer)}
          onEdit={() => handleEdit(customer)}
          onDelete={() => handleDeleteClick(customer.customer_id)}
          viewTitle="View Customer"
          editTitle="Edit Customer"
          deleteTitle="Delete Customer"
          menuAlignment="right"
        />
      </td>
    </>
  );

  return (
    <div className="space-y-4 px-4 py-2">
      <CustomConfirmDialog
        visible={confirmDialogVisible}
        onHide={handleDeleteReject}
        header="Delete Confirmation"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        accept={handleDeleteConfirm}
        reject={handleDeleteReject}
        acceptLabel="Yes, Delete"
        rejectLabel="Cancel"
      />

      {/* Header */}
      <CardHeader>
        <div className="flex flex-col xl:flex-row items-center justify-between gap-2 px-2 py-1.5">
          <div className="shrink-0">
            <CardTitle themeUtils={themeUtils}>Customer List</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <RecordsPerPage value={perPage} onChange={setPerPage} className="shrink-0" />
              <SearchBar
                placeholder="Search Customers..."
                value={search}
                onChange={setSearch}
                size="medium"
                className="w-full sm:w-64"
              />
            </div>
            <div className="flex flex-row items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <Button variant="primary" icon={Plus} onClick={handleAdd} className="whitespace-nowrap shrink-0">
                Add Customer
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
              <Button variant="success" icon={Download} onClick={exportCSV} className="whitespace-nowrap shrink-0">
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-x-auto hide-scrollbar-mx-4">
        <div className="inline-block min-w-full align-middle">
          <Table
            headers={tableHeaders}
            data={paginatedCustomers}
            renderRow={renderRow}
            loading={loading}
            emptyMessage="No customers found. Click 'Add Customer' to create one."
          />
        </div>
      </div>

      {/* Pagination */}
      {paginatedCustomers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
      )}

      {/* Drawers */}
      <CommonDialog
        header="Add New Customer"
        visible={isAddDrawerOpen}
        onHide={() => setIsAddDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <AddCustomer
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={handleAddSuccess}
        />
      </CommonDialog>

      <CommonDialog
        header="Customer Details"
        visible={isViewDrawerOpen}
        onHide={() => setIsViewDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <ViewCustomer
          customer={selectedCustomer}
          onClose={() => setIsViewDrawerOpen(false)}
        />
      </CommonDialog>

      <CommonDialog
        header="Edit Customer"
        visible={isEditDrawerOpen}
        onHide={() => setIsEditDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <EditCustomer
          customer={selectedCustomer}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={handleEditSuccess}
        />
      </CommonDialog>
    </div>
  );
};

export default ListCustomer;