import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { LayoutList, Plus, RefreshCw } from "lucide-react";
import { useEffect } from "react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminSidemenu() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [parentMenus, setParentMenus] = useState([]);
    const [menu, setMenu] = useState({ project_id: "", parent_id: "", menu_name: "", page_url: "", menu_order: "" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    const inputStyle = {
        padding: "9px 14px",
        borderRadius: 9,
        border: `1px solid ${borderColor}`,
        backgroundColor: inputBg,
        color: textPrimary,
        fontSize: 13,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (menu.project_id) {
            fetchParentMenus(menu.project_id);
        } else {
            setParentMenus([]);
        }
    }, [menu.project_id]);

    async function fetchProjects() {
        try {
            const res = await axios.get(`${BASE}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function fetchParentMenus(projId) {
        try {
            const res = await axios.get(`${BASE}/sidemenu/project/${projId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParentMenus(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function createMenu() {
        if (!menu.menu_name || !menu.project_id || menu.menu_order === "") {
            setStatus({ type: "error", text: "Project, Menu Name, and Order are required." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", text: "" });

        try {
            const res = await axios.post(`${BASE}/sidemenu`, menu, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setStatus({ type: "success", text: "Menu item created successfully!" });
                setMenu({ project_id: menu.project_id, parent_id: "", menu_name: "", page_url: "", menu_order: "" });
                // Refresh parent menus if this was a potential parent
                fetchParentMenus(menu.project_id);
                setTimeout(() => setStatus({ type: "", text: "" }), 3000);
            } else {
                setStatus({ type: "error", text: res.data.message || "Failed to create menu item." });
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: "error", text: e.response?.data?.message || "An error occurred." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Side Menu</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>Manage sidebar navigation items</p>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LayoutList size={14} style={{ color: theme.headerBg }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>Create Menu Item</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 15 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Project *</label>
                        <select
                            value={menu.project_id}
                            onChange={e => setMenu({ ...menu, project_id: e.target.value })}
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                            disabled={loading}
                        >
                            <option value="" disabled>Select Project...</option>
                            {projects.map(p => (
                                <option key={p.project_id} value={p.project_id} style={{ background: cardBg }}>{p.project_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Parent Menu</label>
                        <select
                            value={menu.parent_id}
                            onChange={e => setMenu({ ...menu, parent_id: e.target.value })}
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                            disabled={loading || !menu.project_id}
                        >
                            <option value="">None (Root)</option>
                            {parentMenus.filter(m => !m.parent_id).map(m => (
                                <option key={m.side_menu_id} value={m.side_menu_id} style={{ background: cardBg }}>{m.menu_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Menu Name *</label>
                        <input value={menu.menu_name} onChange={e => setMenu({ ...menu, menu_name: e.target.value })} placeholder="e.g. Dashboard" style={inputStyle} disabled={loading} />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Page URL</label>
                        <input value={menu.page_url} onChange={e => setMenu({ ...menu, page_url: e.target.value })} placeholder="e.g. /dashboard" style={inputStyle} disabled={loading} />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Order *</label>
                        <input type="number" value={menu.menu_order} onChange={e => setMenu({ ...menu, menu_order: e.target.value })} placeholder="e.g. 1" style={inputStyle} disabled={loading} />
                    </div>
                </div>

                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 15 }}>
                    <button
                        onClick={createMenu}
                        disabled={loading || !menu.project_id || !menu.menu_name}
                        style={{
                            padding: "10px 24px",
                            borderRadius: 9,
                            border: "none",
                            background: (loading || !menu.project_id || !menu.menu_name) ? textSecondary : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: (loading || !menu.project_id || !menu.menu_name) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            opacity: (loading || !menu.project_id || !menu.menu_name) ? 0.7 : 1,
                            transition: "all 0.2s ease"
                        }}
                    >
                        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                        {loading ? "Creating..." : "Create Menu Item"}
                    </button>

                    {status.text && (
                        <div style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: status.type === "success" ? "#22c55e15" : "#ef444415",
                            color: status.type === "success" ? "#22c55e" : "#ef4444",
                            border: `1px solid ${status.type === "success" ? "#22c55e30" : "#ef444430"}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: status.type === "success" ? "#22c55e" : "#ef4444" }} />
                            {status.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}