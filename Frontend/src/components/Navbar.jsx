import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

function Navbar({ onMenuClick }) {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-surface-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="text-xl">{darkMode ? "☀️" : "🌙"}</span>
        </button>

        <NotificationBell />

        <button
          onClick={logout}
          className="ml-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;