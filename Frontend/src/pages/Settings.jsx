import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="dashboard">
      <h1>Settings</h1>

      <div className="chart-card">
        <h2>Appearance</h2>

        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Enable Dark Mode
        </label>
      </div>

      <div className="chart-card">
        <h2>App Info</h2>
        <p>Smart Expense Tracker 2.0</p>
        <p>Version: 1.0</p>
      </div>
    </div>
  );
}

export default Settings;