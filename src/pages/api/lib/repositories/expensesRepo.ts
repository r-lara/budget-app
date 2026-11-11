import type { Expense } from "@/types/types";
import type { GetCategoriesSpentSchemaQuery, GetExpensesQuery } from "../../schemas/schemas";
import { prisma } from "../prisma";
import type { User } from "@prisma/client";

type Filters = {
  date?: { gte: Date, lt: Date }
}

export class ExpensesRepository {
  static async getAllExpenses(user: User, queryParams: GetExpensesQuery) {
    const { year, month } = queryParams;
    const filters: Filters = {};

    if (month && year) {
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
      const startOfNextMonth = new Date(Date.UTC(year, month, 1));
      filters.date = {
        gte: startOfMonth, // Greater than or equal to the first day of the month
        lt: startOfNextMonth, // Less than the first day of the next month
      }
    }

    return prisma.expenses.findMany({
      orderBy: {
        id: "desc", 
      },
      where: { authorId: user.id, ...filters },
      take: Number(queryParams.limit) || 1000,
      include: {
        category: true
      }
    });
  }

  static async createExpense(expense: Expense, user: User) {
    return prisma.expenses.create({
      data: {
        amount: expense.amount,
        description: expense.description,
        categoryId: expense.categoryId,
        authorId: user.id
      }
    })
  }
  
  static async updateExpense(expense: Expense, user: User) {
    return prisma.expenses.update({
      where: {
        id: expense.id,
      },
      data: {
        amount: expense.amount,
        description: expense.description,
        categoryId: expense.categoryId,
        authorId: user.id
      }
    })
  } 

  static async getTotalExpensesForMonth(user: User, queryParams: GetExpensesQuery) {
    const { year, month } = queryParams;
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const startOfNextMonth = new Date(Date.UTC(year, month, 1));
    
    const result = await prisma.expenses.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        authorId: user.id,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });

    return result._sum.amount ?? 0;
  }

  static async getTotalExpensesGroupByMonth(user: User, queryParams: GetCategoriesSpentSchemaQuery) {
    const { year, month } = queryParams;
    const filters: Filters = {};

    if (month && year) {
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
      const startOfNextMonth = new Date(Date.UTC(year, month, 1));
      filters.date = {
        gte: startOfMonth, // Greater than or equal to the first day of the month
        lt: startOfNextMonth, // Less than the first day of the next month
      }
    }
    
    return prisma.expenses.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
      where: {
        authorId: user.id,
        ...filters,
      },
    });
  }
}

