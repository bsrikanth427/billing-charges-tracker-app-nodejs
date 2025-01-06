const express = require("express");
const router = express.Router();
const { updateFundsTransactionsByExpenseId } = require("../services/fundsTransactionService");
const { saveMonthlyMaintananceForFlat, fetchMonthMaintainanceByMonthYear } = require("../services/maintainanceService");
const monthMaintainance = require("../models/monthMaintainance");

router.post("/monthmaintainance", async (req, res) => {
  try {
    console.log("calculateMonthlyMaintananceForFlat-requestBody: ", req.body);
    const result = await saveMonthlyMaintananceForFlat(req.body);
    if (!result) {
      throw new Error("Error saving Monthly maintainance: ", JSON.stringify(fundsModel));
    }
    const corpusFund = corpusFundModel(req.body);
    console.log("Updating corpusFund: ", corpusFund);
    const updatedCorpusFund = await updateFundsTransactionsByExpenseId(corpusFund);
    console.log("corpusFund updated: ", updatedCorpusFund);
    if (!updatedCorpusFund) {
      throw new Error("Error updating corpus fund: ", JSON.stringify(updatedCorpusFund));
    }
    res.status(200).json({
      message: `Monthly maintainance for the flat have been calculated successfully`,
      data: { monthMaintainance, updatedCorpusFund }
    });

  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({
      message: "Error calculating monthly maintainance for the flat",
      error: error.message,
    });
  }
});

router.get("/monthmaintainance/:id", async (req, res) => {

  try {
    const { id } = req.params;
    console.log("fetch-month-maintainance-by-id request: " + id);
    const maintainance = await fetchMonthMaintainanceByMonthYear(id);
    if (maintainance) {
      res.status(200).json({
        message: `Monthly maintainance for the monthYear: ${id}`,
        data: maintainance,
      });
    } else {
      res.status(404).json({
        message: `Monthly maintainance for the monthYear: ${id} not found`,
        data: maintainance,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", data: error.message });
  }
});


const corpusFundModel = (reqBody) => {
  console.log("corpusFundModel:: ", reqBody);
  return {
    name: "MonthlyMaintainance",
    amount: reqBody.monthMaintainanceAmountReceived,
    maintainancePerFlat: reqBody.maintainancePerFlat,
    type: "CREDIT",
    description: "CreditingMonthlyMaintainanceFor  " + reqBody.monthYear,
    expenseId: reqBody.monthYear
  };
};

module.exports = router;