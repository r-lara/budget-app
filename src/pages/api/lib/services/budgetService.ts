import type { User } from "@prisma/client"
import { BudgetRepo } from "../repositories/budgetRepo"
import { CategoriesRepo } from "../repositories/categoriesRepo"
import type { CreateBudget, GetBudgetsQuery } from "../../schemas/schemas";

export class BudgetService {
  static async getUserBudgets(user: User, query: GetBudgetsQuery) {
    const { month, year, includeExpenses } = query;
    if (includeExpenses && month && year) {
      const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      return BudgetRepo.getBudgetWithExpenses(user, startDate, endDate)  
    }
    return BudgetRepo.getBudgets(user)
  }

  static async createBudget(user: User,  budget: CreateBudget) {
    const { monthlyLimit, categoryId } = budget
    let existingCategory = await CategoriesRepo.getCategory(categoryId)
    if (!existingCategory) {
      //create category if does not exist 
      // existingCategory = await CategoriesRepo.createCategory(user, budget.category.name )
      throw "Category does not exist"
    }
    return BudgetRepo.upsertBudget(user, { monthlyLimit, categoryId: existingCategory.id })
  }
}