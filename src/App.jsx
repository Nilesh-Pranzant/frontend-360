import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { menuConfig } from "./ui/layout/menuConfig";
import { useTheme, ThemeProvider } from "./ui/Settings/themeUtils";
import Sidebar from "./ui/layout/Sidebar";
import Header from "./ui/layout/Header";
import LoginPage from "./(auth)/Login";
import ForgotPasswordPage from "./(auth)/ForgotPass";
import OTPVerificationPage from "./(auth)/OtpVerification";
import ResetPasswordPage from "./(auth)/ResetPassword";
import SignUpPage from "./(auth)/SignUp";
import Profile from "./ui/Profile/Profile";
import Footer from "./ui/layout/Footer";
import Setting from "./ui/Settings/Settings";
import { API_URL } from "../config";
import { ToastProvider } from "./ui/common/CostumeTost";
import axios from "axios";

import AdminRoutes from "./admin/routes/AdminRoutes";
import ListCommunity from "./components/Master/CommunityMangement/Community/ListCommunity.jsx";
import UnitList from "./components/Master/CommunityMangement/Unit/UnitList.jsx"
import ListProperty from "./components/Master/CommunityMangement/Property/ListProperty.jsx"




// Create a CSS string for the hide-scrollbar class
const scrollbarStyles = `
  .hide-scrollbar {
    /* For IE and Edge */
    -ms-overflow-style: none;
    /* For Firefox */
    scrollbar-width: none;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    /* For Chrome, Safari, and Opera */
    display: none;
  }
`;

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme, themeUtils } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);

    // Inject the scrollbar styles into the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      if (response.data && response.data.success) {
        const { token, user: userData } = response.data;

        // Store both user data and token
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data?.message || "Login failed. Please check your credentials."
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "An error occurred during login. Please try again later."
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: themeUtils.getBgColor("default") }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: theme.headerBg || "#6366f1" }}
          />
        </div>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // ... (imports are already at top, ensure menuConfig is there)

  const RoleProtectedRoute = ({ children }) => {
    const location = useLocation();
    const userRole = user?.role || "user";

    // Check if the current path (or parent path) is allowed
    // We might need to match approximate paths if they have params
    // For now, strict match or startWith as per menuConfig logic
    const hasAccess = menuConfig.hasAccess(userRole, location.pathname);

    if (!hasAccess) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ShieldCheck size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeUtils.getTextColor(true) }}>Access Denied</h2>
          <p style={{ color: themeUtils.getTextColor(false) }}>You do not have permission to view this page.</p>
        </div>
      );
    }

    return children;
  };

  return (
    <div
      className="font-sans"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div
                className="flex h-screen overflow-hidden"
                style={{ backgroundColor: themeUtils.getBgGradient() }}
              >
                <Sidebar
                  isSidebarCollapsed={isSidebarCollapsed}
                  setIsSidebarCollapsed={setIsSidebarCollapsed}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    user={user}
                    onLogout={logout}
                  />

                  <main
                    className="flex-1 overflow-y-auto hide-scrollbar"
                    style={{
                      backgroundColor: themeUtils.getBgColor("default"),
                    }}
                  >
                    <div >
                      {/* Apply Role Protection to all inner routes */}
                      {/* Note: RoleProtectedRoute needs to wrap the Routes, but we need to ensure it only runs for inner routes if path matches */}
                      {/* Actually, Routes matches deeply. */}
                      <RoleProtectedRoute>
                        <Routes>
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Setting />} />



                          <Route path="/community" element={<ListCommunity />} />
                          <Route path="/unit" element={<UnitList />} />
                          <Route path="/property" element={<ListProperty />} />




                          {/* Add other specific routes here when their components are ready */}
                          <Route path="*" element={<div className="text-center mt-10 opacity-50">Select a menu item from the sidebar</div>} />
                        </Routes>
                      </RoleProtectedRoute>
                    </div>
                  </main>

                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
