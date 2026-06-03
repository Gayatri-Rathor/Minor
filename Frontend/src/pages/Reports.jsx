import { useExpense } from "../context/ExpenseContext";

const categoryConfig = {
  Food: { icon: "🍔", color: "from-orange-400 to-orange-600" },
  Travel: { icon: "✈️", color: "from-blue-400 to-blue-600" },
  Shopping: { icon: "🛍️", color: "from-pink-400 to-pink-600" },
  Bills: { icon: "📄", color: "from-slate-400 to-slate-600" },
  Education: { icon: "📚", color: "from-purple-400 to-purple-600" },
  Other: { icon: "📦", color: "from-teal-400 to-teal-600" },
};

function Reports() {
  const { expenses } = useExpense();

  const categories = ["Food", "Travel", "Shopping", "Bills", "Education", "Other"];

  const totalExpense = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  const getCategoryTotal = (category) =>
    expenses.filter((e) => e.category === category).reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Expense Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const total = getCategoryTotal(category);
          const pct = totalExpense > 0 ? ((total / totalExpense) * 100).toFixed(1) : 0;
          const config = categoryConfig[category];

          return (
            <div key={category} className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-lg shadow-sm`}>
                    {config.icon}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{category}</span>
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{pct}%</span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white">₹{total.toLocaleString("en-IN")}</h2>

              {/* Mini bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-surface-700 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Reports;