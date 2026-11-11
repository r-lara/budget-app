import type { Category, ExpenseWithCategory } from "@/types/types";
import { fetchCategories } from "@/utils/api/categoriesApi";
import { Autocomplete, Button, Drawer, Stack, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { createExpenseApi, updateExpenseApi } from "@/utils/api/expensesApi";
import { toast } from "react-toastify";

interface ExpenseFormState {
  amount: string;
  description: string;
  categoryId: string;
  date: string;
}

type ExpenseRequest = Omit<ExpenseWithCategory, "id" | "authorId" | "createdAt" | "category">;

interface ExpenseDrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (expense: ExpenseWithCategory) => void
  expenseToEdit?: ExpenseWithCategory | null
}

export const ExpenseDrawer: React.FC<ExpenseDrawerProps> = ({ open, onClose, onCreated, expenseToEdit }) => {
  const [expense, setExpense] = useState<ExpenseFormState>({
    amount: "",
    description: "",
    categoryId: "0",
    date: new Date().toISOString().split("T")[0]
  })
  const [categories, setCategories] = useState<Category[]>([])

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedExpense: ExpenseRequest = {
      amount: parseFloat(expense.amount),
      description: expense.description,
      categoryId: parseInt(expense.categoryId),
      date: expense.date
    };

    try {
      let response;
      if (expenseToEdit) {
        let payload = { ...expenseToEdit, ...parsedExpense };
        response = await updateExpenseApi(payload)
      } else {
        // await saveExpense(parsedExpense, "added")
        response = await createExpenseApi(parsedExpense);
      }

      toast.success(`Success`)
      console.log("response", response);
      if (response) {
        const categoryData = categories.find(cat => cat.id === response.expense.categoryId)
        if (categoryData) {
          onCreated({ ...response.expense, category: categoryData })
        }
      }
      clearForm()
    } catch (err) {
      toast.error(`There was an error`)
      console.log(err)
    }
  }

  const handleDrawerClose = () => {
    clearForm()
    onClose()
  }

  const clearForm = () => {
    setExpense({
      amount: "",
      description: "",
      categoryId: "0",
      date: new Date().toISOString().split("T")[0]
    })
  }

  useEffect(() => {
    fetchCategories()
      .then(categories => setCategories(categories))
      .catch(err => {
        console.log(err)
      })
  }, [setCategories, setExpense])

  useEffect(() => {
    if (expenseToEdit) {
      setExpense({
        amount: expenseToEdit.amount.toString(),
        description: expenseToEdit.description,
        categoryId: expenseToEdit.categoryId.toString(),
        date: new Date(expenseToEdit.date).toISOString().split("T")[0],
      });
    } else {
      clearForm()
    }
  }, [expenseToEdit])

  return (
    <Drawer
      anchor='bottom'
      open={open}
      onClose={handleDrawerClose}
    >
      <div className="flex justify-center h-full">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg">
          <form onSubmit={submitForm} className="w-full">
            <h2 className="text-3xl text-center font-semibold mb-6">{expenseToEdit ? "Edit expense" : "Add Expense"}</h2>
            <button
              onClick={handleDrawerClose}
              type='button'
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <CloseIcon></CloseIcon>
            </button>
            <div className="mb-4">
              <TextField
                fullWidth
                type="text"
                label="Description"
                id="description"
                value={expense?.description}
                onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Autocomplete
                disablePortal
                options={categories}
                getOptionLabel={(option) => option.name}
                value={categories.find(cat => cat.id === parseInt(expense.categoryId)) || null}
                onChange={(_, value) => setExpense({ ...expense, categoryId: value?.id.toString() || "0" })}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Select a category" />}
              />
            </div>
            <div className="flex gap-4">
              <TextField id="amount"
                label="Amount"
                variant="outlined"
                onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                value={expense?.amount}
                type="number"
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={expense.date}
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    date: e.target.value,
                  })
                }
                fullWidth
              />
            </div>
            {/* <div>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Expense
              </button>
            </div> */}
            <Stack direction='row' spacing={2} marginTop={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
              >
                {expenseToEdit ? "Update" : "Add"}
              </Button>
            </Stack>
          </form>
        </div>
      </div>
    </Drawer>

  )
}

// export default ExpenseDrawer