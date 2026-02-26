import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { KeyRound, Plus, RefreshCw } from "lucide-react";
import { useEffect } from "react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminRolePermissions() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [roles, setRoles] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const [selectedProject, setSelectedProject] = useState("");
    const [roleId, setRoleId] = useState("");
    const [menuId, setMenuId] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchPermissionsData(selectedProject);
        } else {
            setRoles([]);
            setMenuItems([]);
        }
    }, [selectedProject]);

    async function fetchProjects() {
        try {
            const res = await axios.get(`${BASE}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function fetchPermissionsData(projId) {
        setFetching(true);
        try {
            const [rolesRes, menusRes] = await Promise.all([
                axios.get(`${BASE}/project-roles/project/${projId}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE}/sidemenu/project/${projId}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setRoles(rolesRes.data.data || []);
            setMenuItems(menusRes.data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setFetching(false);
        }
    }

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

    async function assignPermission() {
        if (!roleId || !menuId) {
            setStatus({ type: "error", text: "Please select both a Role and a Menu Item." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", text: "" });

        try {
            const res = await axios.post(`${BASE}/role-permissions`,
                { project_role_id: roleId, side_menu_id: menuId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setStatus({ type: "success", text: "Permission assigned successfully!" });
                setRoleId(""); setMenuId("");
                setTimeout(() => setStatus({ type: "", text: "" }), 3000);
            } else {
                setStatus({ type: "error", text: res.data.message || "Failed to assign permission." });
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
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Role Permissions</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>Assign menu access to roles</p>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <KeyRound size={14} style={{ color: theme.headerBg }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>Assign Permission</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 15 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Project *</label>
                        <select
                            value={selectedProject}
                            onChange={e => { setSelectedProject(e.target.value); setRoleId(""); setMenuId(""); }}
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                            disabled={loading || fetching}
                        >
                            <option value="">Select Project...</option>
                            {projects.map(p => (
                                <option key={p.project_id} value={p.project_id} style={{ background: cardBg }}>{p.project_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Role *</label>
                        <select
                            value={roleId}
                            onChange={e => setRoleId(e.target.value)}
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                            disabled={loading || fetching || !selectedProject}
                        >
                            <option value="">{fetching ? "Loading roles..." : "Select Role..."}</option>
                            {roles.map(r => (
                                <option key={r.project_role_id} value={r.project_role_id} style={{ background: cardBg }}>{r.role_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textSecondary, marginBottom: 5, textTransform: "uppercase" }}>Menu Item *</label>
                        <select
                            value={menuId}
                            onChange={e => setMenuId(e.target.value)}
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                            disabled={loading || fetching || !selectedProject}
                        >
                            <option value="">{fetching ? "Loading menus..." : "Select Menu Item..."}</option>
                            {menuItems.map(m => (
                                <option key={m.side_menu_id} value={m.side_menu_id} style={{ background: cardBg }}>{m.menu_name || m.page_url}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 15 }}>
                    <button
                        onClick={assignPermission}
                        disabled={loading || fetching || !roleId || !menuId}
                        style={{
                            padding: "10px 24px",
                            borderRadius: 9,
                            border: "none",
                            background: (loading || fetching || !roleId || !menuId) ? textSecondary : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: (loading || fetching || !roleId || !menuId) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            opacity: (loading || fetching || !roleId || !menuId) ? 0.7 : 1,
                            transition: "all 0.2s ease"
                        }}
                    >
                        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                        {loading ? "Assigning..." : "Assign Permission"}
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