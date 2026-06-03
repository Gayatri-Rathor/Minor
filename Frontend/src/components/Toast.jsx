import { useNotifications } from "../context/NotificationsContext";

function Toast() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className="toast">
          <p>{n.message}</p>
          <button onClick={() => removeNotification(n.id)}>x</button>
        </div>
      ))}
    </div>
  );
}

export default Toast;