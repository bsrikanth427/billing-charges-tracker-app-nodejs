// models/expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Use currentMonthYear as _id
  monthlyExpenses: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  date: { type: Date, default: Date.now },
  totalMonthExpenses: { type: Number, required: true },
  totalSavingsAmount: { type: Number, required: false },
  netBalanceAmount: { type: Number, required: false }

});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
