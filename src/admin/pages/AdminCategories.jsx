import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { Layers, Plus, RefreshCw } from "lucide-react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminCategories() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    useEffect(() => { fetchCategories(); }, []);

    async function fetchCategories() {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function createCategory() {
        if (!name.trim()) return;
        try {
            await axios.post(
                `${BASE}/categories`,
                { category_name: name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName("");
            fetchCategories();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Categories</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>
                    Manage project categories
                </p>
            </div>

            {/* Create Card */}
            <div
                style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 14,
                    padding: "20px 24px",
                    marginBottom: 24,
                    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                }}
            >
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 14 }}>
                    Create New Category
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && createCategory()}
                        placeholder="Category name..."
                        style={{
                            flex: 1,
                            padding: "9px 14px",
                            borderRadius: 9,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: inputBg,
                            color: textPrimary,
                            fontSize: 13,
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={createCategory}
                        style={{
                            padding: "9px 18px",
                            borderRadius: 9,
                            border: "none",
                            background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Plus size={15} />
                        Create
                    </button>
                </div>
            </div>

            {/* List Card */}
            <div
                style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        padding: "14px 20px",
                        borderBottom: `1px solid ${borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>
                        All Categories ({categories.length})
                    </span>
                    <button
                        onClick={fetchCategories}
                        style={{
                            background: "transparent",
                            border: `1px solid ${borderColor}`,
                            borderRadius: 7,
                            padding: "5px 10px",
                            cursor: "pointer",
                            color: textSecondary,
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                        }}
                    >
                        <RefreshCw size={12} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: 32, textAlign: "center", color: textSecondary, opacity: 0.5, fontSize: 13 }}>
                        Loading...
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: textSecondary, opacity: 0.5, fontSize: 13 }}>
                        No categories yet. Create one above.
                    </div>
                ) : (
                    <div>
                        {categories.map((c, i) => (
                            <div
                                key={c.category_id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 20px",
                                    borderBottom: i < categories.length - 1 ? `1px solid ${borderColor}` : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: `linear-gradient(135deg, ${theme.headerBg}22, ${theme.headerBg}44)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Layers size={14} style={{ color: theme.headerBg }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 13.5, fontWeight: 600, color: textPrimary }}>
                                        {c.category_name}
                                    </div>
                                    <div style={{ fontSize: 11, color: textSecondary, opacity: 0.5 }}>
                                        ID: {c.category_id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}