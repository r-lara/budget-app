import type { ExpenseWithCategory } from '@/types/types';
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner';
import { fetchExpenses } from '@/utils/api/expensesApi';
import type { SelectChangeEvent} from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { ExpenseDrawer } from '@/components/ExpenseDrawer';

const AllExpensesPage = () => {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseWithCategory | null>(null);
  const [currentMonth, setMonth] = useState(new Date().getMonth() + 1);

  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(2000, index, 1)),
  }));

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchExpenses(currentMonth, currentYear, 1000, false).then(setExpenses).catch(console.error).finally(() => setLoading(false))
  }, [currentMonth, currentYear]);

  const handleRowClick = (expense: ExpenseWithCategory) => {
    setExpenseToEdit(expense);
    setDrawerOpen(true);
  }

  const handleExpenseCreated = (updatedExpense: ExpenseWithCategory) => {
    setExpenses(prevExpenses =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id
          ? { ...updatedExpense }
          : expense
      )
    )
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX') // Format as MM/DD/YYYY
  }

  if (loading) {
    return <Spinner loading={loading} />;
  }


  const handleChange = (event: SelectChangeEvent<number>) => {
    setMonth(event.target.value as number);
  };

  return (
    <section className="px-4 py-5">
      <div className="container m-auto max-w-2xl">
        <div className="flex flex-row justify-between items-center mb-2">
          <h2 className="text-xl text-left font-semibold ml-3">Expenses</h2>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="expense-filter-label">
              Month
            </InputLabel>
            <Select
              labelId="expense-filter-label"
              id="demo-simple-select"
              value={currentMonth}
              label="Month"
              onChange={handleChange}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}
                  hover
                  onClick={() => handleRowClick(expense)}
                  sx={{ cursor: "pointer" }}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category.name}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell align="left">${expenses.reduce(
                  (accumulator, currentValue) => accumulator + currentValue.amount,
                  0,
                )}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter />
          </Table>
        </TableContainer>
      </div>
      {expenseToEdit && (
        <ExpenseDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setExpenseToEdit(null)
          }}
          onCreated={handleExpenseCreated}
          expenseToEdit={expenseToEdit}
        >
        </ExpenseDrawer>
      )}
    </section>
  )
}

export default AllExpensesPage
