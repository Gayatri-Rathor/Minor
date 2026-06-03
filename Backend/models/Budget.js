import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
});

export default mongoose.model("Budget", budgetSchema);