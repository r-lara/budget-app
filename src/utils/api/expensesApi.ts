import type { Expense, ExpenseWithCategory } from "@/types/types";
import { http } from "../http/http";

export const fetchExpenses = (month?: number, year?: number, limit?: number, totalAmount?: boolean) =>
  http<ExpenseWithCategory[]>(`/api/expenses?limit=${limit}&month=${month}&year=${year}&totalAmount=${totalAmount}`)

export const fetchExpensesTotalAmount = (month?: number, year?: number, limit?: number, totalAmount?: boolean) =>
  http<number>(`/api/expenses?limit=${limit}&month=${month}&year=${year}&totalAmount=${totalAmount}`)

export const fetchExpensesTotal = (month?: number, year?: number, limit?: number, totalAmount?: boolean) =>
  http<Number>(`/api/expenses?limit=${limit}&month=${month}&year=${year}&totalAmount=${totalAmount}`)

export const createExpenseApi = (expense: Partial<Expense>) =>
  http<{ message: string; expense: Expense }>(`/api/expenses`, {
    method: 'POST',
    body: expense
  });

export const updateExpenseApi = (expense: Partial<Expense>) =>
  http<{ message: string; expense: Expense }>(`/api/expenses`, {
    method: 'PUT',
    body: expense
  });