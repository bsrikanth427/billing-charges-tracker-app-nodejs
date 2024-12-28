// models/expense.js
const mongoose = require("mongoose");

const monthMaintainanceSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // Use currentMonthYear as _id
    monthMaintainance: [
        {
            flatNo: { type: String, required: true },
            amount: { type: Number, required: true },
            status: { type: String, required: true },
            createdDate: { type: Date, default: Date.now },
            createdBy: { type: String, required: false },
            updatedDate: { type: Date, default: Date.now },
            updatedBy: { type: Date, required: false }
        }
    ],
    totalMonthExpenses: { type: Number, required: true },
    monthMaintainanceAmountReceived: { type: Number, required: false }
});

const monthMaintainance = mongoose.model("monthMaintainance", monthMaintainanceSchema);
module.exports = monthMaintainance;
