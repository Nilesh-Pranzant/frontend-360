import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { UserCog, Plus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminUserProjectRole() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [data, setData] = useState({ user_id: "", project_id: "", project_role_id: "" });
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState({
        users: false,
        projects: false,
        roles: false,
        assigning: false
    });

    const [msg, setMsg] = useState({ type: "", text: "" });

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    const fetchData = useCallback(async () => {
        setLoading(prev => ({ ...prev, users: true, projects: true }));
        try {
            const [usersRes, projectsRes] = await Promise.all([
                axios.get(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setUsers(usersRes.data.data || []);
            setProjects(projectsRes.data.data || []);
        } catch (e) {
            console.error("Error fetching initial data:", e);
            setMsg({ type: "error", text: "Failed to load users or projects." });
        } finally {
            setLoading(prev => ({ ...prev, users: false, projects: false }));
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!data.project_id) {
            setRoles([]);
            return;
        }

        const fetchRoles = async () => {
            setLoading(prev => ({ ...prev, roles: true }));
            try {
                const res = await axios.get(`${BASE}/project-roles/project/${data.project_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoles(res.data.data || []);
            } catch (e) {
                console.error("Error fetching roles:", e);
                setMsg({ type: "error", text: "Failed to load roles for selected project." });
            } finally {
                setLoading(prev => ({ ...prev, roles: false }));
            }
        };

        fetchRoles();
    }, [data.project_id, token]);

    async function assign() {
        if (!data.user_id || !data.project_id || !data.project_role_id) {
            setMsg({ type: "error", text: "Please select all fields." });
            return;
        }

        setLoading(prev => ({ ...prev, assigning: true }));
        setMsg({ type: "", text: "" });

        try {
            await axios.post(`${BASE}/user-project-role`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg({ type: "success", text: "User assigned to project successfully!" });
            setData({ user_id: "", project_id: "", project_role_id: "" });
            setTimeout(() => setMsg({ type: "", text: "" }), 5000);
        } catch (e) {
            console.error("Assignment error:", e);
            setMsg({ type: "error", text: e.response?.data?.message || "Failed to assign user." });
        } finally {
            setLoading(prev => ({ ...prev, assigning: false }));
        }
    }

    const inputStyle = {
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${borderColor}`,
        backgroundColor: inputBg,
        color: textPrimary,
        fontSize: 14,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        appearance: "none",
        cursor: "pointer"
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: "-0.02em" }}>User Assignment</h1>
                <p style={{ fontSize: 14, color: textSecondary, marginTop: 6, opacity: 0.8 }}>Efficiently manage user roles across different projects</p>
            </div>

            <div style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: 18,
                padding: "28px 32px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${theme.headerBg}15, ${theme.headerBg}30)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${theme.headerBg}20`
                    }}>
                        <UserCog size={18} style={{ color: theme.headerBg }} />
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, fontSize: 15, color: textPrimary, display: "block" }}>Assign User to Project</span>
                        <span style={{ fontSize: 12, color: textSecondary, opacity: 0.7 }}>Select user, project and corresponding role</span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
                    {/* User Selection */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Select User {loading.users && <RefreshCw size={10} className="animate-spin" style={{ display: "inline", marginLeft: 5 }} />}
                        </label>
                        <select
                            value={data.user_id}
                            onChange={e => setData({ ...data, user_id: e.target.value })}
                            style={inputStyle}
                            disabled={loading.users}
                        >
                            <option value="">{loading.users ? "Loading users..." : "Choose a user..."}</option>
                            {users.map(u => (
                                <option key={u.user_id} value={u.user_id} style={{ background: cardBg }}>
                                    {u.full_name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Project Selection */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Select Project {loading.projects && <RefreshCw size={10} className="animate-spin" style={{ display: "inline", marginLeft: 5 }} />}
                        </label>
                        <select
                            value={data.project_id}
                            onChange={e => setData({ ...data, project_id: e.target.value })}
                            style={inputStyle}
                            disabled={loading.projects}
                        >
                            <option value="">{loading.projects ? "Loading projects..." : "Choose a project..."}</option>
                            {projects.map(p => (
                                <option key={p.project_id} value={p.project_id} style={{ background: cardBg }}>
                                    {p.project_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Select Role {loading.roles && <RefreshCw size={10} className="animate-spin" style={{ display: "inline", marginLeft: 5 }} />}
                        </label>
                        <select
                            value={data.project_role_id}
                            onChange={e => setData({ ...data, project_role_id: e.target.value })}
                            style={inputStyle}
                            disabled={loading.roles || !data.project_id}
                        >
                            <option value="">
                                {!data.project_id ? "Select a project first" : loading.roles ? "Loading roles..." : "Choose a role..."}
                            </option>
                            {roles.map(r => (
                                <option key={r.project_role_id} value={r.project_role_id} style={{ background: cardBg }}>
                                    {r.role_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                        onClick={assign}
                        disabled={loading.assigning || !data.user_id || !data.project_id || !data.project_role_id}
                        style={{
                            padding: "12px 28px",
                            borderRadius: 12,
                            border: "none",
                            background: (loading.assigning || !data.user_id || !data.project_id || !data.project_role_id)
                                ? `${theme.headerBg}40`
                                : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: (loading.assigning || !data.user_id || !data.project_id || !data.project_role_id) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            boxShadow: (loading.assigning || !data.user_id || !data.project_id || !data.project_role_id) ? "none" : `0 4px 15px ${theme.headerBg}40`,
                            transition: "all 0.3s ease"
                        }}
                    >
                        {loading.assigning ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                        {loading.assigning ? "Assigning..." : "Assign User"}
                    </button>

                    {msg.text && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 18px",
                            borderRadius: 12,
                            backgroundColor: msg.type === "success" ? "#22c55e15" : "#ef444415",
                            color: msg.type === "success" ? "#16a34a" : "#dc2626",
                            fontSize: 14,
                            fontWeight: 500,
                            border: `1px solid ${msg.type === "success" ? "#22c55e30" : "#ef444430"}`,
                            animation: "slideIn 0.3s ease-out"
                        }}>
                            {msg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {msg.text}
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                @keyframes slideIn {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
}
