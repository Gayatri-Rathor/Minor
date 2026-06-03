import { useAuth } from "../context/AuthContext";

function ProfileCard() {
  const { user } = useAuth();
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center gap-3 px-3 py-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl mb-6">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
          {user?.name || "User"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {user?.email || ""}
        </p>
      </div>
    </div>
  );
}

export default ProfileCard;