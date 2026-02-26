// Profile.js

import React, { useState } from "react";
import { User, Mail, Lock, Edit2, Check, X, Camera } from "lucide-react";
import { useTheme } from "../Settings/themeUtils";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { theme, themeUtils } = useTheme();

  const [profile, setProfile] = useState({
    name: "User",
    email: "user@example.com",
    about: "Passionate developer with expertise in React and modern web technologies.",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    about: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || parsed.username || "User",
          email: parsed.email || "No email",
          // about: parsed.about || prev.about // If about is ever added to user object
        }));
        setEditForm((prev) => ({
          ...prev,
          name: parsed.name || parsed.username || "",
          email: parsed.email || "",
          about: "Passionate developer with expertise in React and modern web technologies.",
        }));
      } catch (e) {
        console.error("Error parsing user data in Profile", e);
      }
    }
  }, []);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleUpdateProfile = () => {
    if (!editForm.name || !editForm.email) {
      setMessage("Name and email are required");
      setMessageType("error");
      return;
    }

    setProfile({
      name: editForm.name,
      email: editForm.email,
      about: editForm.about,
    });

    // Update localStorage to reflect changes immediately in session
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const updated = { ...parsed, name: editForm.name, email: editForm.email };
        localStorage.setItem("user", JSON.stringify(updated));

        // Dispatch storage event to notify other components if they listen
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to update local storage", e);
      }
    }

    setIsEditing(false);
    setMessage("Profile updated successfully!");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage("All password fields are required");
      setMessageType("error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New password and confirm password do not match");
      setMessageType("error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return;
    }

    setMessage("Password changed successfully!");
    setMessageType("success");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      about: profile.about,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-1">
      <div
        className={`${themeUtils.getBgColor(
          "card"
        )} rounded-2xl shadow-xl overflow-hidden border`}
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        {/* Tabs */}
        <div
          className="border-b"
          style={{ borderColor: themeUtils.getBorderColor() }}
        >
          <div className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${activeTab === "profile" ? "shadow-sm" : ""
                }`}
              style={{
                backgroundColor:
                  activeTab === "profile" ? theme.headerBg : "transparent",
                color:
                  activeTab === "profile"
                    ? "#FFFFFF"
                    : themeUtils.getTextColor(false),
                borderBottom:
                  activeTab === "profile"
                    ? `3px solid ${theme.headerBg}`
                    : "3px solid transparent",
              }}
              onClick={() => setActiveTab("profile")}
            >
              <div className="flex items-center justify-center gap-2  ">
                <User size={20} />
                <span>Profile Information</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${activeTab === "password" ? "shadow-sm" : ""
                }`}
              style={{
                backgroundColor:
                  activeTab === "password" ? theme.headerBg : "transparent",
                color:
                  activeTab === "password"
                    ? "#FFFFFF"
                    : themeUtils.getTextColor(false),
                borderBottom:
                  activeTab === "password"
                    ? `3px solid ${theme.headerBg}`
                    : "3px solid transparent",
              }}
              onClick={() => setActiveTab("password")}
            >
              <div className="flex items-center justify-center gap-2">
                <Lock size={20} />
                <span>Security</span>
              </div>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className="p-4 mx-6 mt-6 rounded-lg animate-pulse"
            style={{
              backgroundColor:
                messageType === "success" ? "#d1fae5" : "#fee2e2",
              color: messageType === "success" ? "#065f46" : "#991b1b",
            }}
          >
            <div className="flex items-center gap-2">
              {messageType === "success" ? (
                <Check size={18} />
              ) : (
                <X size={18} />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="p-3 pl-5">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Profile Header */}
              <div
                className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b"
                style={{ borderColor: themeUtils.getBorderColor() }}
              >
                <div className="relative group">
                  <img
                    src="https://picsum.photos/seed/user123/150/150.jpg"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                    style={{ borderColor: theme.headerBg }}
                  />
                  <button
                    className="absolute bottom-2 right-2 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                    style={{ backgroundColor: theme.headerBg }}
                  >
                    <Camera size={18} style={{ color: "#FFFFFF" }} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2
                    className="text-3xl font-bold mb-1"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    {profile.name}
                  </h2>
                  <p
                    className="flex items-center justify-center sm:justify-start gap-2"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    <Mail size={16} />
                    {profile.email}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div
                    className="rounded-xl p-2"
                    style={{
                      background: `linear-gradient(to right, ${theme.headerBg ? `${theme.headerBg}10` : "#eef2ff"
                        }, ${theme.headerBg ? `${theme.headerBg}05` : "#f0fdf4"
                        })`,
                    }}
                  >
                    <h3
                      className="text-sm font-semibold mb-3 uppercase tracking-wide"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      About Me
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: themeUtils.getTextColor(true) }}
                    >
                      {profile.about}
                    </p>
                  </div>
                  <button
                    className="w-full sm:w-auto px-8 py-3 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(to right, ${theme.headerBg || "#6366f1"
                        }, ${theme.navbarBg || "#93c5fd"})`,
                      focusRingColor: theme.headerBg
                        ? `${theme.headerBg}40`
                        : "#818cf8",
                    }}
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      About
                    </label>
                    <textarea
                      value={editForm.about}
                      onChange={(e) =>
                        setEditForm({ ...editForm, about: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 resize-none"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      className="flex-1 px-6 py-3 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(to right, ${theme.headerBg || "#6366f1"
                          }, ${theme.navbarBg || "#93c5fd"})`,
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}40`
                          : "#818cf8",
                      }}
                      onClick={handleUpdateProfile}
                    >
                      <Check size={20} />
                      Save Changes
                    </button>
                    <button
                      className="flex-1 px-6 py-3 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: themeUtils.getBorderColor(),
                      }}
                      onClick={handleCancelEdit}
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: theme.headerBg
                      ? `${theme.headerBg}20`
                      : "#e0e7ff",
                  }}
                >
                  <Lock
                    className="text-indigo-600"
                    size={28}
                    style={{ color: theme.headerBg || "#6366f1" }}
                  />
                </div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: themeUtils.getTextColor(true) }}
                >
                  Change Password
                </h2>
                <p style={{ color: themeUtils.getTextColor(false) }}>
                  Ensure your account is secure
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="w-5 h-5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      />
                    </div>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="w-5 h-5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      />
                    </div>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: themeUtils.getTextColor(false) }}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="w-5 h-5"
                        style={{ color: themeUtils.getTextColor(false) }}
                      />
                    </div>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                        color: themeUtils.getTextColor(true),
                        focusRingColor: theme.headerBg
                          ? `${theme.headerBg}20`
                          : "#e0e7ff",
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="w-full px-6 py-3 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                  style={{
                    background: `linear-gradient(to right, ${theme.headerBg || "#6366f1"
                      }, ${theme.navbarBg || "#93c5fd"})`,
                    focusRingColor: theme.headerBg
                      ? `${theme.headerBg}40`
                      : "#818cf8",
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
