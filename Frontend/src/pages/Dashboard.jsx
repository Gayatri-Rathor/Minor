import { useExpense } from "../context/ExpenseContext";
import { useIncome } from "../context/IncomeContext";
import { useBudget } from "../context/BudgetContext";
import { useAuth } from "../context/AuthContext";

const statCards = [
  { key: "income", label: "Total Income", icon: "💰", color: "from-emerald-400 to-emerald-600", textColor: "text-emerald-600 dark:text-emerald-400" },
  { key: "expense", label: "Total Expense", icon: "💸", color: "from-red-400 to-red-600", textColor: "text-red-600 dark:text-red-400" },
  { key: "balance", label: "Balance", icon: "📊", color: "from-blue-400 to-blue-600", textColor: "text-blue-600 dark:text-blue-400" },
  { key: "budget", label: "Budget", icon: "🎯", color: "from-amber-400 to-amber-600", textColor: "text-amber-600 dark:text-amber-400" },
];

function Dashboard() {
  const { expenses } = useExpense();
  const { incomes } = useIncome();
  const { budget } = useBudget();
  const { user } = useAuth();

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = totalIncome - totalExpense;

  const values = { income: totalIncome, expense: totalExpense, balance, budget };

  const activities = [
    ...expenses.map((e) => ({ type: "Expense", title: e.title, amount: e.amount, date: e.date })),
    ...incomes.map((i) => ({ type: "Income", title: i.source, amount: i.amount, date: i.date })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your financial overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-slate-100 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform`}>
                {card.icon}
              </span>
            </div>
            <h2 className={`text-2xl font-bold ${card.textColor}`}>
              ₹{values[card.key]?.toLocaleString("en-IN")}
            </h2>
          </div>
        ))}
      </div>

      {/* Budget Warning */}
      {budget > 0 && totalExpense > budget * 0.8 && (
        <div className={`mb-6 p-4 rounded-xl border ${totalExpense > budget ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"}`}>
          <span className="font-semibold">{totalExpense > budget ? "🚨 Budget Exceeded!" : "⚠️ Budget Warning!"}</span>
          {" "}You've spent ₹{totalExpense.toLocaleString("en-IN")} of your ₹{budget.toLocaleString("en-IN")} budget ({Math.round((totalExpense / budget) * 100)}%).
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-slate-100 dark:border-surface-700 shadow-card">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-surface-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h2>
        </div>

        {activities.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-400 dark:text-slate-500 font-medium">No activity yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start by adding an expense or income</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-surface-700">
            {activities.map((activity, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    activity.type === "Expense" ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"
                  }`}>
                    {activity.type === "Expense" ? "↑" : "↓"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{activity.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {activity.date ? new Date(activity.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${
                  activity.type === "Expense" ? "text-red-500" : "text-emerald-500"
                }`}>
                  {activity.type === "Expense" ? "-" : "+"}₹{Number(activity.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;