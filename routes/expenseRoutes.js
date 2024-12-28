// routes/expenseRoute.js
const express = require("express");
const router = express.Router();
const { saveOrUpdateExpenses, fetchExpensesByMonthYear, deleteExpenseByMonthYear, deleteAllExpenses } = require("../services/expenseService");  // Import the function
const { saveFundsTransactions, updateFundsTransactionsByExpenseId, getOutstandingBalance } = require("../services/fundsTransactionService");
const { saveMonthlyMaintananceForFlat, fetchMonthMaintainanceByMonthYear, calculateMonthlyMaintananceForFlat } = require("../services/maintainanceService");
// POST route to save or update expenses
router.post("/expenses", async (req, res) => {
  try {
    console.log("postExpenses-requestBody: ", req.body);
    const expenseModel = extractExpenses(req);
    const fundsModel = corpusFundModel(expenseModel);
    console.log("Updating corpusFund: ", fundsModel);
    const updatedFunds = await saveFundsTransactions(fundsModel);
    console.log("corpusFund updated: ", updatedFunds);
    if (!updatedFunds) {
      throw new Error("Error updating corpus fund: ", JSON.stringify(fundsModel));
    }
    console.log("getOutstandingBalance: ");
    const outstandingBalance = await getOutstandingBalance();
    if (!outstandingBalance) {
      throw new Error("Error fetching outstanding balance: ", JSON.stringify(outstandingBalance));
    }
    expenseModel.currentCorpusFund = outstandingBalance;
    const savedExpense = await saveOrUpdateExpenses(expenseModel);
    console.log("savedExpense: ", savedExpense);
    if (!savedExpense) {
      throw new Error("Error saving expenses: ", JSON.stringify(expenseModel));
    }
    const savedMonthMaintainances = await calculateMonthlyMaintananceForFlat(expenseModel);
    if (!savedMonthMaintainances) {
      throw new Error("Error saving MonthlyMaintananceForFlat: ", JSON.stringify(expenseModel));
    }
    res.status(200).json({
      message: `Expenses have been saved/updated successfully`,
      data: { savedExpense, updatedFunds, savedMonthMaintainances },
    });

  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({
      message: "Error saving or updating expenses",
      error: error.message,
    });
  }
});

// POST route to save or update expenses
router.put("/expenses", async (req, res) => {
  try {
    console.log("putExpenses-requestBody: ", req.body);
    const expenseModel = extractExpenses(req);
    const fundsModel = corpusFundModel(expenseModel);
    console.log("Updating corpusFund: ", fundsModel);
    const updatedFunds = await updateFundsTransactionsByExpenseId(fundsModel);
    console.log("corpusFund updated: ", updatedFunds);
    if (!updatedFunds) {
      throw new Error("Error updating corpus fund: ", JSON.stringify(fundsModel));
    }
    const updatedExpense = await saveOrUpdateExpenses(expenseModel);
    console.log("updatedExpense: ", updatedExpense);
    if (!updatedExpense) {
      throw new Error("Error updating expenses: ", JSON.stringify(expenseModel));
    }
    res.status(200).json({
      message: `Expenses have been saved/updated successfully`,
      data: { updatedExpense, updatedFunds },
    });

  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({
      message: "Error saving or updating expenses",
      error: error.message,
    });
  }
});


router.get("/expenses/:id", async (req, res) => {

  try {
    const { id } = req.params;
    console.log("fetch-expense-by-id request: " + id);
    const expense = await fetchExpensesByMonthYear(id);
    if (expense) {
      res.status(200).json({
        message: `Expense for the monthYear: ${id}`,
        data: expense,
      });
    } else {
      res.status(404).json({
        message: `Expense for the monthYear: ${id} not found`,
        data: expense,
      });
    }
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Internal server error", data: error.message });
  }
});

// Delete owner by ID
router.delete("/expenses/:monthYear", async (req, res) => {
  try {
    console.log("delete-expenses-by-monthYear request");
    const { monthYear } = req.params;
    const result = await deleteExpenseByMonthYear(monthYear); // Assume this function exists
    res.status(result.statusCode).json({ message: result.message, monthYear });
  } catch (error) {
    console.error("Error deleting expenses:", error);
    res.status(500).json({ message: "Internal server error", data: error.message });
  }
});


router.delete("/expenses", async (req, res) => {
  try {
    console.log("delete-all-expenses request");
    const result = await deleteAllExpenses(); // Assume this function exists
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error deleting expenses:", error);
    res.status(500).json({ message: "Internal server error", data: error.message });
  }

});



function extractExpenses(req) {
  // Destructure and validate inputs from req.body
  const { monthYear, totalMonthExpenses, monthlyExpenses = [] } = req.body;
  const totalExpensesAmount = Number(totalMonthExpenses) || 0;
  const previousCorpusFundAmount = Number(req.body.corpusFund) || 0;
  const currentCorpusFundAmout = previousCorpusFundAmount - totalExpensesAmount;
  const user = "Admin";
  // Map over monthlyExpenses to add createdBy and updatedBy
  const mappedExpenses = monthlyExpenses.map((expense) => ({
    ...expense, //spread operator to Preserve existing fields
    createdBy: user,
    updatedBy: user
  }));
  const expensesModel = {
    monthYear,
    monthlyExpenses: mappedExpenses, // Updated field name for clarity
    totalMonthExpenseAmount: totalExpensesAmount,
    previousCorpusFund: previousCorpusFundAmount,
    currentCorpusFund: currentCorpusFundAmout
  };
  console.log("expenseModel :", expensesModel);
  return expensesModel;
}


const corpusFundModel = (expenseModel) => {
  console.log("corpusFundModel:: ", expenseModel);
  return {
    name: "MonthlyMaintainance",
    amount: expenseModel.totalMonthExpenseAmount,
    type: "DEBIT",
    description: "DebitingMonthlyMaintainanceFor  " + expenseModel.monthYear,
    expenseId: expenseModel.monthYear
  };
};



module.exports = router;