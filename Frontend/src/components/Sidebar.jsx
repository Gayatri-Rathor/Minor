import { NavLink } from "react-router-dom";
import ProfileCard from "./ProfileCard";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ExpenseAI</h2>
      </div>

      <ProfileCard />

      <div className="sidebar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <NavLink to="/income">Income</NavLink>
        <NavLink to="/budget">Budget</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/ai-advisor">AI Advisor</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;