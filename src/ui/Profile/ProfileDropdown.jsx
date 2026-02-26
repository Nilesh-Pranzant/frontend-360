// ProfileDropdown.js
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useTheme } from '../Settings/themeUtils';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, themeUtils } = useTheme();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  // Check if current path matches profile or settings
  const isProfileActive = location.pathname === '/profile';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center group p-0.5 rounded-full transition-all duration-300 hover:ring-2 hover:ring-white/10 active:scale-95 shadow-sm"
        style={{
          backgroundColor: themeUtils.getBgColor('hover'),
          boxShadow: isOpen ? `0 0 12px -2px ${theme.headerBg || '#6366f1'}30` : 'none'
        }}
      >
        <div
          className="relative w-8 h-8 rounded-full shadow-md flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: themeUtils.getBgColor('input'),
            border: `1.5px solid ${theme.headerBg || '#6366f1'}80`
          }}
        >
          <User
            className="w-5 h-5 transition-colors duration-300"
            style={{
              color: theme.headerBg || '#6366f1',
              backgroundColor: theme.headerBg ? `${theme.headerBg}10` : 'transparent',
              padding: '2px',
              borderRadius: '50%'
            }}
          />
        </div>
        <div className="ml-1.5 mr-1 hidden md:block">
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 opacity-60 group-hover:opacity-100 ${isOpen ? 'rotate-180' : ''}`} style={{ color: themeUtils.getTextColor(false) }} />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute -right-1 mt-1.5 w-52 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.05)] border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-2xl"
          style={{
            backgroundColor: themeUtils.getBgColor('card').includes('rgba') ? themeUtils.getBgColor('card') : `${themeUtils.getBgColor('card')}f5`,
            borderColor: `${themeUtils.getBorderColor()}15`
          }}
        >
          {/* Header Section - Modern Side-by-Side */}
          <div className="relative px-3 py-2.5 overflow-hidden group/header">
            {/* Background Accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: theme.headerBg || '#6366f1' }}
            />

            <div className="relative flex items-center gap-2.5">
              <div
                className="relative w-9 h-9 shrink-0 rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
                style={{
                  backgroundColor: theme.headerBg ? `${theme.headerBg}15` : '#6366f115',
                  border: `1px solid ${theme.headerBg || '#6366f1'}20`
                }}
              >
                <User
                  className="w-5 h-5 transition-transform duration-300 group-hover/header:scale-110"
                  style={{ color: theme.headerBg || '#6366f1' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold tracking-tight truncate leading-tight" style={{ color: themeUtils.getTextColor(true) }}>
                  {user?.name || user?.username || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] font-medium opacity-70 truncate mt-0.5" style={{ color: themeUtils.getTextColor(false) }}>
                  {user?.email || 'No email provided'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[8px] font-bold opacity-50 truncate uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5" style={{ color: themeUtils.getTextColor(false) }}>
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-1.5 pb-1.5 space-y-0.5 border-t" style={{ borderColor: `${themeUtils.getBorderColor()}10` }}>
            <p className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest opacity-40" style={{ color: themeUtils.getTextColor(false) }}>Account</p>

            <Link
              to="/profile"
              className="group flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
              style={{
                backgroundColor: isProfileActive ? (theme.headerBg ? `${theme.headerBg}10` : '#6366f110') : 'transparent',
                color: isProfileActive ? (theme.headerBg || '#6366f1') : themeUtils.getTextColor(true),
              }}
            >
              <User className={`w-3.5 h-3.5 transition-colors ${isProfileActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              className="group flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
              style={{
                backgroundColor: isSettingsActive ? (theme.headerBg ? `${theme.headerBg}10` : '#6366f110') : 'transparent',
                color: isSettingsActive ? (theme.headerBg || '#6366f1') : themeUtils.getTextColor(true),
              }}
            >
              <Settings className={`w-3.5 h-3.5 transition-colors ${isSettingsActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
              <span>Settings</span>
            </Link>

            <div className="pt-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-bold w-full rounded-lg transition-all duration-300 group hover:bg-red-500 hover:text-white active:scale-95"
                style={{
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)'
                }}
              >
                <LogOut className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;