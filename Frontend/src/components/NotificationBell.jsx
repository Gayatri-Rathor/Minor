import {
  useNotifications,
} from "../context/NotificationsContext";

function NotificationBell() {
  const {
    notifications,
  } =
    useNotifications();

  return (
    <div className="notification-bell">
      🔔

      <span>
        {
          notifications.length
        }
      </span>
    </div>
  );
}

export default NotificationBell;