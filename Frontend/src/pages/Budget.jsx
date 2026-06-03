import { useState } from "react";

import BudgetModal from "../components/BudgetModal";

import {
  useBudget,
} from "../context/BudgetContext";

import {
  useExpense,
} from "../context/ExpenseContext";

function Budget() {
  const [showModal, setShowModal] =
    useState(false);

  const { budget } =
    useBudget();

  const { expenses } =
    useExpense();

  const totalExpense =
    expenses.reduce(
      (acc, item) =>
        acc +
        Number(item.amount),
      0
    );

  const remainingBudget =
    budget - totalExpense;

  const percentage =
    budget > 0
      ? Math.min(
          (totalExpense /
            budget) *
            100,
          100
        )
      : 0;

  return (
    <div className="budget-page">
      <div className="page-header">
        <h1>Budget Manager</h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
        >
          Set Budget
        </button>
      </div>

      {showModal && (
        <BudgetModal
          closeModal={() =>
            setShowModal(false)
          }
        />
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Budget</h3>
          <h2>₹{budget}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Spent</h3>
          <h2>
            ₹{totalExpense}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Remaining</h3>
          <h2>
            ₹{remainingBudget}
          </h2>
        </div>
      </div>

      <div className="budget-progress-card">
        <h3>
          Budget Usage
        </h3>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width:
                `${percentage}%`,
            }}
          />
        </div>

        <p>
          {percentage.toFixed(
            0
          )}
          % Used
        </p>
      </div>
    </div>
  );
}

export default Budget;