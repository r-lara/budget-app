import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Resolved } from "@/test/types";
import type { GetExpensesQuery } from "../../schemas/schemas";
import type { User } from "@prisma/client";
import { ExpensesService } from "./expensesService";
import { ExpensesRepository } from "../repositories/expensesRepo";
import type { Expense } from "@/types/types";

vi.mock("../repositories/expensesRepo", () => ({
  ExpensesRepository: {
    getAllExpenses: vi.fn(),
    getTotalExpensesForMonth: vi.fn(),
    createExpense: vi.fn(),
    updateExpense: vi.fn(),
  },
}));

const user = { id: 1 } as User;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ExpensesService", () => {
  it("getExpenses delegates to the repository with the same user/query", async () => {
    const query: GetExpensesQuery = { month: 3, year: 2026, totalAmount: false, limit: 50 };
    const expected = [{ id: 1 }];
    vi.mocked(ExpensesRepository.getAllExpenses).mockResolvedValue(
      expected as Resolved<typeof ExpensesRepository.getAllExpenses>
    );

    const result = await ExpensesService.getExpenses(user, query);

    expect(ExpensesRepository.getAllExpenses).toHaveBeenCalledWith(user, query);
    expect(result).toBe(expected);
  });

  it("getExpensesTotalAmount delegates to the repository with the same user/query", async () => {
    const query: GetExpensesQuery = { month: 3, year: 2026, totalAmount: true };
    vi.mocked(ExpensesRepository.getTotalExpensesForMonth).mockResolvedValue(1234);

    const result = await ExpensesService.getExpensesTotalAmount(user, query);

    expect(ExpensesRepository.getTotalExpensesForMonth).toHaveBeenCalledWith(user, query);
    expect(result).toBe(1234);
  });

  it("createExpense delegates to the repository with the same expense/user", async () => {
    const expense = { amount: 500, description: "Coffee", categoryId: 2 } as Expense;
    const expected: Resolved<typeof ExpensesRepository.createExpense> = {
      id: 99,
      amount: 500,
      description: "Coffee",
      categoryId: 2,
      authorId: 1,
      date: new Date(2026, 2, 1),
      createdAt: new Date(2026, 2, 1),
    };
    vi.mocked(ExpensesRepository.createExpense).mockResolvedValue(expected);

    const result = await ExpensesService.createExpense(expense, user);

    expect(ExpensesRepository.createExpense).toHaveBeenCalledWith(expense, user);
    expect(result).toBe(expected);
  });

  it("updateExpense delegates to the repository with the same expense/user", async () => {
    const expense = { id: 99, amount: 700, description: "Lunch", categoryId: 2 } as Expense;
    const expected: Resolved<typeof ExpensesRepository.updateExpense> = {
      id: 99,
      amount: 700,
      description: "Lunch",
      categoryId: 2,
      authorId: 1,
      date: new Date(2026, 2, 1),
      createdAt: new Date(2026, 2, 1),
    };
    vi.mocked(ExpensesRepository.updateExpense).mockResolvedValue(expected);

    const result = await ExpensesService.updateExpense(expense, user);

    expect(ExpensesRepository.updateExpense).toHaveBeenCalledWith(expense, user);
    expect(result).toBe(expected);
  });
});
