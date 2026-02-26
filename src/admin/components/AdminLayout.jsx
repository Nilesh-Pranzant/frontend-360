import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useTheme } from "../../ui/Settings/themeUtils";

export default function AdminLayout() {
    const { themeUtils } = useTheme();

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: themeUtils.getBgColor("default"),
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
        >
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Sticky Header */}
                <AdminHeader />

                {/* Page Content */}
                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "28px 28px",
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}