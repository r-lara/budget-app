import type { Budget, BudgetWithCategory, BudgetWithCategoryAndExpenses } from "@/types/types";
import { http } from "../http/http";



export const fetchBudgets = () =>
  http<BudgetWithCategory[]>('/api/budget');

export const createOrUpdateBudget = (budget: Partial<Budget>) => 
  http<Partial<Budget>>('/api/budget', {
    method: 'POST',
    body: budget
  });

export const fetchBudgetswithExpenses = (month: number, year: number) => 
  http<BudgetWithCategoryAndExpenses[]>(`/api/budget?includeExpenses=true&month=${month}&year=${year}`)