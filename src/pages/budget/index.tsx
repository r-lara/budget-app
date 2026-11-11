import React, { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createOrUpdateBudget, fetchBudgetswithExpenses } from '@/utils/api/budgetApi';
import { fetchCategories } from '@/utils/api/categoriesApi';
import Spinner from '@/components/Spinner';
import type { Category, BudgetWithCategoryAndExpenses } from '@/types/types';
import { CategoriesDialog } from '@/components/CategoriesDrawer';
import { BudgetTable } from '@/components/BudgetTable';
import { toast } from 'react-toastify';

const BudgetPage = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState({ categoryId: "", monthlyLimit: "" });
  const [budgetWithCategoryAndExpenses, setbudgetWithCategoryAndExpenses] = useState<BudgetWithCategoryAndExpenses[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchBudgetswithExpenses(
        currentMonth,
        currentYear
      );

      setbudgetWithCategoryAndExpenses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  useEffect(() => {
    fetchCategories()
      .then((fetchedCategories) => {
        setCategories(fetchedCategories);
      })
      .catch(console.error);
  }, []);

  const handleCategoryChange = (_: unknown, value: Category | null) => {
    const categoryId = value?.id?.toString() || "";
    const existingBudget = budgetWithCategoryAndExpenses.find(
      (item) => item.category.id === value?.id
    );

    setBudget({
      categoryId,
      monthlyLimit: existingBudget ? existingBudget.monthlyLimit.toString() : "",
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!budget.categoryId || !budget.monthlyLimit) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createOrUpdateBudget({
        categoryId: Number(budget.categoryId),
        monthlyLimit: parseFloat(budget.monthlyLimit),
      });

      setBudget({
        categoryId: "",
        monthlyLimit: "",
      });

      await fetchBudgetData();

      toast.success("Budget added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add budget");
    }
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <>
      <BudgetTable budgets={budgetWithCategoryAndExpenses} />
      <Box component="section" sx={{ px: 1, mt: 3, mb: 3, pb: { xs: 10, md: 0 } }}>
        <Container maxWidth="sm" sx={{ m: 'auto', pb: { xs: 1, md: 0 } }}>
          <Box
            component="form"
            onSubmit={submitForm}
            sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="h6" textAlign="center" sx={{ fontWeight: 600 }}>
                Add a budget
              </Typography>
            </Stack>

            <Autocomplete
              disablePortal
              options={categories}
              getOptionLabel={(option) => option.name}
              value={
                categories.find(
                  (cat) => cat.id === parseInt(budget.categoryId)
                ) || null
              }
              onChange={handleCategoryChange}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField {...params} label="Select a category" />
              )}
            />

            <TextField
              type="number"
              label="Monthly Limit"
              value={budget.monthlyLimit}
              onChange={(e) =>
                setBudget({ ...budget, monthlyLimit: e.target.value })
              }
              fullWidth
              placeholder="0.00"
              inputProps={{ step: '0.01' }}
            />

            <Button fullWidth variant="outlined" type="submit">
              Add / Update Budget
            </Button>
          </Box>
        </Container>
        <CategoriesDialog
          open={drawerOpen}
          handleClose={() => setDrawerOpen(false)}
        />
      </Box>
    </>
  );
};

export default BudgetPage;