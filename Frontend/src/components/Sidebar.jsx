import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfileCard from "./ProfileCard";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/expenses", label: "Expenses", icon: "💸" },
  { path: "/income", label: "Income", icon: "💰" },
  { path: "/budget", label: "Budget", icon: "🎯" },
  { path: "/reports", label: "Reports", icon: "📈" },
  { path: "/ai-advisor", label: "AI Advisor", icon: "🤖" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-800 border-r border-slate-200 dark:border-surface-700 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            💎 ExpenseAI
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* Profile */}
        <div className="px-4">
          <ProfileCard />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-surface-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            ExpenseAI v2.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;