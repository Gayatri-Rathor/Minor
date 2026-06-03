import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getIncome,
  addIncome,
  deleteIncome,
} from "../services/api";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const res = await getIncome();

      const data = res.data?.incomes || res.data;

      setIncomes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.log("Income fetch error:", error);
      setIncomes([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchIncome();
    }
  }, [isAuthenticated]);

  const addNewIncome = async (data) => {
    await addIncome(data);
    fetchIncome();
  };

  const removeIncome = async (id) => {
    await deleteIncome(id);
    fetchIncome();
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