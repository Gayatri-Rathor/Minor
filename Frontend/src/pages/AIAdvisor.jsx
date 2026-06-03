import {
  useExpense,
} from "../context/ExpenseContext";

import {
  useIncome,
} from "../context/IncomeContext";

import {
  useBudget,
} from "../context/BudgetContext";

function AIAdvisor() {
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

  const savings =
    totalIncome -
    totalExpense;

  const savingRate =
    totalIncome > 0
      ? (
          (savings /
            totalIncome) *
          100
        ).toFixed(1)
      : 0;

  let advice = [];

  if (
    totalExpense >
    totalIncome
  ) {
    advice.push(
      "Expenses are higher than income."
    );
  }

  if (
    budget > 0 &&
    totalExpense > budget
  ) {
    advice.push(
      "Budget limit exceeded."
    );
  }

  if (savingRate > 30) {
    advice.push(
      "Excellent saving habit."
    );
  }

  if (savingRate < 10) {
    advice.push(
      "Try increasing monthly savings."
    );
  }

  if (advice.length === 0) {
    advice.push(
      "Your finances are healthy."
    );
  }

  return (
    <div className="dashboard">
      <h1>
        AI Finance Advisor
      </h1>

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
          <h3>Savings</h3>
          <h2>
            ₹{savings}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Saving Rate</h3>
          <h2>
            {savingRate}%
          </h2>
        </div>
      </div>

      <div className="chart-card">
        <h2>
          AI Suggestions
        </h2>

        {advice.map(
          (
            suggestion,
            index
          ) => (
            <p key={index}>
              • {suggestion}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default AIAdvisor;