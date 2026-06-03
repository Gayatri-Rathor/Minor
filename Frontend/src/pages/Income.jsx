import { useState } from "react";
import IncomeModal from "../components/IncomeModal";
import { useIncome } from "../context/IncomeContext";

function Income() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const { incomes, deleteIncome } = useIncome();

  let filteredIncome = incomes.filter((i) =>
    i.source.toLowerCase().includes(search.toLowerCase())
  );

  if (sortOrder === "asc") filteredIncome.sort((a, b) => Number(a.amount) - Number(b.amount));
  if (sortOrder === "desc") filteredIncome.sort((a, b) => Number(b.amount) - Number(a.amount));

  const inputClass = "px-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Income</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/25 transition-all text-sm"
        >
          + Add Income
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="🔍 Search income..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} flex-1`} />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass}>
          <option value="none">Sort by</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {showModal && <IncomeModal closeModal={() => setShowModal(false)} />}

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-slate-100 dark:border-surface-700 shadow-card overflow-hidden">
        {filteredIncome.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">😐</p>
            <p className="text-slate-400 dark:text-slate-500 font-medium">No income records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-surface-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-surface-700">
                {filteredIncome.map((income) => (
                  <tr key={income._id} className="hover:bg-slate-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{income.source}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-500">+₹{Number(income.amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      {income.date ? new Date(income.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteIncome(income._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Income;