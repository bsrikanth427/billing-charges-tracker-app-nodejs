// routes/expenseRoute.js
const express = require("express");
const router = express.Router();
const { saveOrUpdateExpenses, fetchExpensesByMonthYear, deleteExpenseByMonthYear } = require("../services/expenseService");  // Import the function

// POST route to save or update expenses
router.post("/expenses", async (req, res) => {

  try {
    console.log("requestBody: ", req.body);
    const expenseObj = extractExpenses(req);
    const updatedExpenseDoc = await saveOrUpdateExpenses(expenseObj);
    console.log("updatedExpenseDoc: ", updatedExpenseDoc);
    res.status(200).json({
      message: `Expenses have been saved/updated`,
      data: updatedExpenseDoc,
    });
  } catch (error) {
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



function extractExpenses(req) {
  const expenseObj = {
    "monthlyExpenses": req.body.monthlyExpenses,
    "totalMonthExpenses": req.body.totalMonthExpenses,
    "previousMonthCorpusFund": req.body.previousMonthCorpusFund,
    "currentMonthCorpusFund": req.body.currentMonthCorpusFund
  }
  if (req.body.monthYear) {
    expenseObj.monthYear = req.body.monthYear;
    console.log("expenseObj.monthYear: ", expenseObj.monthYear);
  }
  return expenseObj;
}


module.exports = router;