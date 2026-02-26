import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Bot,
  Construction,
  ClipboardList,
  Settings2,
  Bug,
  Clock,
  Command,
  UserCheck,
  Camera,
  Cpu,
  Eye,
  Flame,
  Droplets,
  Car,
  ChevronDown,
  ChevronLeft,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../Settings/themeUtils";
import { API_URL } from "../../../config.js";

// ── Icon Map ────────────────────────────────────────────────────────────────
const iconMap = {
  dashboard: LayoutDashboard,
  overview: LayoutDashboard,
  analytics: Cpu,
  contracts: ShieldCheck,
  "vendor-risk": AlertTriangle,
  "ai-assistant": Bot,
  execution: Construction,
  boq: ClipboardList,
  sop: Settings2,
  snag: Bug,
  dlp: Clock,
  command: Command,
  auth: UserCheck,
  cctv: Camera,
  ecc: Cpu,
  "sop-violation": Eye,
  lpg: Flame,
  btu: Droplets,
  "btu-utility-intelligence": Droplets,
  ev: Car,
  "community-management": Settings2,
  property: ClipboardList,
  default: LayoutDashboard,
};

// ── Component ────────────────────────────────────────────────────────────────
const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const { theme, themeUtils } = useTheme();
  const [menuGroups, setMenuGroups] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isDark = theme.mode === "Dark";
  const accent = theme.headerBg || "#6366f1";
  const accentSoft = accent + "22";
  const accentMid = accent + "44";

  // ── theme tokens ──────────────────────────────────────────────────────────
  // Same bg as Header.jsx navbar for a unified look
  const sidebarBg = isDark ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const headerBorderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPrimary = themeUtils.getTextColor(true);
  const textSecondary = themeUtils.getTextColor(false);
  const hoverBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const disabledOpacity = 0.35;

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSideMenu = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const base = API_URL.replace(/\/+$/, "");
        const url = `${base}/api/sidemenu/all`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          timeout: 15000,
        });

        const data = response.data;
        if (!data?.success || !Array.isArray(data?.sidemenu)) {
          throw new Error("Invalid sidemenu response");
        }

        // Build tree
        const nodeMap = {};
        data.sidemenu.forEach((item) => {
          const slug = item.page_url?.split("/").filter(Boolean).pop() || "default";
          nodeMap[item.side_menu_id] = {
            label: item.menu_name,
            path: item.page_url,
            icon: iconMap[slug] || iconMap.default,
            subItems: [],
            is_accessible: item.is_accessible ?? true,
            id: item.side_menu_id,
          };
        });

        data.sidemenu.forEach((item) => {
          if (item.parent_id && nodeMap[item.parent_id]) {
            nodeMap[item.parent_id].subItems.push(nodeMap[item.side_menu_id]);
          }
        });

        const roots = data.sidemenu
          .filter((item) => !item.parent_id)
          .map((rootItem) => nodeMap[rootItem.side_menu_id])
          .filter(Boolean);

        const groups = roots.map((root) => ({
          title: root.label.toUpperCase(),
          items: [{ ...root, hasSub: root.subItems.length > 0 }],
        }));

        setMenuGroups(groups);
      } catch (error) {
        console.error("Sidebar API Error:", error);
        if (error.response) {
          setFetchError(`Server Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          setFetchError("No response from server");
        } else {
          setFetchError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSideMenu();
  }, []);

  // Auto-expand first group
  useEffect(() => {
    if (menuGroups.length > 0 && Object.keys(expandedGroups).length === 0) {
      setExpandedGroups({ [menuGroups[0].title]: true });
    }
  }, [menuGroups]);

  const toggleGroup = (title) =>
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // ── Render a single menu item ─────────────────────────────────────────────
  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const isDisabled = !item.is_accessible;
    const isHovered = hoveredId === item.id;
    const isExpanded = expanded[item.id];
    const hasSubs = item.subItems?.length > 0;

    // Standardize padding: Level 0 gets 14px, nested items get slightly more but keep it tight
    // Significantly reduced padding for a tighter left-side look
    const paddingLeft = isSidebarCollapsed ? 0 : level === 0 ? 8 : 12;

    const handleToggleSub = (e) => {
      if (isDisabled) return;
      e.preventDefault();
      setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    };

    const handleNavClick = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const itemBg = active
      ? `linear-gradient(135deg, ${accent}, ${accent}e6)` // slightly more transparent for glass effect
      : isHovered && !isDisabled
        ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)"
        : "transparent";

    const iconColor = active ? "#ffffff" : isDisabled ? textSecondary : accent;
    const textColor = active ? "#ffffff" : isDisabled ? textSecondary : textPrimary;

    const content = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isSidebarCollapsed ? 0 : 6, // Reduced from 8
          justifyContent: isSidebarCollapsed ? "center" : "flex-start",
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Icon wrapper */}
        <div
          style={{
            width: 28, // Reduced from 30
            height: 28, // Reduced from 30
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 7, // Adjusted radius
            background: active
              ? "rgba(255,255,255,0.2)"
              : isHovered && !isDisabled
                ? accentSoft
                : isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
            transition: "background 0.2s ease",
          }}
        >
          <Icon size={level === 0 ? 18 : 14} style={{ color: iconColor, flexShrink: 0 }} />
        </div>

        {/* Label */}
        {!isSidebarCollapsed && (
          <span
            style={{
              fontSize: level === 0 ? 13.5 : 12,
              fontWeight: active ? 600 : 500,
              color: textColor,
              whiteSpace: "normal",
              wordBreak: "break-word",
              flex: 1,
              transition: "all 0.2s ease",
              opacity: level > 0 && !active ? 0.85 : 1,
            }}
          >
            {item.label}
          </span>
        )}

        {level > 0 && (active || isHovered) && !isSidebarCollapsed && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: active ? "#fff" : accent,
              marginRight: 4,
              opacity: 0.8,
            }}
          />
        )}

        {hasSubs && !isSidebarCollapsed && (
          <div
            onClick={handleToggleSub}
            style={{
              padding: "2px 4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronDown
              size={13}
              style={{
                color: active ? "#fff" : textSecondary,
                transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.25s ease",
                opacity: 0.7,
              }}
            />
          </div>
        )}
      </div>
    );

    return (
      <div key={item.id}>
        {/* Item row */}
        <div
          onMouseEnter={() => !isDisabled && setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: isSidebarCollapsed ? "6px" : `8px 6px 8px ${paddingLeft}px`,
            borderRadius: 12, // Slightly smaller radius for compact look
            marginBottom: 4, // Reduced from 6
            background: itemBg,
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? disabledOpacity : 1,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: active
              ? `0 8px 20px ${accent}55`
              : isHovered ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
            position: "relative",
            overflow: "hidden",
            transform: active ? "scale(1.02)" : isHovered ? "translateX(6px)" : "none",
          }}
          title={isSidebarCollapsed ? item.label : undefined}
        >
          {/* Active left indicator bar - subtle glow */}
          {active && !isSidebarCollapsed && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "15%",
                height: "70%",
                width: 4,
                borderRadius: "0 6px 6px 0",
                background: "#fff",
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
                zIndex: 1,
              }}
            />
          )}

          {isDisabled ? (
            content
          ) : hasSubs ? (
            <div
              style={{ display: "flex", alignItems: "center", flex: 1 }}
              onClick={handleToggleSub}
            >
              {content}
            </div>
          ) : (
            <Link
              to={item.path}
              onClick={handleNavClick}
              style={{ display: "flex", alignItems: "center", flex: 1, textDecoration: "none" }}
            >
              {content}
            </Link>
          )}
        </div>

        {/* Sub items with animated expand */}
        {hasSubs && isExpanded && (
          <div
            style={{
              overflow: "hidden",
              borderLeft: isSidebarCollapsed
                ? "none"
                : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              marginLeft: isSidebarCollapsed ? 0 : 14, // Significantly reduced from 25
              marginTop: 1, // Reduced from 2
              marginBottom: 4, // Reduced from 6
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingLeft: 4, // Very small internal padding for the border
            }}
          >
            {item.subItems.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <aside
        style={{
          width: isSidebarCollapsed ? 64 : 280,
          minHeight: "100vh",
          backgroundColor: sidebarBg,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          padding: 16,
          gap: 10,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 38,
              borderRadius: 10,
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              animation: "pulse 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.12,
            }}
          />
        ))}
      </aside>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <aside
        style={{
          width: 280,
          minHeight: "100vh",
          backgroundColor: sidebarBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 28 }}>⚠️</div>
        <div style={{ fontSize: 12, color: "#ef4444", textAlign: "center" }}>{fetchError}</div>
      </aside>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-[64px]" : "w-[280px]"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto`}
        style={{ backgroundColor: sidebarBg, backdropFilter: "blur(20px)" }}
      >
        {/* ── Collapse Toggle (Desktop) — centred on 56px header ── */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute top-[12px] right-[8px] z-50 w-8 h-8 items-center justify-center rounded-full shadow-xl border transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
            boxShadow: `0 2px 10px ${accent}40`,
          }}
        >
          <ChevronLeft
            size={14}
            style={{
              color: accent,
              transform: isSidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>

        {/* ── Sidebar Header (Logo) — height matches navbar h-14 = 56px ── */}
        <div
          className="flex items-center px-4 flex-shrink-0"
          style={{
            height: 56,
            borderBottom: `1px solid ${headerBorderColor}`,
          }}
        >
          <Logo isCollapsed={isSidebarCollapsed} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1.5 rounded-md"
            style={{
              color: textSecondary,
              backgroundColor: "transparent",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex-1 overflow-y-auto hide-scrollbar"
          style={{ padding: "8px 4px 12px" }} // Further reduced horizontal padding
        >
          {menuGroups.map((group) => {
            const groupExpanded = expandedGroups[group.title] ?? true;

            return (
              <div key={group.title} style={{ marginBottom: 8 }}>


                {/* Items */}
                {groupExpanded && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {group.items.map((item) => renderMenuItem(item, 0))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;