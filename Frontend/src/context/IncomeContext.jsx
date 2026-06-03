import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getIncome, addIncome, deleteIncome } from "../services/api";
import { useNotifications } from "./NotificationsContext";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const res = await getIncome();
      const data = res.data?.incomes || res.data;
      setIncomes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Income fetch error:", error);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchIncome();
    }
  }, [isAuthenticated]);

  const addNewIncome = async (data) => {
    try {
      await addIncome(data);
      addNotification(`Income "${data.source}" added — ₹${data.amount}`, "success");
      fetchIncome();
    } catch (error) {
      addNotification("Failed to add income", "error");
    }
  };

  const removeIncome = async (id) => {
    try {
      await deleteIncome(id);
      addNotification("Income deleted", "success");
      fetchIncome();
    } catch (error) {
      addNotification("Failed to delete income", "error");
    }
  };

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        addIncome: addNewIncome,
        deleteIncome: removeIncome,
        refreshIncome: fetchIncome,
        loading,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => useContext(IncomeContext);