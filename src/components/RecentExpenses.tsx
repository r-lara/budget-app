import React from 'react';
import type { Expense } from '@/types/types';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  Container,
} from '@mui/material';
import Link from 'next/link';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface ExpensesTable extends Expense {
  category: { name: string }
}

type ExpensesListProps = {
  expenses: ExpensesTable[];
  onAddExpense: () => void
};


const RecentExpenses: React.FC<ExpensesListProps> = ({ expenses, onAddExpense }) => {

  return (
    <Box component="section" sx={{ px: 1, py: 1 }}>
      <Container maxWidth="sm" sx={{ m: 'auto', pb: 4 }}>
        <Box sx={{ px: 1, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 600 }}>
              Recent Expenses
            </Typography>
            {/* <IconButton onClick={onAddExpense} aria-label="Add expense" size="small">
              <AddIcon />
            </IconButton> */}
            <IconButton onClick={onAddExpense} aria-label="add expense" color="success" size='large'>
              <AddCircleIcon />
            </IconButton>
          </Stack>

          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {expenses.map((expense, index) => (
              <ListItem key={index} disableGutters disablePadding sx={{ display: 'block' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {expense.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {expense.category.name}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ${expense.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(expense.date).toDateString()}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ mt: 1.5 }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href="/expenses"
          >
            See all expenses
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RecentExpenses;
