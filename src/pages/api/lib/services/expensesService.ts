import type { User } from "@prisma/client";
import { ExpensesRepository } from "../repositories/expensesRepo";
import type { GetExpensesQuery } from "../../schemas/schemas";
import type { CategorySpending, Expense } from "@/types/types";

export class ExpensesService {
  static async getExpenses(user: User, query: GetExpensesQuery) {
    return ExpensesRepository.getAllExpenses(user, query);
  }

  static async getExpensesTotalAmount(user: User, query: GetExpensesQuery) {
    return ExpensesRepository.getTotalExpensesForMonth(user, query);
  }

  static async createExpense(expense: Expense, user: User) {
    return ExpensesRepository.createExpense(expense, user)
  }

  static async updateExpense(expense: Expense, user: User) {
    return ExpensesRepository.updateExpense(expense, user)
  }

  static async getExpensesDashboard(user: User, query: GetExpensesQuery) {
    const expenses = await ExpensesRepository.getAllExpenses(user, query);

    //1. expensesTotalAmount
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0)

    //2. Categories with expenses and totalamount
    const categoriesWithExpenses: CategorySpending[] = []
    // const categoriesWithExpenses = [
    // { name: '', id: '', expenses: [{desc: '', amount: 10}], total: 100 },
    // ]

    expenses.forEach(expense => {
      //check if category already in the array
      const categoryInArray = categoriesWithExpenses.find(category => category.id === expense.category.id)
      if (categoryInArray) {
        //add the expense and sum to totalAmount
        categoryInArray.expenses.push({ ...expense, date: expense.date.toDateString() })
        categoryInArray.totalSpent += expense.amount
      } else {
        //add the category, the expense and sum 
        categoriesWithExpenses.push({
          id: expense.category.id,
          name: expense.category.name,
          expenses: [{ ...expense, date: expense.date.toDateString() }],
          totalSpent: expense.amount
        }, 
      )
      }
    });

    //3. 5 last expenses
    const lastFiveExpenses = expenses.slice(0,5)

    return {totalAmount, categoriesWithExpenses, lastFiveExpenses}
  }
}