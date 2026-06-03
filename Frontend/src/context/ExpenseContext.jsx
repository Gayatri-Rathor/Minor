import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../services/api";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      console.log("EXPENSE API RESPONSE:", res);

      // FIX: handle both possible API formats safely
      const data = res.data?.expenses || res.data;

      setExpenses(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching expenses:", error);
      setExpenses([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const addNewExpense = async (data) => {
    await addExpense(data);
    fetchExpenses();
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense: addNewExpense,
        deleteExpense: removeExpense,
        refreshExpenses: fetchExpenses,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);