import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Resolved } from "@/test/types";
import type { User } from "@prisma/client";
import { BudgetService } from "./budgetService";
import { BudgetRepo } from "../repositories/budgetRepo";
import { CategoriesRepo } from "../repositories/categoriesRepo";

vi.mock("../repositories/budgetRepo", () => ({
  BudgetRepo: {
    getBudgets: vi.fn(),
    upsertBudget: vi.fn(),
    getBudgetWithExpenses: vi.fn(),
  },
}));

vi.mock("../repositories/categoriesRepo", () => ({
  CategoriesRepo: {
    getCategory: vi.fn(),
  },
}));

const user = { id: 1 } as User;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BudgetService.getUserBudgets", () => {
  it("fetches budgets with expenses for the given month/year when includeExpenses is true", async () => {
    const expected = [{ id: 1 }];
    vi.mocked(BudgetRepo.getBudgetWithExpenses).mockResolvedValue(
      expected as Resolved<typeof BudgetRepo.getBudgetWithExpenses>
    );

    const result = await BudgetService.getUserBudgets(user, {
      month: 3,
      year: 2026,
      includeExpenses: true,
    });

    expect(BudgetRepo.getBudgetWithExpenses).toHaveBeenCalledTimes(1);
    const [, startDate, endDate] = vi.mocked(BudgetRepo.getBudgetWithExpenses).mock.calls[0];
    expect(startDate).toEqual(new Date(2026, 2, 1, 0, 0, 0, 0));
    expect(endDate).toEqual(new Date(2026, 2, 31, 23, 59, 59, 999));
    expect(BudgetRepo.getBudgets).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it("falls back to plain budgets when includeExpenses is false", async () => {
    const expected = [{ id: 2 }];
    vi.mocked(BudgetRepo.getBudgets).mockResolvedValue(
      expected as Resolved<typeof BudgetRepo.getBudgets>
    );

    const result = await BudgetService.getUserBudgets(user, {
      month: 3,
      year: 2026,
      includeExpenses: false,
    });

    expect(BudgetRepo.getBudgets).toHaveBeenCalledWith(user);
    expect(BudgetRepo.getBudgetWithExpenses).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it("falls back to plain budgets when month/year are missing, even if includeExpenses is true", async () => {
    const expected = [{ id: 3 }];
    vi.mocked(BudgetRepo.getBudgets).mockResolvedValue(
      expected as Resolved<typeof BudgetRepo.getBudgets>
    );

    const result = await BudgetService.getUserBudgets(user, {
      includeExpenses: true,
    });

    expect(BudgetRepo.getBudgets).toHaveBeenCalledWith(user);
    expect(BudgetRepo.getBudgetWithExpenses).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });
});

describe("BudgetService.createBudget", () => {
  it("upserts the budget when the category exists", async () => {
    const category = { id: 5, name: "Food" };
    const expected = { id: 10, monthlyLimit: 200, categoryId: 5 };
    vi.mocked(CategoriesRepo.getCategory).mockResolvedValue(
      category as Resolved<typeof CategoriesRepo.getCategory>
    );
    vi.mocked(BudgetRepo.upsertBudget).mockResolvedValue(
      expected as Resolved<typeof BudgetRepo.upsertBudget>
    );

    const result = await BudgetService.createBudget(user, {
      categoryId: 5,
      monthlyLimit: 200,
    });

    expect(CategoriesRepo.getCategory).toHaveBeenCalledWith(5);
    expect(BudgetRepo.upsertBudget).toHaveBeenCalledWith(user, {
      monthlyLimit: 200,
      categoryId: 5,
    });
    expect(result).toBe(expected);
  });

  it("throws when the category does not exist", async () => {
    vi.mocked(CategoriesRepo.getCategory).mockResolvedValue(null);

    await expect(
      BudgetService.createBudget(user, { categoryId: 999, monthlyLimit: 200 })
    ).rejects.toBe("Category does not exist");
    expect(BudgetRepo.upsertBudget).not.toHaveBeenCalled();
  });
});
