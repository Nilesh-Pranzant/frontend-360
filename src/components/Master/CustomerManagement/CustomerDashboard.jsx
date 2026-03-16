
import React, { useState, useEffect } from "react";
import { Users, FileText, Home, Eye } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils.jsx";
import { useToast } from "../../../ui/common/CostumeTost.jsx";
import Card, { CardHeader, CardTitle, CardContent, StatsCard } from "../../../ui/common/Card.jsx";
import SearchBar from "../../../ui/common/SearchBar";
import RecordsPerPage from "../../../ui/common/RecordsPerPage";
import Table from "../../../ui/common/Table.jsx";
import CommonDialog from "../../../ui/common/CommonDialog";
import Pagination from "../../../ui/common/Pagination.jsx";
import Button from "../../../ui/Common/Button.jsx";

// Import API base from config (adjust path as needed)
import { API_URL_CUSTOMER } from "../../../../config.js";

const API_BASE = `${API_URL_CUSTOMER}/api`;

const CustomerDashboard = () => {
  const { themeUtils } = useTheme();
  const toast = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [handoverData, setHandoverData] = useState([]);
  const [stats, setStats] = useState([
    { icon: Home, iconBg: "#3B82F6", iconColor: "#FFFFFF", title: "Total Units", value: "0", subtitle: "Across all properties", trendLabel: "from last month" },
    { icon: Users, iconBg: "#10B981", iconColor: "#FFFFFF", title: "Total Customers", value: "0", subtitle: "Active accounts", trendLabel: "from last month" },
    { icon: FileText, iconBg: "#8B5CF6", iconColor: "#FFFFFF", title: "Total Documents", value: "0", subtitle: "Verified files", trendLabel: "from last month" }
  ]);

  const primaryText = themeUtils.getTextColor(true);
  const secondaryText = themeUtils.getTextColor(false);

  // Fetch dashboard data
const fetchDashboardData = async () => {

  setStatsLoading(true);
  setLoading(true);

  try {

    const res = await fetch(`${API_BASE}/customer-dashboard`);
    const response = await res.json();

    if (!response.success) {
      throw new Error(response.message || "Dashboard API error");
    }

    const dashboard = response?.data?.fn_get_customer_dashboard || {};

    console.log("DASHBOARD OBJECT:", dashboard);

    // STATS
    setStats(
      (dashboard.stats || []).map((stat) => ({
        icon:
          stat.icon === "Home"
            ? Home
            : stat.icon === "Users"
            ? Users
            : FileText,
        iconBg: stat.iconBg,
        iconColor: stat.iconColor,
        title: stat.title,
        value: stat.value,
        subtitle: stat.subtitle,
        trendLabel: stat.trendLabel
      }))
    );

    // TABLE
    const formatted = (dashboard.handovers || []).map((item, index) => ({
      id: item.id || index + 1,
      customerName: item.customerName || "-",
      unitNumber: item.unitNumber || "-",
      propertyName: item.propertyName || "-",
      handoverDate: item.handoverDate || "-",
      documents: item.documents || "Pending",
      status: item.status || "Pending",
      documentsList: item.documentsList || [],
      documentsFullDetails: item.documentsFullDetails || []
    }));

    setHandoverData(formatted);

  } catch (error) {

    console.error("Dashboard fetch error:", error);
    toast.error("Error", error.message || "Dashboard load failed");

  } finally {

    setStatsLoading(false);
    setLoading(false);

  }
};
  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtering
  const filteredData = handoverData.filter(row =>
    row.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedData = perPage === "All" || perPage <= 0
    ? filteredData
    : filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalPages = perPage === "All" || perPage <= 0
    ? 1
    : Math.ceil(filteredData.length / perPage);

  const openDocumentsModal = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case "Complete": return "text-green-600 bg-green-50";
      case "Partial": return "text-yellow-600 bg-yellow-50";
      case "Pending": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const tableHeaders = [
    "Customer Name",
    "Unit Number",
    "Property Name",
    "Handover Date",
    "Status",
    "Documents",
    "Action"
  ];

  const renderRow = (row, index) => (
    <>
      <td className="px-4 py-3 text-sm" style={{ color: primaryText }}>
        {row.customerName}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: secondaryText }}>
        {row.unitNumber}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: secondaryText }}>
        {row.propertyName}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: secondaryText }}>
        {row.handoverDate}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "Handed Over" ? "bg-green-100 text-green-800" :
          row.status === "In Progress" ? "bg-blue-100 text-blue-800" :
          "bg-yellow-100 text-yellow-800"
        }`}>
          {row.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(row.documents)}`}>
          {row.documents}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-center">
  {row.documents !== "Pending" && (
    <Button
      variant="ghost"
      size="sm"
      icon={Eye}
      onClick={() => openDocumentsModal(row)}
      className="text-blue-600 hover:text-blue-800"
      title="View Documents"
    >
      View
    </Button>
  )}
</td>
    </>
  );

  return (
    <div className="space-y-4 px-4 py-2">
      <CardHeader className="px-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <CardTitle themeUtils={themeUtils}>
            Customer Dashboard
          </CardTitle>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} loading={statsLoading} />
        ))}
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle style={{ color: primaryText }}>
              Handover Details
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <RecordsPerPage value={perPage} onChange={setPerPage} className="shrink-0" />
              <SearchBar
                placeholder="Search by customer name..."
                value={searchTerm}
                onChange={setSearchTerm}
                size="medium"
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="inline-block min-w-full align-middle">
              <Table
                headers={tableHeaders}
                data={paginatedData}
                renderRow={renderRow}
                loading={loading}
                emptyMessage="No handover records found."
              />
            </div>
          </div>

          {filteredData.length > 0 && (
            <div className="px-4 py-3 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm" style={{ color: secondaryText }}>
                Showing {paginatedData.length} of {filteredData.length} entries
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                themeUtils={themeUtils}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <CommonDialog
        header={`Documents - ${selectedCustomer?.customerName || ''}`}
        visible={showModal}
        onHide={() => setShowModal(false)}
        position="center"
        width="500px"
      >
        <div className="p-6">
          {selectedCustomer?.documentsList?.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Documents for {selectedCustomer.customerName} - Unit {selectedCustomer.unitNumber}
              </p>
              <ul className="divide-y border rounded-lg">
                {selectedCustomer.documentsList.map((doc, idx) => (
                  <li key={idx} className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                     <span>
                      {typeof doc === "string" ? doc : doc.name || doc.description}
                    </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No documents available for this customer.</p>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </CommonDialog>
    </div>
  );
};

export default CustomerDashboard;