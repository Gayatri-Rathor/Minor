import { useState } from "react";

import {
  useIncome,
} from "../context/IncomeContext";

function IncomeModal({
  closeModal,
}) {
  const { addIncome } =
    useIncome();

  const [formData, setFormData] =
    useState({
      source: "",
      amount: "",
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

    addIncome(formData);

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Income</h2>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="source"
            placeholder="Income Source"
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

          <button type="submit">
            Save Income
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncomeModal;