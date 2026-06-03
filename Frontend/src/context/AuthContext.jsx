import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Optionally decode token to get user info
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        console.log("Token decode error:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);
    setIsAuthenticated(true);
    setUser(res.data.user);

    return res;
  };

  const register = async (data) => {
    const res = await registerUser(data);

    localStorage.setItem("token", res.data.token);
    setIsAuthenticated(true);
    setUser(res.data.user);

    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        login, 
        register, 
        logout,
        isAuthenticated,
        user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);