import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  const data = await Expense.find({ userId: req.user.id });
  res.json(data);
};

export const addExpense = async (req, res) => {
  const data = await Expense.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(data);
};

export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};