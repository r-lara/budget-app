import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Resolved } from "@/test/types";
import type { User } from "@prisma/client";
import { CategoriesService } from "./categoriesService";
import { CategoriesRepo } from "../repositories/categoriesRepo";
import { ExpensesRepository } from "../repositories/expensesRepo";

vi.mock("../repositories/categoriesRepo", () => ({
  CategoriesRepo: {
    getCategories: vi.fn(),
    setDefaultCategories: vi.fn(),
  },
}));

vi.mock("../repositories/expensesRepo", () => ({
  ExpensesRepository: {
    getTotalExpensesGroupByMonth: vi.fn(),
  },
}));

const user = { id: 1 } as User;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CategoriesService.getUserCategories", () => {
  it("delegates to the repository with the same user", async () => {
    const expected = [{ id: 1, name: "Food" }];
    vi.mocked(CategoriesRepo.getCategories).mockResolvedValue(
      expected as Resolved<typeof CategoriesRepo.getCategories>
    );

    const result = await CategoriesService.getUserCategories(user);

    expect(CategoriesRepo.getCategories).toHaveBeenCalledWith(user);
    expect(result).toBe(expected);
  });
});

describe("CategoriesService.setDefaultCategories", () => {
  it("delegates to the repository with the given userId", async () => {
    await CategoriesService.setDefaultCategories(7);

    expect(CategoriesRepo.setDefaultCategories).toHaveBeenCalledWith(7);
  });
});

describe("CategoriesService.getCategorySpending", () => {
  it("maps totals onto categories, drops zero-spend categories, and sorts descending", async () => {
    vi.mocked(CategoriesRepo.getCategories).mockResolvedValue([
      { id: 1, name: "Food" },
      { id: 2, name: "Transport" },
      { id: 3, name: "Entertainment" },
    ] as Resolved<typeof CategoriesRepo.getCategories>);
    vi.mocked(ExpensesRepository.getTotalExpensesGroupByMonth).mockResolvedValue([
      { categoryId: 1, _sum: { amount: 500 } },
      { categoryId: 3, _sum: { amount: 1500 } },
    ] as Resolved<typeof ExpensesRepository.getTotalExpensesGroupByMonth>);

    const result = await CategoriesService.getCategorySpending(user, {
      month: 3,
      year: 2026,
    });

    expect(result).toEqual([
      { id: 3, name: "Entertainment", totalSpent: 1500 },
      { id: 1, name: "Food", totalSpent: 500 },
    ]);
  });

  it("treats a missing sum as zero spend and filters it out", async () => {
    vi.mocked(CategoriesRepo.getCategories).mockResolvedValue([
      { id: 1, name: "Food" },
    ] as Resolved<typeof CategoriesRepo.getCategories>);
    vi.mocked(ExpensesRepository.getTotalExpensesGroupByMonth).mockResolvedValue([
      { categoryId: 1, _sum: { amount: null } },
    ] as Resolved<typeof ExpensesRepository.getTotalExpensesGroupByMonth>);

    const result = await CategoriesService.getCategorySpending(user, {
      month: 3,
      year: 2026,
    });

    expect(result).toEqual([]);
  });
});
