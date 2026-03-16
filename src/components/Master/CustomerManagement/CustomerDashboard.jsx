

import React, { useState, useEffect } from "react";
import { Users, FileText, Home } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils.jsx";
import { useToast } from "../../../ui/common/CostumeTost.jsx";
import Card, { CardHeader, CardTitle, CardContent, StatsCard } from "../../../ui/common/Card.jsx";
import SearchBar from "../../../ui/common/SearchBar";
import RecordsPerPage from "../../../ui/common/RecordsPerPage";
import Table from "../../../ui/common/Table.jsx";
import CommonDialog from "../../../ui/common/CommonDialog";
import Pagination from "../../../ui/common/Pagination.jsx";
import Button from "../../../ui/Common/Button.jsx";
import ThreeDotsMenu from "../../../ui/common/ThreeDotsMenu";

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

  // Fetch dashboard data (unchanged)
  const fetchDashboardData = async () => {
    setStatsLoading(true);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/customer-dashboard`);
      const response = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Dashboard API error");
      }
      const dashboard =
        response?.data?.fn_get_customer_dashboard ||
        response?.fn_get_customer_dashboard ||
        {};
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
        }))
      );
      // TABLE
      const handovers = dashboard.handovers || [];
      const formatted = handovers.map((item, index) => ({
        id: item.id || index + 1,
        customerName: item.customerName || "-",
        unitNumber: item.unitNumber || "-",
        propertyName: item.propertyName || "-",
        handoverDate: item.handoverDate || "-",
        documents: item.documents || "Pending",
        status: item.status || "Pending",
        documentsList: item.documentsList || [],
        documentsFullDetails: item.documentsFullDetails || []   // <-- full details with URLs
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

  useEffect(() => {
    setCurrentPage(1);
  }, [perPage]);

  // Filtering
  const filteredData = handoverData.filter(row =>
    row.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic (same as ListCommunity)
  const paginatedData =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? filteredData
      : filteredData.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
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

  // Helper to render document preview based on type/url
  const renderDocumentPreview = (doc) => {
    // If doc is a string (fallback), show as plain text
    if (typeof doc === 'string') {
      return (
        <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
          <FileText size={20} className="text-blue-500" />
          <span className="text-sm text-gray-700">{doc}</span>
          <span className="text-xs text-gray-400 ml-auto">(preview not available)</span>
        </div>
      );
    }

    // If doc has a url, try to preview
    if (doc.url) {
      const fileExtension = doc.url.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
      const isPdf = fileExtension === 'pdf';

      return (
        <div className="space-y-1 border rounded p-2">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{doc.name || 'Document'}</span>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline ml-auto"
            >
              Open
            </a>
          </div>
          {isImage && (
            <img
              src={doc.url}
              alt={doc.name}
              className="max-h-40 max-w-full object-contain border rounded"
            />
          )}
          {isPdf && (
            <iframe
              src={doc.url}
              title={doc.name}
              className="w-full h-40 border rounded"
            />
          )}
        </div>
      );
    }

    // Fallback: show just the name
    return (
      <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
        <FileText size={20} className="text-blue-500" />
        <span className="text-sm text-gray-700">{doc.name || doc}</span>
      </div>
    );
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
      <td className="px-4 py-3 text-sm" style={{ color: secondaryText }}>
        <span>
          {row.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(row.documents)}`}>
          {row.documents}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-center">
        {/* Only show menu if documents exist */}
        {row.documents !== "Pending" && (
          <ThreeDotsMenu
            onView={() => openDocumentsModal(row)}
            viewTitle="View Documents"
          />
        )}
      </td>
    </>
  );

  return (
    <div className="space-y-4 px-3 py-4 pb-12">
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

      {/* Handover Details section – restructured to match ListCommunity pagination */}
      <CardHeader className="p-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
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

      {/* Table – exactly the same wrapper as ListCommunity */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 sm:mx-0 pb-9">
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

      {/* Pagination – exactly like ListCommunity */}
      {paginatedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
      )}

      {/* Documents Modal with Previews using documentsFullDetails */}
      <CommonDialog
        header={`Documents - ${selectedCustomer?.customerName || ''}`}
        visible={showModal}
        onHide={() => setShowModal(false)}
        position="center"
        width="75vw"
        fullHeight={false}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {selectedCustomer?.documentsFullDetails?.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Documents for {selectedCustomer.customerName} - Unit {selectedCustomer.unitNumber}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCustomer.documentsFullDetails.map((doc, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-white shadow-sm">
                    {renderDocumentPreview(doc)}
                  </div>
                ))}
              </div>
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