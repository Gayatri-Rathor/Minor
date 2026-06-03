import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getBudget, setBudget } from "../services/api";
import { useNotifications } from "./NotificationsContext";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudgetState] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await getBudget();
      const data = res.data?.amount ?? res.data?.budget?.amount ?? res.data;
      setBudgetState(Number(data) || 0);
    } catch (error) {
      console.log("Budget fetch error:", error);
      setBudgetState(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudget();
    }
  }, [isAuthenticated]);

  const updateBudget = async (amount) => {
    try {
      await setBudget({ amount });
      addNotification(`Budget set to ₹${amount}`, "success");
      fetchBudget();
    } catch (error) {
      addNotification("Failed to update budget", "error");
    }
  };

  return (
    <BudgetContext.Provider value={{ budget, setBudget: updateBudget, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);