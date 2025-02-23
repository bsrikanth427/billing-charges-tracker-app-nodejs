const FundsTransactionsModel = require("../models/fundsTransactions");


async function saveFundsTransactions(fundModel) {
    console.log("Inside fundsTransaction's saveFundsTransactions", fundModel);
    try {

        const updatedFundModel = await updateOutstandingBalance(fundModel, null);
        const newFunds = new FundsTransactionsModel(updatedFundModel);
        const savedFunds = await newFunds.save();
        console.log("Funds saved successfully:", savedFunds);
        return savedFunds;
    } catch (error) {
        console.error("Error while saving funds:", error);
        throw new Error(`Failed to save funds: ${error.message}`);
    }
}

async function updateFundsTransactionsByExpenseId(fundModel) {
    try {
        console.log("Attempting to update funds transaction with expense ID:", fundModel.expenseId);
        const updatedFundModel = await updateOutstandingBalance(fundModel, fundModel.maintainancePerFlat);
        const updatedFunds = await FundsTransactionsModel.findOneAndUpdate(
            { expenseId: updatedFundModel.expenseId, type: updatedFundModel.type }, // Match by expenseId and type
            { $set: updatedFundModel }, // Update fields
            {
                new: true, // Return the updated document
                upsert: true, // Insert if not found
            }
        );

        if (!updatedFunds) {
            throw new Error("No funds transaction updated or created.");
        }

        console.log("Funds transaction updated/created successfully:", {
            expenseId: updatedFunds.expenseId,
            ...updatedFunds._doc, // Log additional updated fields
        });

        return updatedFunds;
    } catch (error) {
        console.error("Error while updating funds transaction:", error.stack || error.message);
        throw new Error(`Failed to update funds transaction: ${error.message}`);
    }
}


async function updateOutstandingBalance(fundModel, maintainancePerFlat) {
    try {
        const outstandingBalance = await getOutstandingBalance();
        const currentOutstandingBalance = Number(outstandingBalance);
        const fundAmount = (maintainancePerFlat) ? maintainancePerFlat : fundModel.amount;
        if (fundModel.type === "CREDIT") {
            fundModel.outstandingBalance = currentOutstandingBalance + fundAmount;
        } else if (fundModel.type === "DEBIT") {
            fundModel.outstandingBalance = currentOutstandingBalance - fundAmount;
        }
        return fundModel;
    } catch (error) {
        console.error("Error updating outstanding balance:", error);
        throw error;
    }
}



let fetchAllFunds = async () => {
    console.log("Inside fundsTransaction's fetchAllFunds");
    try {
        // Sort by createdDate in descending order (-1)
        const funds = await FundsTransactionsModel.find().sort({ createdDate: -1 });
        console.log("Funds fetched successfully:");
        return funds;
    } catch (error) {
        console.error("Error while fetching funds:", error);
        throw new Error(`Failed to fetch funds: ${error.message}`);
    }
};

async function getOutstandingBalance() {
    try {
        const result = await FundsTransactionsModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
                        },
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    netAmount: { $subtract: ["$totalCredit", "$totalDebit"] },
                },
            },
        ]);

        console.log("Net amount:", result[0]?.netAmount || 0);
        return result[0]?.netAmount || 0; // Default to 0 if no documents
    } catch (error) {
        console.error("Error calculating net amount:", error.message);
        throw error;
    }
}


const deleteAll = async () => {
    try {
        console.log("Deleting all corpus funds records...");
        const response = await FundsTransactionsModel.deleteMany({});
        console.log("All corpus funds records deleted successfully:", response);
        return response; // Optional: Return the response if the caller needs it
    } catch (error) {
        console.error("Error deleting corpus funds records:", error.message);
        throw error; // Re-throw the error to allow the calling function to handle it
    }
};

module.exports = { saveFundsTransactions, fetchAllFunds, getOutstandingBalance, deleteAll, updateFundsTransactionsByExpenseId };