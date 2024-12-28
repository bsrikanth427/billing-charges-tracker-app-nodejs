const monthMaintainanceModel = require("../models/monthMaintainance");
const { fetchExpensesByMonthYear } = require("./expenseService");
const { fetchAllOwners } = require("./ownerService");

async function saveMonthlyMaintananceForFlat(monthMaintainanceObj) {
    try {
        console.log("MonthMaintainance is about to be saved/updated:", monthMaintainanceObj);

        // Use findByIdAndUpdate to update or create the document
        const monthMaintainanceDoc = await monthMaintainanceModel.findByIdAndUpdate(
            monthMaintainanceObj.monthYear, // _id to search for (currentMonthYear)
            {
                monthMaintainance: monthMaintainanceObj.monthMaintainance,
                totalMonthExpenses: monthMaintainanceObj.totalMonthExpenses,
                monthMaintainanceAmountReceived: monthMaintainanceObj.monthMaintainanceAmountReceived,
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create the document if it doesn't exist
            }
        );

        console.log(`MonthMaintainance for ${monthMaintainanceObj.monthYear} has been saved/updated:`, monthMaintainanceDoc);
        return monthMaintainanceDoc; // Return the updated document if needed
    } catch (error) {
        console.error("Error saving or updating MonthMaintainance:", error.message);
        throw error; // Propagate the error for further handling
    }
}

async function calculateMonthlyMaintananceForFlat(monthExpenses) {
    try {
        console.log("Calculating MonthMaintainance for flat:", monthExpenses);
        const allOwners = await fetchAllOwners();
        if (!allOwners) {
            throw new Error("No owners found to calculate maintainance.");
        }
        const totalMaintainanceAmount = monthExpenses.totalMonthExpenseAmount;;
        const ownerMaintainances = allOwners.map((owner) => {
            const ownerMaintainance = {
                flatNo: owner.flatNo,
                amount: totalMaintainanceAmount / allOwners.length,
                status: "Pending",
            };
            return ownerMaintainance;
        });

        const monthMaintainanceObj = {
            monthYear: monthExpenses.monthYear,
            monthMaintainance: ownerMaintainances,
            totalMonthExpenses: totalMaintainanceAmount,
            monthMaintainanceAmountReceived: 0,
        };
        const result = saveMonthlyMaintananceForFlat(monthMaintainanceObj);
        return result;
    } catch (error) {
        console.error("Error calculating maintainance amount:", error.message);
        throw new Error(`Error calculating maintainance amount: ${error.message}`);
    }

}

async function fetchMonthMaintainanceByMonthYear(monthYear) {
    console.log("Inside monthMaintainanceService's fetchMonthMaintainanceByMonthYear: " + monthYear);
    try {
        const monthMaintainance = await monthMaintainanceModel.findById(monthYear);
        console.log("MonthMaintainance from db-table:", monthMaintainance);
        return monthMaintainance;
    } catch (error) {
        console.error("Error while fetching MonthMaintainance:", error);
        throw new Error(`Failed to fetch MonthMaintainance: ${error.message}`);
    }
}

module.exports = { saveMonthlyMaintananceForFlat, fetchMonthMaintainanceByMonthYear, calculateMonthlyMaintananceForFlat };