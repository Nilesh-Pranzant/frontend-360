// SOPManagementDashboard.jsx
import React, { useState, useEffect } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils.jsx";
import axios from "axios";
import { API_BOQ_URL } from "../../../../config.js";
import StatCards from "./StatCards.jsx"
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChar.jsx";

export default function SOPManagementDashboard() {
  const { theme, themeUtils } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    summaryCards: {
      totalSOPs: 0,
      analyzedSOPs: 0,
      pendingReviews: 0,
      approvedSOPs: 0,
    },
    sopCategoryData: [],
    monthlySOPData: [],
    recentSOPs: [],
  });

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      const res = await axios.get(`${API_BOQ_URL}/api/v1/SOPDashboard/Dashboard`);

      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
     
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: themeUtils.getBgColor("default") }}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-xl font-semibold" style={{ color: themeUtils.getTextColor(true) }}>Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: themeUtils.getBgColor("default") }}>
        <div className="flex flex-col items-center max-w-md p-6 rounded-xl" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
          <AlertCircle className="mb-4" size={48} style={{ color: "#ef4444" }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: themeUtils.getTextColor(true) }}>Error Loading Dashboard</h2>
          <p className="text-center mb-4" style={{ color: themeUtils.getTextColor(false) }}>{error}</p>
          <button 
            onClick={() => fetchDashboardData(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-6 transition-all duration-300"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold" style={{ color: themeUtils.getTextColor(true) }}>
          SOP Management & AI Analysis Dashboard
        </h1>
        <button 
          onClick={() => fetchDashboardData(true)}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            color: themeUtils.getTextColor(true),
            boxShadow: theme.mode === "dark"
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <StatCards data={data.summaryCards} themeUtils={themeUtils} theme={theme} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            boxShadow:
              theme.mode === "dark"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: themeUtils.getTextColor(true) }}>
            <span
              className="w-1 h-6 mr-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            ></span>
            SOP Categories Distribution
          </h3>
          <div className="flex justify-center pt-2">
            {data.sopCategoryData.length > 0 ? (
              <PieChart data={data.sopCategoryData} themeUtils={themeUtils} theme={theme} />
            ) : (
              <div className="h-80 flex items-center justify-center" style={{ color: themeUtils.getTextColor(false) }}>
                No category data available
              </div>
            )}
          </div>
        </div>

        <div
          className="rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            boxShadow:
              theme.mode === "dark"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: themeUtils.getTextColor(true) }}>
            <span
              className="w-1 h-6 mr-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #10b981, #22c55e)" }}
            ></span>
            Monthly SOP Uploads & Analysis
          </h3>
          <div className="flex justify-center pt-4">
            {data.monthlySOPData.length > 0 ? (
              <BarChart data={data.monthlySOPData} themeUtils={themeUtils} theme={theme} />
            ) : (
              <div className="h-80 flex items-center justify-center" style={{ color: themeUtils.getTextColor(false) }}>
                No monthly data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}