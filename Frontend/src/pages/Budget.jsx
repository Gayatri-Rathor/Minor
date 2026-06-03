import { useState } from "react";
import BudgetModal from "../components/BudgetModal";
import { useBudget } from "../context/BudgetContext";
import { useExpense } from "../context/ExpenseContext";

function Budget() {
  const [showModal, setShowModal] = useState(false);
  const { budget } = useBudget();
  const { expenses } = useExpense();

  const totalExpense = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  const remainingBudget = budget - totalExpense;
  const percentage = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;
  const isOverBudget = totalExpense > budget && budget > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Budget Manager</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md shadow-amber-500/25 transition-all text-sm"
        >
          🎯 Set Budget
        </button>
      </div>

      {showModal && <BudgetModal closeModal={() => setShowModal(false)} />}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budget</span>
          <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">₹{budget.toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</span>
          <h2 className="text-2xl font-bold text-red-500 mt-1">₹{totalExpense.toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining</span>
          <h2 className={`text-2xl font-bold mt-1 ${remainingBudget >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            ₹{remainingBudget.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-slate-100 dark:border-surface-700 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Budget Usage</h3>
          <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : percentage > 80 ? "text-amber-500" : "text-emerald-500"}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="w-full h-4 bg-slate-100 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget ? "bg-gradient-to-r from-red-400 to-red-600" : percentage > 80 ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-gradient-to-r from-emerald-400 to-emerald-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isOverBudget && (
          <p className="mt-4 text-sm text-red-500 dark:text-red-400 font-medium">
            🚨 You have exceeded your budget by ₹{Math.abs(remainingBudget).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

export default Budget;