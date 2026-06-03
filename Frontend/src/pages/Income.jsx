import { useState } from "react";

import IncomeModal from "../components/IncomeModal";

import {
  useIncome,
} from "../context/IncomeContext";

function Income() {
  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("none");

  const {
    incomes,
    deleteIncome,
  } = useIncome();

  let filteredIncome =
    incomes.filter((income) =>
      income.source
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (sortOrder === "asc") {
    filteredIncome.sort(
      (a, b) =>
        Number(a.amount) -
        Number(b.amount)
    );
  }

  if (sortOrder === "desc") {
    filteredIncome.sort(
      (a, b) =>
        Number(b.amount) -
        Number(a.amount)
    );
  }

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Income</h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
        >
          Add Income
        </button>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search Income"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

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
        <IncomeModal
          closeModal={() =>
            setShowModal(false)
          }
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredIncome.length === 0 ? (
  <div className="empty-state">
    No income records found 😐
  </div>
) : (
  filteredIncome.map((income) => (
    <tr key={income.id}>
      <td>{income.source}</td>
      <td>₹{income.amount}</td>
      <td>{income.date}</td>
      <td>
        <button onClick={() => deleteIncome(income.id)}>
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

export default Income;