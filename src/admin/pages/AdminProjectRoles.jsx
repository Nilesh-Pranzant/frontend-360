import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { ShieldCheck, Plus, RefreshCw } from "lucide-react";
import { useEffect } from "react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminProjectRoles() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const roles = ["Admin", "Manager", "Editor", "Viewer", "Developer", "Client"];

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    const inputStyle = {
        flex: 1,
        padding: "9px 14px",
        borderRadius: 9,
        border: `1px solid ${borderColor}`,
        backgroundColor: inputBg,
        color: textPrimary,
        fontSize: 13,
        outline: "none",
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const res = await axios.get(`${BASE}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function createRole() {
        if (!projectId || !roleName) return;
        setLoading(true);
        setMsg({ type: "", text: "" });
        try {
            await axios.post(`${BASE}/project-roles`, { project_id: projectId, role_name: roleName }, { headers: { Authorization: `Bearer ${token}` } });
            setMsg({ type: "success", text: "Role created successfully!" });
            setProjectId(""); setRoleName("");
            setTimeout(() => setMsg({ type: "", text: "" }), 3000);
        } catch (e) {
            console.error(e);
            setMsg({ type: "error", text: e.response?.data?.message || "Failed to create role." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Project Roles</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>Define roles for each project</p>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShieldCheck size={14} style={{ color: theme.headerBg }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>Create New Role</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <select
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                        style={{ ...inputStyle, flex: "0 0 220px", appearance: "none", cursor: "pointer" }}
                        disabled={loading}
                    >
                        <option value="" disabled>Select Project...</option>
                        {projects.map(p => (
                            <option key={p.project_id} value={p.project_id} style={{ background: cardBg }}>
                                {p.project_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={roleName}
                        onChange={e => setRoleName(e.target.value)}
                        style={{ ...inputStyle, flex: "0 0 220px", appearance: "none", cursor: "pointer" }}
                        disabled={loading}
                    >
                        <option value="" disabled>Select Role Name...</option>
                        {roles.map(r => (
                            <option key={r} value={r} style={{ background: cardBg }}>
                                {r}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={createRole}
                        disabled={loading || !projectId || !roleName}
                        style={{
                            padding: "9px 18px",
                            borderRadius: 9,
                            border: "none",
                            background: (loading || !projectId || !roleName) ? textSecondary : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: (loading || !projectId || !roleName) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            opacity: (loading || !projectId || !roleName) ? 0.6 : 1,
                            transition: "all 0.2s ease"
                        }}
                    >
                        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>

                {msg.text && (
                    <div style={{
                        marginTop: 14,
                        padding: "10px 14px",
                        borderRadius: 9,
                        backgroundColor: msg.type === "success" ? "#22c55e18" : "#ef444418",
                        color: msg.type === "success" ? "#16a34a" : "#ef4444",
                        fontSize: 13,
                        fontWeight: 500,
                        border: `1px solid ${msg.type === "success" ? "#22c55e30" : "#ef444430"}`,
                    }}>
                        {msg.type === "success" ? "✓" : "✕"} {msg.text}
                    </div>
                )}
            </div>
        </div>
    );
}