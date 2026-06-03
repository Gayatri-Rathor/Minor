import Budget from "../models/Budget.js";

export const getBudget = async (req, res) => {
  const data = await Budget.findOne({ userId: req.user.id });
  res.json(data);
};

export const setBudget = async (req, res) => {
  await Budget.deleteMany({ userId: req.user.id });

  const data = await Budget.create({
    userId: req.user.id,
    amount: req.body.amount,
  });

  res.json(data);
};