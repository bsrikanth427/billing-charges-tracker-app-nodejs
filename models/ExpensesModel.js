// models/expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Use currentMonthYear as _id
  monthlyExpenses: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      createdBy: { type: String },
      createdDate: { type: Date, default: Date.now },
      updatedBy: { type: String, },
      updatedDate: { type: Date, default: Date.now },
    }
  ],
  totalMonthExpenseAmount: { type: Number, required: false },
  previousCorpusFund: { type: Number, required: false },
  currentCorpusFund: { type: Number, required: false }

});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
