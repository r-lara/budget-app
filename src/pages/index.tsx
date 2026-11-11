import RecentExpenses from "@/components/RecentExpenses";
import { useEffect, useState } from "react";
import type { CategorySpending, ExpenseWithCategory } from "@/types/types";
import Spinner from "@/components/Spinner";
import { ExpenseDrawer } from "@/components/ExpenseDrawer";
import { CategoriesTable } from "@/components/CategoriesTable";
import { fetchDashboardData } from "@/utils/api/dashboardApi";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [categoriesWithTotalSpent, setCategoriesWithTotalSpent] = useState<CategorySpending[]>([]);
  const [totalExpensesAmount, setTotalExpensesAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  const monthString = currentDate.toLocaleString("en-US", { month: "long" });
  const monthCapitalized = monthString.charAt(0).toUpperCase() + monthString.slice(1)

  useEffect(() => {
    fetchDashboardData(currentMonth, currentYear).then((res) => {
      setTotalExpensesAmount(res.totalAmount);
      setCategoriesWithTotalSpent(res.categoriesWithExpenses);
      setExpenses(res.lastFiveExpenses)
      console.log(res);
    }).catch(console.error).finally(() => setLoading(false))
  }, [currentMonth, currentYear]);

  const handleExpenseCreated = (expense: ExpenseWithCategory) => {
    setExpenses(prev => [expense, ...prev]);
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <>
      <div className="flex flex-row mt-5 mb-4 px-4 items-end justify-between">
        <p className="text-3xl">{monthCapitalized}</p>
        <p>${totalExpensesAmount}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <CategoriesTable categories={categoriesWithTotalSpent} />
        <RecentExpenses
          expenses={expenses}
          onAddExpense={() => setDrawerOpen(true)}
        />
        <ExpenseDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onCreated={handleExpenseCreated}
          expenseToEdit={null}
        >
        </ExpenseDrawer>
      </div>
    </>
  );
}
