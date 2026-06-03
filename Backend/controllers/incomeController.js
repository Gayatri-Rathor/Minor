import Income from "../models/Income.js";

export const getIncome = async (req, res) => {
  const data = await Income.find({ userId: req.user.id });
  res.json(data);
};

export const addIncome = async (req, res) => {
  const data = await Income.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(data);
};

export const deleteIncome = async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};