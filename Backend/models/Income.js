import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  userId: String,
  source: String,
  amount: Number,
  date: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
});

export default mongoose.model("Income", incomeSchema);