import React, { createContext, useState, useEffect, useContext } from "react";
import { Sun, Moon } from "lucide-react"; // ← Added for toggle icons

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// Default color from index 0 of your palette
const defaultColor = { dark: "#3b82f6", light: "#93c5fd" };

const defaultTheme = {
  mode: "Dark",
  headerBg: defaultColor.dark,
  navbarBg: defaultColor.light,
  mood: "Night",
  activeColorCategory: "primary",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem("Theme");
    if (saved) {
      try {
        setTheme({ ...defaultTheme, ...JSON.parse(saved) });
      } catch {
        setTheme(defaultTheme);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--header-bg", theme.headerBg);
    root.style.setProperty("--navbar-bg", theme.navbarBg);

    document.body.className = document.body.className
      .replace(/mood-\w+/g, "")
      .replace(/mode-\w+/g, "")
      .trim();
    document.body.classList.add(`mood-${theme.mood.toLowerCase()}`);
    document.body.classList.add(`mode-${theme.mode.toLowerCase()}`);
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  // New: Toggle between Light and Dark mode
  const toggleThemeMode = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "Dark" ? "Light" : "Dark",
      mood: prev.mode === "Dark" ? "Day" : "Night",
    }));
  };

  const getTextColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return l > 0.5 ? "#000000" : "#FFFFFF";
  };

  const themeUtils = {
    getTextColor: (isPrimary = true) => {
      return theme.mode === "Dark"
        ? isPrimary
          ? "#FFFFFF"
          : "#E5E7EB"
        : isPrimary
          ? "#1F2937"
          : "#6B7280";
    },
    getBgColor: (variant = "default") => {
      if (variant === "card")
        return theme.mood === "Day" ? "#FFFFFF" : "#1F2937";
      if (variant === "input")
        return theme.mood === "Day" ? "#F9FAFB" : "#374151";
      if (variant === "hover")
        return theme.mood === "Day" ? "#F3F4F6" : "#374151";
      return theme.mood === "Day" ? "#F9FAFB" : "#111827";
    },
    getBorderColor: () => (theme.mood === "Day" ? "#E5E7EB" : "#374151"),
    getBgGradient: () =>
      theme.mood === "Day"
        ? "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        : "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950",
  };

  // Professional Theme Toggle Button
  const ThemeToggleButton = () => (
    <button
      onClick={toggleThemeMode}
      className="group relative inline-flex items-center h-8 w-15 rounded-full transition-all duration-500 focus:outline-none shadow-inner overflow-hidden"
      style={{
        backgroundColor: theme.mode === "Dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 43, 0.08)",
        backdropFilter: "blur(8px)",
        border: theme.mode === "Dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)"
      }}
      aria-label="Toggle dark/light mode"
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: theme.mode === "Dark"
            ? "linear-gradient(to right, #1e293b, #334155)"
            : "linear-gradient(to right, #f8fafc, #f1f5f9)",
          opacity: 0.5
        }}
      />
      <span
        className={`
          relative z-10 flex items-center justify-center h-6 w-6 rounded-full
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          shadow-[0_2px_10px_rgba(0,0,0,0.2)]
          ${theme.mode === "Dark" ? "translate-x-[32px]" : "translate-x-[4px]"}
        `}
        style={{
          background: theme.mode === "Dark" ? "#f8fafc" : "#1e293b",
        }}
      >
        {theme.mode === "Dark" ? (
          <Moon className="w-4 h-4 text-slate-800 animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-300" />
        )}
      </span>

      {/* Subtle indicator dots */}
      <div className={`absolute right-3 w-1 h-1 rounded-full transition-all duration-500 ${theme.mode === "Dark" ? "opacity-0 scale-50" : "opacity-30 bg-slate-400"}`} />
      <div className={`absolute left-3 w-1 h-1 rounded-full transition-all duration-500 ${theme.mode === "Dark" ? "opacity-30 bg-white" : "opacity-0 scale-50"}`} />
    </button>
  );

  return (
    <ThemeContext.Provider
      value={{ theme, updateTheme, themeUtils, ThemeToggleButton }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
