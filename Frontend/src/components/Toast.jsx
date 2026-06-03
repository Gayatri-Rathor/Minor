import { useNotifications } from "../context/NotificationsContext";

const typeStyles = {
  success: "bg-emerald-500 dark:bg-emerald-600",
  error: "bg-red-500 dark:bg-red-600",
  warning: "bg-amber-500 dark:bg-amber-600",
  info: "bg-primary-500 dark:bg-primary-600",
};

const typeIcons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

function Toast() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`${typeStyles[n.type] || typeStyles.info} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in-right`}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {typeIcons[n.type] || typeIcons.info}
          </span>
          <p className="text-sm font-medium flex-1">{n.message}</p>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-white/70 hover:text-white transition-colors text-lg font-bold flex-shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;