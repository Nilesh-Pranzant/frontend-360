import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../ui/Settings/themeUtils";
import {
    Users,
    FolderKanban,
    Layers,
    ShieldCheck,
    LayoutList,
    KeyRound,
    UserCog,
    Shield,
} from "lucide-react";

const navItems = [
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/categories", label: "Categories", icon: Layers },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/project-roles", label: "Project Roles", icon: ShieldCheck },
    { to: "/admin/sidemenu", label: "Side Menu", icon: LayoutList },
    { to: "/admin/role-permissions", label: "Role Permissions", icon: KeyRound },
    { to: "/admin/user-project-role", label: "User Assignment", icon: UserCog },
];

export default function AdminSidebar() {
    const location = useLocation();
    const { theme, themeUtils } = useTheme();

    const sidebarBg = theme.mode === "Dark"
        ? "rgba(17, 24, 39, 0.95)"
        : "rgba(255, 255, 255, 0.95)";

    const borderColor = theme.mode === "Dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.08)";

    const hoverBg = theme.mode === "Dark"
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.05)";

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    return (
        <aside
            style={{
                width: 260,
                minHeight: "100vh",
                backgroundColor: sidebarBg,
                backdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
            }}
        >
            {/* Brand Header — fixed 60px to match AdminHeader */}
            <div
                style={{
                    height: 60,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    borderBottom: `1px solid ${borderColor}`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Shield size={18} color="#fff" />
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: themeUtils.getTextColor(true),
                                letterSpacing: "-0.3px",
                            }}
                        >
                            Admin Panel
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color: themeUtils.getTextColor(false),
                                opacity: 0.6,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            Control Center
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Label */}
            <div style={{ padding: "16px 20px 8px" }}>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: themeUtils.getTextColor(false),
                        opacity: 0.5,
                    }}
                >
                    Navigation
                </span>
            </div>

            {/* Nav Items */}
            <nav style={{ padding: "0 14px", flex: 1, overflowY: "auto" }} className="hide-scrollbar">
                {navItems.map(({ to, label, icon: Icon }) => {
                    const active = isActive(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 10px",
                                borderRadius: 10,
                                marginBottom: 2,
                                textDecoration: "none",
                                transition: "all 0.18s ease",
                                backgroundColor: active ? theme.headerBg : "transparent",
                                background: active ? `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg}dd)` : "transparent",
                                color: active ? "#ffffff" : themeUtils.getTextColor(false),
                                fontWeight: active ? 600 : 500,
                                fontSize: 13.5,
                                boxShadow: active ? `0 6px 16px ${theme.headerBg}55` : "none",
                                transform: active ? "scale(1.02)" : "scale(1)",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                            }}
                            onMouseEnter={e => {
                                if (!active) e.currentTarget.style.backgroundColor = hoverBg;
                            }}
                            onMouseLeave={e => {
                                if (!active) e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            {active && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "20%",
                                        height: "60%",
                                        width: 3.5,
                                        borderRadius: "0 4px 4px 0",
                                        background: "#ffffff",
                                        boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                                    }}
                                />
                            )}
                            <Icon
                                size={18}
                                style={{
                                    color: active ? "#ffffff" : theme.headerBg,
                                    flexShrink: 0,
                                }}
                            />
                            {label}
                        </Link>
                    );
                })}
            </nav>


        </aside>
    );
}