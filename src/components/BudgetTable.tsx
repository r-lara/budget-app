import type { BudgetWithCategoryAndExpenses, Expense } from "@/types/types"
import { CategoryBudget } from "./CategoryBudget"
// import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

type BudgetTableProps = {
  budgets: BudgetWithCategoryAndExpenses[]
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ budgets }) => {
  const sumExpenses = (expenses: Expense[]) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  return (
    <section className="px-4 py-1 mt-3">
      <div className="container m-auto max-w-2xl">
        {budgets.map((budget, index) => (
          <CategoryBudget
            key={index}
            name={budget.category.name}
            spent={sumExpenses(budget.category.expenses)}
            budget={budget.monthlyLimit}
          />
        ))}

      </div>
    </section>
  )
}