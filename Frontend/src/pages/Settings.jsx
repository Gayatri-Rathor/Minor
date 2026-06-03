import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-slate-100 dark:border-surface-700 shadow-card mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">{user?.name || "User"}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-slate-100 dark:border-surface-700 shadow-card mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${darkMode ? "bg-primary-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center text-xs ${darkMode ? "translate-x-7" : "translate-x-0"}`}>
              {darkMode ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-slate-100 dark:border-surface-700 shadow-card">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">App Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Application</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">ExpenseAI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Version</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">2.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Stack</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">React + Tailwind + Node.js</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;