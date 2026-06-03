import { useExpense } from "../context/ExpenseContext";
import { useIncome } from "../context/IncomeContext";
import { useBudget } from "../context/BudgetContext";

function AIAdvisor() {
  const { expenses } = useExpense();
  const { incomes } = useIncome();
  const { budget } = useBudget();

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const savings = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  let advice = [];

  if (totalExpense > totalIncome) {
    advice.push({ type: "error", icon: "🚨", text: "Your expenses exceed your income. Consider cutting non-essential spending." });
  }
  if (budget > 0 && totalExpense > budget) {
    advice.push({ type: "error", icon: "💳", text: `Budget exceeded by ₹${(totalExpense - budget).toLocaleString("en-IN")}. Review your spending categories.` });
  }
  if (budget > 0 && totalExpense > budget * 0.8 && totalExpense <= budget) {
    advice.push({ type: "warning", icon: "⚠️", text: "You've used over 80% of your budget. Spend carefully for the rest of the month." });
  }
  if (savingRate > 30) {
    advice.push({ type: "success", icon: "🌟", text: `Excellent! Your saving rate is ${savingRate}%. Keep up the great work!` });
  }
  if (savingRate >= 10 && savingRate <= 30) {
    advice.push({ type: "info", icon: "💡", text: `Your saving rate is ${savingRate}%. Try to aim for 30%+ for better financial health.` });
  }
  if (savingRate < 10 && totalIncome > 0) {
    advice.push({ type: "warning", icon: "📉", text: `Your saving rate is only ${savingRate}%. Try to reduce discretionary spending.` });
  }
  if (advice.length === 0) {
    advice.push({ type: "success", icon: "✅", text: "Your finances look healthy! Keep tracking your expenses." });
  }

  const typeColors = {
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  };

  const stats = [
    { label: "Income", value: totalIncome, color: "text-emerald-500", icon: "💰" },
    { label: "Expense", value: totalExpense, color: "text-red-500", icon: "💸" },
    { label: "Savings", value: savings, color: savings >= 0 ? "text-blue-500" : "text-red-500", icon: "🏦" },
    { label: "Saving Rate", value: `${savingRate}%`, isText: true, color: savingRate > 20 ? "text-emerald-500" : "text-amber-500", icon: "📊" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">AI Finance Advisor</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</span>
            </div>
            <h2 className={`text-2xl font-bold ${s.color}`}>
              {s.isText ? s.value : `₹${Number(s.value).toLocaleString("en-IN")}`}
            </h2>
          </div>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-slate-100 dark:border-surface-700 shadow-card">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-surface-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">🤖 AI Suggestions</h2>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {advice.map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border ${typeColors[item.type]} flex items-start gap-3`}>
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <p className="text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAdvisor;