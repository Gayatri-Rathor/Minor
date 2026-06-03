import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: String,
  title: String,
  amount: Number,
  category: String,
  date: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
});

export default mongoose.model("Expense", expenseSchema);