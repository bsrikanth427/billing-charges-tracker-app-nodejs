const ExpensesModel = require("../models/expense");

async function saveOrUpdateExpenses(expenseObj) {
    const monthYear = expenseObj.monthYear ? expenseObj.monthYear : getCurrentMonthYear();
    console.log("monthYear: " + monthYear); // Outputs: "11-2024"

    try {
        // Use findByIdAndUpdate to update or create the document
        const expenseDoc = await ExpensesModel.findByIdAndUpdate(
            monthYear, // _id to search for (currentMonthYear)
            {
                monthlyExpenses: expenseObj.monthlyExpenses,
                totalMonthExpenses: expenseObj.totalMonthExpenses,
                previousMonthCorpusFund: expenseObj.previousMonthCorpusFund,
                currentMonthCorpusFund: expenseObj.currentMonthCorpusFund,
            },
            { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates the doc if not found
        );

        console.log(`Expenses for ${monthYear} have been saved/updated with expenseDoc:`, expenseDoc);
        return expenseDoc; // Return the updated document if needed
    } catch (error) {
        console.error("Error saving or updating expenses:", error.message);
    }
}

async function fetchExpensesByMonthYear(monthYear) {
    console.log("Inside expensesService's fetchExpensesByMonthYear: " + monthYear);
    try {
        const expenses = await ExpensesModel.findById(monthYear);
        console.log("expenses from db-table:", expenses);
        return expenses;
    } catch (error) {
        console.error("Error while fetching expenses:", error);
        throw new Error(`Failed to fetch expenses: ${error.message}`);
    }

}


let deleteExpenseByMonthYear = async (monthYear) => {
    console.log("Inside expensesService's deleteExpenseByMonthYear: " + monthYear);
    try {
        const result = await ExpensesModel.deleteOne({ _id: monthYear });
        if (result.deletedCount === 0) {
            console.warn("No expenses with the provided monthYear:", monthYear);
            return { statusCode: 404, message: `Expenses not found for monthYear ${monthYear}` };
        }
        console.log("Expenses deleted successfully:", monthYear);
        return { statusCode: 200, message: "Expenses deleted successfully" };
    } catch (error) {
        console.error("Error deleting Expenses:", error);
        return { statusCode: 500, message: `Failed to delete Expenses for monthYear ${monthYear} due to  ${error.message}` };
    }
};


function getCurrentMonthYear() {
    const currentDate = new Date();
    return `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
}

module.exports = { saveOrUpdateExpenses, fetchExpensesByMonthYear, deleteExpenseByMonthYear };