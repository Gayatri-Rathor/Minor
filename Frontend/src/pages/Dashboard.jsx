import {
  useExpense,
} from "../context/ExpenseContext";

import {
  useIncome,
} from "../context/IncomeContext";

import {
  useBudget,
} from "../context/BudgetContext";



function Dashboard() {
  const { expenses } =
    useExpense();

  const { incomes } =
    useIncome();

  const { budget } =
    useBudget();

  const totalExpense =
    expenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount),
      0
    );

  const totalIncome =
    incomes.reduce(
      (sum, item) =>
        sum +
        Number(item.amount),
      0
    );

  const balance =
    totalIncome -
    totalExpense;

  const activities = [
    ...expenses.map(
      (expense) => ({
        type: "Expense",
        title:
          expense.title,
        amount:
          expense.amount,
        date:
          expense.date,
      })
    ),
    ...incomes.map(
      (income) => ({
        type: "Income",
        title:
          income.source,
        amount:
          income.amount,
        date:
          income.date,
      })
    ),
  ].slice(0, 10);



  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Income</h3>
          <h2>
            ₹{totalIncome}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Expense</h3>
          <h2>
            ₹{totalExpense}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Balance</h3>
          <h2>
            ₹{balance}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Budget</h3>
          <h2>
            ₹{budget}
          </h2>
        </div>
      </div>

      <div className="chart-card">
        <h2>
          Recent Activity
        </h2>

        {activities.length ===
        0 ? (
          <p>
            No Activity
            Found
          </p>
        ) : (
          activities.map(
            (
              activity,
              index
            ) => (
              <div
                key={index}
                className="activity-item"
              >
                <strong>
                  {
                    activity.type
                  }
                </strong>

                <p>
                  {
                    activity.title
                  }
                </p>

                <p>
                  ₹
                  {
                    activity.amount
                  }
                </p>

                <small>
                  {
                    activity.date
                  }
                </small>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}


export default Dashboard;