import { useState } from "react";
import { useIncome } from "../context/IncomeContext";

function IncomeModal({ closeModal }) {
  const { addIncome } = useIncome();

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.source || !formData.amount) return;
    addIncome(formData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-surface-800 w-full max-w-md rounded-2xl shadow-glass dark:shadow-glass-dark p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Income</h2>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="source"
            placeholder="Income source (e.g. Salary)"
            value={formData.source}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount (₹)"
            value={formData.amount}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-surface-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/25 transition-all">
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeModal;