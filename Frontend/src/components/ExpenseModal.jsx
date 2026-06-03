import { useState } from "react";
import {
  useExpense,
} from "../context/ExpenseContext";

function ExpenseModal({
  closeModal,
}) {
  const { addExpense } =
    useExpense();

  const [formData, setFormData] =
    useState({
      title: "",
      amount: "",
      category: "Food",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addExpense(formData);

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Expense</h2>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={
              handleChange
            }
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            onChange={
              handleChange
            }
          />

          <select
            name="category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
          >
            <option>
              Food
            </option>

            <option>
              Travel
            </option>

            <option>
              Shopping
            </option>

            <option>
              Bills
            </option>

            <option>
              Education
            </option>

            <option>
              Other
            </option>
          </select>

          <button type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;