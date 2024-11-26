const ExpensesModel = require("../models/expense");

async function saveOrUpdateExpenses(expenseObj) {
    const monthYear = getCurrentMonthYear();
    console.log(monthYear); // Outputs: "11-2024"

    try {
        // Use findByIdAndUpdate to update or create the document
        const expenseDoc = await ExpensesModel.findByIdAndUpdate(
            monthYear, // _id to search for (currentMonthYear)
            {
                monthlyExpenses: expenseObj.monthlyExpenses,
                totalMonthExpenses: expenseObj.totalMonthExpenses,
                totalSavingsAmount: expenseObj.totalSavingsAmount,
                netBalanceAmount: expenseObj.netBalanceAmount,
            },
            { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates the doc if not found
        );

        console.log(`Expenses for ${monthYear} have been saved/updated with expenseDoc:`, expenseDoc);
        return expenseDoc; // Return the updated document if needed
    } catch (error) {
        console.error("Error saving or updating expenses:", error.message);
    }
}

function getCurrentMonthYear() {
    const currentDate = new Date();
    return `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
}

module.exports = { saveOrUpdateExpenses };