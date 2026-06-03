import { useAuth } from "../context/AuthContext";

function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="profile-card">
      <div className="avatar">
        👤
      </div>

      <div>
        <h3>{user?.name || "User"}</h3>
        <p>{user?.email || "Smart Expense Tracker"}</p>
      </div>
    </div>
  );
}

export default ProfileCard;