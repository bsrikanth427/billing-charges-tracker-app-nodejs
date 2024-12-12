const monthMaintainanceModel = require("../models/monthMaintainance");

async function saveOrUpdateExpenses(monthMaintainanceObj) {
    const monthYear = getCurrentMonthYear();
    console.log(monthYear); // Outputs: "11-2024"

    try {
        // Use findByIdAndUpdate to update or create the document
        const monthMaintainanceDoc = await monthMaintainanceModel.findByIdAndUpdate(
            monthYear, // _id to search for (currentMonthYear)
            {
                monthMaintainance: monthMaintainanceObj.monthMaintainanceArray,
                totalMonthExpenses: monthMaintainanceObj.totalMonthExpenses,
                monthMaintainanceAmountReceived: monthMaintainanceObj.monthMaintainanceAmountReceived,
                corpusFundAvailable: monthMaintainanceObj.corpusFundAvailable,
            },
            { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates the doc if not found
        );

        console.log(`MonthMaintainance for ${monthYear} have been saved/updated :`, monthMaintainanceDoc);
        return expenseDoc; // Return the updated document if needed
    } catch (error) {
        console.error("Error saving or updating MonthMaintainance:", error.message);
    }
}

function calculateMonthlyMaintananceForFlat(monthlyExpensesObj) {

}

function getCurrentMonthYear() {
    const currentDate = new Date();
    return `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
}

module.exports = { saveOrUpdateExpenses, fetchExpensesByMonthYear };