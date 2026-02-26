import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../ui/Settings/themeUtils";
import { Users, Plus, RefreshCw, Mail, Phone } from "lucide-react";

const BASE = "http://localhost:8000/api/admin";

export default function AdminUsers() {
    const { theme, themeUtils } = useTheme();
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });

    const cardBg = themeUtils.getBgColor("card");
    const borderColor = themeUtils.getBorderColor();
    const inputBg = themeUtils.getBgColor("input");
    const textPrimary = themeUtils.getTextColor(true);
    const textSecondary = themeUtils.getTextColor(false);

    useEffect(() => { fetchUsers(); }, []);

    async function fetchUsers() {
        try {
            const res = await axios.get(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data.data || []);
        } catch (e) { console.error(e); }
    }

    async function createUser() {
        if (!form.full_name || !form.email || !form.password) {
            setStatus({ type: "error", text: "Full name, email, and password are required." });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setStatus({ type: "error", text: "Please enter a valid email address." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", text: "" });

        try {
            const res = await axios.post(`${BASE}/users`, form, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setStatus({ type: "success", text: "User created successfully!" });
                setForm({ full_name: "", email: "", phone: "", password: "" });
                fetchUsers();
                // Clear success message after 3 seconds
                setTimeout(() => setStatus({ type: "", text: "" }), 3000);
            } else {
                setStatus({ type: "error", text: res.data.message || "Failed to create user." });
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: "error", text: e.response?.data?.message || "An error occurred while creating the user." });
        } finally {
            setLoading(false);
        }
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
        minWidth: 140,
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, margin: 0 }}>Users</h1>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4, opacity: 0.7 }}>Manage system users</p>
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "20px 24px", marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 14 }}>Create New User</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" style={inputStyle} disabled={loading} />
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" style={inputStyle} disabled={loading} />
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" style={{ ...inputStyle, flex: "0 0 140px" }} disabled={loading} />
                    <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" style={{ ...inputStyle, flex: "0 0 140px" }} disabled={loading} />
                    <button
                        onClick={createUser}
                        disabled={loading}
                        style={{
                            padding: "9px 18px",
                            borderRadius: 9,
                            border: "none",
                            background: loading ? textSecondary : `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            alignSelf: "stretch",
                            transition: "all 0.2s ease",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
                {status.text && (
                    <div style={{
                        marginTop: 12,
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        backgroundColor: status.type === "success" ? "#22c55e15" : "#ef444415",
                        color: status.type === "success" ? "#22c55e" : "#ef4444",
                        border: `1px solid ${status.type === "success" ? "#22c55e30" : "#ef444430"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: status.type === "success" ? "#22c55e" : "#ef4444" }} />
                        {status.text}
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>All Users ({users.length})</span>
                    <button onClick={fetchUsers} style={{ background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: textSecondary, display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>
                {users.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: textSecondary, opacity: 0.5, fontSize: 13 }}>No users found.</div>
                ) : users.map((u, i) => (
                    <div key={u.user_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < users.length - 1 ? `1px solid ${borderColor}` : "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.navbarBg})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {u.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: textPrimary }}>{u.full_name}</div>
                            <div style={{ fontSize: 11, color: textSecondary, opacity: 0.6, display: "flex", gap: 10, marginTop: 2 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Mail size={10} />{u.email}</span>
                            </div>
                        </div>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, backgroundColor: u.status === "ACTIVE" ? "#22c55e22" : "#ef444422", color: u.status === "ACTIVE" ? "#16a34a" : "#ef4444", fontWeight: 600 }}>
                            {u.status || "ACTIVE"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}