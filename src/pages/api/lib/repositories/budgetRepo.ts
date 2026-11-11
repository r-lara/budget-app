import type { User } from "@prisma/client";
import { prisma } from "../prisma";
import type { CreateBudget } from "../../schemas/schemas";



export class BudgetRepo {
  static async getBudgets(user: User) {
    return prisma.budget.findMany({ 
      where: { authorId: user?.id ?? undefined }, 
      include: { category: true}
      })
  }

  static async upsertBudget(user: User, budget: CreateBudget) {
    return prisma.budget.upsert({
      where: {
        authorId_categoryId: {
          authorId: user.id,
          categoryId: budget.categoryId,
        },
      },
      create: { ...budget, authorId: user.id },
      update: { monthlyLimit: budget.monthlyLimit },
    });
  }

  static async getBudgetWithExpenses(user: User, startDate: Date, endDate: Date) {
    return prisma.budget.findMany({
      where: {authorId: user?.id ?? undefined},
      include: { category: {
        include: { 
          expenses: {
            where: {
              date: {
                gte: startDate,
                lte: endDate
              },
              authorId: user.id
            }
        }}
      } }
    })
  }
}