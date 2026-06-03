import {
  useExpense,
} from "../context/ExpenseContext";

function Reports() {
  const { expenses } =
    useExpense();

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Education",
    "Other",
  ];

  const getCategoryTotal =
    (category) => {
      return expenses
        .filter(
          (expense) =>
            expense.category ===
            category
        )
        .reduce(
          (acc, item) =>
            acc +
            Number(
              item.amount
            ),
          0
        );
    };

  return (
    <div className="dashboard">
      <h1>
        Expense Reports
      </h1>

      <div className="stats-grid">
        {categories.map(
          (category) => (
            <div
              key={category}
              className="stat-card"
            >
              <h3>
                {category}
              </h3>

              <h2>
                ₹
                {getCategoryTotal(
                  category
                )}
              </h2>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Reports;