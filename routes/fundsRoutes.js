const express = require("express");
const router = express.Router();
const { saveFundsTransactions, fetchAllFunds, getOutstandingBalance, deleteAll } = require("../services/fundsTransactionService");

router.post("/funds", async (req, res) => {

    try {
        console.log("save-funds-request ", req.body);
        const fundsRequest = extractFundsModel(req.body);
        console.log("fundsRequest" + fundsRequest);
        const updatedFundsDoc = await saveFundsTransactions(fundsRequest);
        console.log("saved Funds: ", updatedFundsDoc);
        res.status(200).json({
            message: `Funds have been saved/updated`,
            data: updatedFundsDoc,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving or updating funds",
            error: error.message,
        });
    }
});

router.get("/funds", async (req, res) => {
    try {
        console.log("fetch-all-funds-request ");
        const funds = await fetchAllFunds();
        if (funds) {
            res.status(200).json({
                message: `List of funds`,
                data: funds,
            });
        }

    } catch (error) {
        console.error("error fetching funds ", error);
        res.status(500).json({
            message: "Error fetching funds",
            data: error.message,
        });
    }

});

router.get("/funds/balance", async (req, res) => {
    try {
        console.log("fetch-funds-balance");
        const balance = await getOutstandingBalance();
        res.status(200).json({
            message: "Available outstanding balance",
            data: balance || 0,
        });

    } catch (error) {
        console.error("error fetching funds  outstanding balance", error);
        res.status(500).json({
            message: "Error fetching funds outstanding balance",
            data: error.message,
        });
    }

});

router.delete("/funds", async (req, res) => {
    console.log("delete-all-funds-request ");
    try {
        await deleteAll();
        res.status(200).json({
            message: "Deleted  All Funds"
        });
    } catch (error) {
        console.error("error fetching funds  outstanding balance", error);
        res.status(500).json({
            message: "error deleting all funds",
            data: error.message,
        });
    }

});

function extractFundsModel(reqBody) {
    let finalBalanceAmount = Number(reqBody.outstandingBalance);
    const transactionAmount = Number(reqBody.amount);

    if (reqBody.type === "CREDIT") {
        finalBalanceAmount += transactionAmount;
    } else if (reqBody.type === "DEBIT") {
        finalBalanceAmount -= transactionAmount;
    }
    console.log("finalBalanceAmount " + finalBalanceAmount);
    const fundsModel = {
        "name": reqBody.name,
        "amount": reqBody.amount,
        "type": reqBody.type,
        "description": reqBody.description,
        "month": reqBody.month,
        "year": reqBody.year,
        "outstandingBalance": finalBalanceAmount

    };
    return fundsModel;
}

module.exports = router;

