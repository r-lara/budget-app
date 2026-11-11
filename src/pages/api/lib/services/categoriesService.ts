import type { User } from "@prisma/client";
import { CategoriesRepo } from "../repositories/categoriesRepo";
import { ExpensesRepository } from "../repositories/expensesRepo";
import type { GetCategoriesSpentSchemaQuery} from "../../schemas/schemas";

export class CategoriesService {
  static async getUserCategories(user: User) {
    return CategoriesRepo.getCategories(user)
  }

  static async setDefaultCategories(userId: number) {
    return CategoriesRepo.setDefaultCategories(userId)
  }

  static async getCategorySpending(user: User, query: GetCategoriesSpentSchemaQuery) {
    const [categories, expenseTotals] = await Promise.all([
      CategoriesRepo.getCategories(user),
      ExpensesRepository.getTotalExpensesGroupByMonth(user, query),
    ]);

    return categories
      .map((category) => {
        const expenseTotal = expenseTotals.find(
          (expense) => expense.categoryId === category.id
        );

        return {
          id: category.id,
          name: category.name,
          totalSpent: expenseTotal?._sum.amount ?? 0,
        };
      })
      .filter((category) => category.totalSpent !== 0)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }
}
