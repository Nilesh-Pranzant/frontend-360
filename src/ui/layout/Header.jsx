// Header.js
import { Menu } from "lucide-react";
import ProfileDropdown from "../Profile/ProfileDropdown";
import { useTheme } from "../Settings/themeUtils";

const Header = ({ sidebarOpen, setSidebarOpen, user, onLogout }) => {
  const { theme, themeUtils, ThemeToggleButton } = useTheme();

  return (
    <header
      className={`h-14 border-b z-30 transition-all duration-300 backdrop-blur-md flex items-center`}
      style={{
        backgroundColor: theme.mode === "Dark" ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: theme.mode === "Dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center justify-between w-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile menu button - Only visible when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.headerBg
                  ? `${theme.headerBg}10`
                  : "transparent",
                color: themeUtils.getTextColor(false),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.headerBg
                  ? `${theme.headerBg}20`
                  : "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.headerBg
                  ? `${theme.headerBg}10`
                  : "transparent";
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="hidden lg:flex flex-1 max-w-xl mx-8"></div>

        {/* Right side: Theme Toggle Button + ProfileDropdown */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button (Light/Dark mode) */}
          <ThemeToggleButton />

          {/* Profile Dropdown */}
          <ProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
