// pages/ListProperty/ListProperty.js
import React, { useState, useEffect, useRef } from "react";
import { Plus, Download } from "lucide-react";
import { useTheme } from "../../../../ui/Settings/themeUtils";
import { useSweetAlert } from "../../../../ui/Common/SweetAlert";
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

const ListProperty = () => {
  const { theme, themeUtils } = useTheme();
  const { showAlert, AlertComponent } = useSweetAlert();

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

  /* ================= FETCH PROPERTIES ================= */
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Static dummy data for properties with location fields
      const dummyProperties = [
        {
          id: 101,
          property_name: "Building A",
          community_name: "Sunset Villas",
          total_units: 45,
          subscription: "Premium Plan",
          community_id: 1001,
          city: "Dubai",
          country: "UAE",
          location: "Al Furjan",
          total_floors: 5,
          address_line1: "Al Furjan",
          address_line2: "Near Ibn Battuta",
          zip_code: "12345"
        },
        {
          id: 102,
          property_name: "Building B",
          community_name: "Sunset Villas",
          total_units: 38,
          subscription: "Basic Plan",
          community_id: 1001,
          city: "Dubai",
          country: "UAE",
          location: "Al Furjan",
          total_floors: 4,
          address_line1: "Al Furjan",
          address_line2: "",
          zip_code: "12345"
        },
        {
          id: 103,
          property_name: "Building C",
          community_name: "Sunset Villas",
          total_units: 42,
          subscription: "Premium Plan",
          community_id: 1001,
          city: "Dubai",
          country: "UAE",
          location: "Al Furjan",
          total_floors: 5,
          address_line1: "Al Furjan",
          address_line2: "",
          zip_code: "12345"
        },
        {
          id: 201,
          property_name: "Tower 1",
          community_name: "Oakwood Heights",
          total_units: 72,
          subscription: "Enterprise Plan",
          community_id: 1002,
          city: "Dubai",
          country: "UAE",
          location: "Dubai Marina",
          total_floors: 12,
          address_line1: "Dubai Marina",
          address_line2: "",
          zip_code: "12346"
        },
        {
          id: 202,
          property_name: "Tower 2",
          community_name: "Oakwood Heights",
          total_units: 68,
          subscription: "Enterprise Plan",
          community_id: 1002,
          city: "Dubai",
          country: "UAE",
          location: "Dubai Marina",
          total_floors: 12,
          address_line1: "Dubai Marina",
          address_line2: "",
          zip_code: "12346"
        },
        {
          id: 203,
          property_name: "Tower 3",
          community_name: "Oakwood Heights",
          total_units: 70,
          subscription: "Premium Plan",
          community_id: 1002,
          city: "Dubai",
          country: "UAE",
          location: "Dubai Marina",
          total_floors: 10,
          address_line1: "Dubai Marina",
          address_line2: "",
          zip_code: "12346"
        },
        {
          id: 301,
          property_name: "Building C",
          community_name: "Riverside Apartments",
          total_units: 56,
          subscription: "Premium Plan",
          community_id: 1003,
          city: "Dubai",
          country: "UAE",
          location: "Business Bay",
          total_floors: 8,
          address_line1: "Business Bay",
          address_line2: "",
          zip_code: "12347"
        },
        {
          id: 302,
          property_name: "Building D",
          community_name: "Riverside Apartments",
          total_units: 48,
          subscription: "Basic Plan",
          community_id: 1003,
          city: "Dubai",
          country: "UAE",
          location: "Business Bay",
          total_floors: 6,
          address_line1: "Business Bay",
          address_line2: "",
          zip_code: "12347"
        },
        {
          id: 303,
          property_name: "Building E",
          community_name: "Riverside Apartments",
          total_units: 52,
          subscription: "Premium Plan",
          community_id: 1003,
          city: "Dubai",
          country: "UAE",
          location: "Business Bay",
          total_floors: 7,
          address_line1: "Business Bay",
          address_line2: "",
          zip_code: "12347"
        },
        {
          id: 401,
          property_name: "Building E",
          community_name: "Meadowbrook Estates",
          total_units: 48,
          subscription: "Basic Plan",
          community_id: 1004,
          city: "Dubai",
          country: "UAE",
          location: "Jumeirah Village Circle",
          total_floors: 6,
          address_line1: "Jumeirah Village Circle",
          address_line2: "",
          zip_code: "12348"
        },
        {
          id: 402,
          property_name: "Building F",
          community_name: "Meadowbrook Estates",
          total_units: 54,
          subscription: "Premium Plan",
          community_id: 1004,
          city: "Dubai",
          country: "UAE",
          location: "Jumeirah Village Circle",
          total_floors: 7,
          address_line1: "Jumeirah Village Circle",
          address_line2: "",
          zip_code: "12348"
        },
        {
          id: 403,
          property_name: "Building G",
          community_name: "Meadowbrook Estates",
          total_units: 42,
          subscription: "Basic Plan",
          community_id: 1004,
          city: "Dubai",
          country: "UAE",
          location: "Jumeirah Village Circle",
          total_floors: 5,
          address_line1: "Jumeirah Village Circle",
          address_line2: "",
          zip_code: "12348"
        },
        {
          id: 501,
          property_name: "Building A",
          community_name: "Palm Gardens",
          total_units: 60,
          subscription: "Premium Plan",
          community_id: 1005,
          city: "Abu Dhabi",
          country: "UAE",
          location: "Al Reem Island",
          total_floors: 15,
          address_line1: "Al Reem Island",
          address_line2: "",
          zip_code: "12349"
        },
        {
          id: 502,
          property_name: "Building B",
          community_name: "Palm Gardens",
          total_units: 55,
          subscription: "Basic Plan",
          community_id: 1005,
          city: "Abu Dhabi",
          country: "UAE",
          location: "Al Reem Island",
          total_floors: 12,
          address_line1: "Al Reem Island",
          address_line2: "",
          zip_code: "12349"
        },
        {
          id: 601,
          property_name: "Tower A",
          community_name: "Harbor View",
          total_units: 80,
          subscription: "Enterprise Plan",
          community_id: 1006,
          city: "Sharjah",
          country: "UAE",
          location: "Al Majaz",
          total_floors: 20,
          address_line1: "Al Majaz",
          address_line2: "",
          zip_code: "12350"
        }
      ];

      // Normalize data for frontend UI
      const normalized = dummyProperties.map((p) => ({
        id: p.id,
        PropertyName: p.property_name || "-",
        communityName: p.community_name || "-",
        totalUnits: p.total_units || "-",
        subscription: p.subscription || "-",
        community_id: p.community_id,
        city: p.city || "-",
        country: p.country || "-",
        location: p.location || "-",
        totalFloors: p.total_floors,
        addressLine1: p.address_line1,
        addressLine2: p.address_line2,
        zipCode: p.zip_code,
      }));

      setProperties(normalized);
    } catch (error) {
      console.error("Error loading properties:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: "Failed to load properties.",
        variant: "toast",
        autoClose: true,
        autoCloseTime: 2500,
        showConfirm: false,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + PAGINATION ================= */
  const filteredProperty = properties.filter(
    (p) =>
      (p.communityName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.PropertyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.country || "").toLowerCase().includes(search.toLowerCase())
  );

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

    showAlert({
      type: "warning",
      title: "Are you sure?",
      message: "Do you want to delete this Property?",
      showConfirm: true,
      confirmText: "Yes",
      showCancel: true,
      cancelText: "No",
      variant: "modal",
      onConfirm: async () => {
        try {
          // Simulate successful deletion
          setProperties((prev) => prev.filter((p) => p.id !== id));
          
          // Add a small delay to ensure modal closes before showing toast
          setTimeout(() => {
            showAlert({
              type: "success",
              title: "Deleted",
              message: "Property deleted successfully",
              autoClose: true,
              autoCloseTime: 2500,
              variant: "toast",
              showConfirm: false,
            });
          }, 100);
        } catch (err) {
          console.error("Delete Property Error:", err);
          setTimeout(() => {
            showAlert({
              type: "error",
              title: "Error",
              message: "Something went wrong",
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
          p.totalUnits || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Properties_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    showAlert({
      type: "success",
      title: "Export Successful",
      message: "Properties exported to CSV successfully!",
      autoClose: true,
      autoCloseTime: 2500,
      variant: "toast",
      showConfirm: false,
    });
  };

  const truncateText = (text) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= 20) return text;
    return text.substring(0, 20) + "...";
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
        {property.totalUnits || "-"}
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
      <AlertComponent />

     
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
              emptyMessage="No Property found. Click 'Add Property' to create your first Property."
            />
          </div>
        </div>

        {/* Use the shared Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
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
          onClose={() => {
            setIsAddDrawerOpen(false);
            fetchProperties();
          }}
          onSuccess={() => {
            setIsAddDrawerOpen(false);
            fetchProperties();
          }}
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
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            fetchProperties();
          }}
        />
      </CommonDialog>
    </div>
  );
};

export default ListProperty;