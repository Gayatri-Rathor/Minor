import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <input type="text" placeholder="Search transactions..." />
      </div>

      <div className="navbar-right">
        <NotificationBell />

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;