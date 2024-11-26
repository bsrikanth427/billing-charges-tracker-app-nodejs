// routes/expenseRoute.js
const express = require("express");
const router = express.Router();
const { saveOrUpdateExpenses } = require("../services/expenseService");  // Import the function

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


function extractExpenses(req) {
  const expenseObj = {
    "monthlyExpenses": req.body.monthlyExpenses,
    "totalMonthExpenses": req.body.totalMonthExpenses,
    "totalSavingsAmount": req.body.totalSavingsAmount,
    "netBalanceAmount": req.body.netBalanceAmount
  }
  return expenseObj;
}


module.exports = router;