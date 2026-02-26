import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { FolderKanban, Plus, RefreshCw } from "lucide-react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminProjects() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await axios.get(`${BASE}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function fetchProjects() {
        try {
            const res = await axios.get(`${BASE}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function createProject() {
        if (!name.trim() || !categoryId) return;
        setLoading(true);
        try {
            await axios.post(`${BASE}/projects`, { project_name: name, category_id: categoryId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setName(""); setCategoryId("");
            fetchProjects();
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

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

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Projects</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>Manage all projects</p>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "20px 24px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 14 }}>Create New Project</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Project name..."
                        style={inputStyle}
                        disabled={loading}
                    />
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        style={{ ...inputStyle, flex: "0 0 200px", appearance: "none", cursor: "pointer" }}
                        disabled={loading}
                    >
                        <option value="" disabled>Select Category...</option>
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id} style={{ background: cardBg, color: textPrimary }}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={createProject}
                        disabled={loading || !name.trim() || !categoryId}
                        style={{
                            padding: "9px 18px",
                            borderRadius: 9,
                            border: "none",
                            background: (loading || !name.trim() || !categoryId) ? textSecondary : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: (loading || !name.trim() || !categoryId) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            opacity: (loading || !name.trim() || !categoryId) ? 0.6 : 1,
                            transition: "all 0.2s ease"
                        }}
                    >
                        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>All Projects ({projects.length})</span>
                    <button onClick={fetchProjects} style={{ background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: textSecondary, display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>
                {projects.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: textSecondary, opacity: 0.5, fontSize: 13 }}>No projects yet.</div>
                ) : projects.map((p, i) => (
                    <div key={p.project_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < projects.length - 1 ? `1px solid ${borderColor}` : "none" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FolderKanban size={14} style={{ color: theme.headerBg }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: textPrimary }}>{p.project_name}</div>
                            <div style={{ fontSize: 11, color: textSecondary, opacity: 0.5 }}>Category: {p.category_name || "—"} · ID: {p.project_id}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}