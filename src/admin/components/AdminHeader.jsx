import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../ui/Settings/themeUtils";
import {
    Users,
    FolderKanban,
    Layers,
    ShieldCheck,
    LayoutList,
    KeyRound,
    UserCog,
    LogOut,
} from "lucide-react";

const breadcrumbMap = {
    "/admin/users": { label: "Users", icon: Users },
    "/admin/categories": { label: "Categories", icon: Layers },
    "/admin/projects": { label: "Projects", icon: FolderKanban },
    "/admin/project-roles": { label: "Project Roles", icon: ShieldCheck },
    "/admin/sidemenu": { label: "Side Menu", icon: LayoutList },
    "/admin/role-permissions": { label: "Role Permissions", icon: KeyRound },
    "/admin/user-project-role": { label: "User Assignment", icon: UserCog },
};

export default function AdminHeader() {
    const { theme, themeUtils, ThemeToggleButton } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const current = breadcrumbMap[location.pathname];
    const Icon = current?.icon;

    const headerBg = theme.mode === "Dark"
        ? "rgba(17, 24, 39, 0.95)"
        : "rgba(255, 255, 255, 0.95)";

    const borderColor = theme.mode === "Dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.08)";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header
            style={{
                height: 60,
                backgroundColor: headerBg,
                borderBottom: `1px solid ${borderColor}`,
                backdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                gap: 12,
                position: "sticky",
                top: 0,
                zIndex: 40,
            }}
        >
            {/* Page Title / Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                {Icon && (
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon size={15} style={{ color: theme.headerBg }} />
                    </div>
                )}
                <div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: themeUtils.getTextColor(true),
                            letterSpacing: "-0.2px",
                        }}
                    >
                        {current?.label || "Admin Panel"}
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            color: themeUtils.getTextColor(false),
                            opacity: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                        }}
                    >
                        Admin / {current?.label || "Dashboard"}
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                {/* Theme Toggle */}
                <ThemeToggleButton />



                {/* User Avatar + Logout */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        A
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            border: "none",
                            backgroundColor: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#ef4444",
                            transition: "all 0.18s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}