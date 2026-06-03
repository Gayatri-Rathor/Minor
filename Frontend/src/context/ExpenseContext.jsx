import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getExpenses, addExpense, deleteExpense } from "../services/api";
import { useNotifications } from "./NotificationsContext";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      const data = res.data?.expenses || res.data;
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const addNewExpense = async (data) => {
    try {
      await addExpense(data);
      addNotification(`Expense "${data.title}" added — ₹${data.amount}`, "success");
      fetchExpenses();
    } catch (error) {
      addNotification("Failed to add expense", "error");
    }
  };

  const removeExpense = async (id) => {
    try {
      await deleteExpense(id);
      addNotification("Expense deleted", "success");
      fetchExpenses();
    } catch (error) {
      addNotification("Failed to delete expense", "error");
    }
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