import type { User} from "@prisma/client";
import { prisma } from "../prisma";

export class CategoriesRepo {
  static async getCategories(user: User) {
    return prisma.categories.findMany({
      where: {
        OR: [
          { authorId: user.id },
          { authorId: null },
        ],
      },
    });
  }

  static async getCategory(id: number) {
    return prisma.categories.findUnique({ where: { id } })
  }

  static async createCategory(user: User, categoryName: string) {
    return prisma.categories.create({
      data: { name: categoryName, authorId: user.id }
    })
  }

  static async setDefaultCategories(userId: number) {
    return prisma.categories.createMany({
      data: [
        { name: "Food", authorId: userId },
        { name: "Transport", authorId: userId },
        { name: "Entertainment", authorId: userId },
        { name: "Utilities", authorId: userId },
        { name: "Health", authorId: userId },
      ]
    })
  }
}