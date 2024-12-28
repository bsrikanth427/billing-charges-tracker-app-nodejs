const ExpensesModel = require("../models/ExpensesModel");

async function saveOrUpdateExpenses(expenseModel) {
    try {
        console.log("Expenses is about to be saved:", expenseModel);
        const savedExpenses = await ExpensesModel.findByIdAndUpdate(
            expenseModel.monthYear,
            {
                monthlyExpenses: expenseModel.monthlyExpenses,
                totalMonthExpenseAmount: expenseModel.totalMonthExpenseAmount,
                currentCorpusFund: expenseModel.currentCorpusFund,
                previousCorpusFund: expenseModel.previousCorpusFund

            },
            {
                new: true, // Return the updated document
                upsert: true, // Insert if not found
            }
        );
        if (!savedExpenses) {
            throw new Error("Failed to save or update expenses.");
        }
        console.log("Expenses saved successfully:", savedExpenses);
        return savedExpenses;

    } catch (error) {
        console.error("Error saving expenses:", error.message);
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

let deleteAllExpenses = async () => {
    console.log("Inside expensesService's deleteAllExpenses: ");
    try {
        const response = await ExpensesModel.deleteMany({});
        console.log("All Expenses deleted successfully:", response);
        return { statusCode: 200, message: `Expenses ${response.deletedCount} deleted successfully` };
    } catch (error) {
        console.error("Error deleting Expenses:", error);
        return { statusCode: 500, message: `Failed to delete Expenses  due to  ${error.message}` };

    }
}



function getCurrentMonthYear() {
    const currentDate = new Date();
    return `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
}

module.exports = { saveOrUpdateExpenses, fetchExpensesByMonthYear, deleteExpenseByMonthYear, deleteAllExpenses };