import { useState } from "react";
import { useNotifications } from "../context/NotificationsContext";

function NotificationBell() {
  const { notifications } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse-soft">
            {notifications.length}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-surface-800 rounded-xl shadow-glass dark:shadow-glass-dark border border-slate-200 dark:border-surface-700 z-50 animate-fade-in overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-surface-700">
            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Notifications</h4>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-slate-50 dark:border-surface-700 last:border-0">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;