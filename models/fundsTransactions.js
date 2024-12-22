// models/expense.js
const mongoose = require("mongoose");

const fundsTransactionsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: String, required: true },
        description: { type: String, required: false },
        createdDate: { type: Date, default: Date.now },
        createdBy: { type: String, required: false },
        updatedDate: { type: Date, default: Date.now },
        updatedBy: { type: String, required: false },
        monthYear: { type: String, required: false },
        expenseId: { type: String, required: false }

    }

);

const fundsTransactions = mongoose.model("fundsTransactions", fundsTransactionsSchema);
module.exports = fundsTransactions;