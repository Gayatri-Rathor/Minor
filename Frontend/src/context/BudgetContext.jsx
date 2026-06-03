import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getBudget,
  setBudget,
} from "../services/api";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudgetState] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await getBudget();

      const data =
        res.data?.amount ??
        res.data?.budget?.amount ??
        res.data;

      setBudgetState(Number(data) || 0);
      setLoading(false);
    } catch (error) {
      console.log("Budget fetch error:", error);
      setBudgetState(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudget();
    }
  }, [isAuthenticated]);

  const updateBudget = async (amount) => {
    await setBudget({ amount });
    fetchBudget();
  };

  return (
    <BudgetContext.Provider value={{ budget, setBudget: updateBudget, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);