import { useState } from "react";

import {
  useBudget,
} from "../context/BudgetContext";

function BudgetModal({
  closeModal,
}) {
  const { setBudget } =
    useBudget();

  const [amount, setAmount] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setBudget(amount);

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Set Budget</h2>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          <button type="submit">
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;