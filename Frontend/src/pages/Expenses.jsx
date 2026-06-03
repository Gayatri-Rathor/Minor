import { useState } from "react";

import ExpenseModal from "../components/ExpenseModal";

import {
  useExpense,
} from "../context/ExpenseContext";

function Expenses() {
  const [showModal, setShowModal] =
    useState(false);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("none");

  const {
    expenses,
    deleteExpense,
  } = useExpense();

  let filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.category ===
            filter
        );

  filteredExpenses =
    filteredExpenses.filter(
      (expense) =>
        expense.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (sortOrder === "asc") {
    filteredExpenses.sort(
      (a, b) =>
        Number(a.amount) -
        Number(b.amount)
    );
  }

  if (sortOrder === "desc") {
    filteredExpenses.sort(
      (a, b) =>
        Number(b.amount) -
        Number(a.amount)
    );
  }

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
        >
          Add Expense
        </button>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search Expense"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>
            Education
          </option>
          <option>Other</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(
              e.target.value
            )
          }
        >
          <option value="none">
            Sort
          </option>

          <option value="asc">
            Low To High
          </option>

          <option value="desc">
            High To Low
          </option>
        </select>
      </div>

      {showModal && (
        <ExpenseModal
          closeModal={() =>
            setShowModal(false)
          }
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length === 0 ? (
  <div className="empty-state">
    No expenses found 😐
  </div>
) : (
  filteredExpenses.map((expense) => (
    <tr key={expense._id}>
      <td>{expense.title}</td>
      <td>₹{expense.amount}</td>
      <td>{expense.category}</td>
      <td>{expense.date ? new Date(expense.date).toLocaleDateString() : ""}</td>
      <td>
        <button onClick={() => deleteExpense(expense._id)}>
          Delete
        </button>
      </td>
    </tr>
  ))
)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;