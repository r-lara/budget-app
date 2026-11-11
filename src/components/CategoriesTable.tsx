// import { Box, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"

// // import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

// type CategoriesTableProps = {
//   categories: CategorySpending[]
// }

// export const CategoriesTableLegacy: React.FC<CategoriesTableProps> = ({ categories }) => {

//   return (
//     <section className="px-4 py-1">
//       <div className="container m-auto max-w-2xl">
//         {/* <h2 className="text-xl text-left font-semibold ml-3">Categories</h2> */}
//         <Typography variant="h6" component="div">
//           Categories
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Category</TableCell>
//               <TableCell>Spent</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {categories.map((category, index) => (
//               <TableRow key={index}>
//                 {/* <TableCell><LocalGroceryStoreIcon></LocalGroceryStoreIcon> </TableCell> */}
//                 <TableCell>{category.name}</TableCell>
//                 <TableCell align="right">${category.totalSpent}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </section>
//   )
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { CategorySpending } from "@/types/types"

type CategoriesTableProps = {
  categories: CategorySpending[]
}

type RowProps = { category: CategorySpending };



function Row({ category }: RowProps) {
  // const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > .MuiTableCell-root': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {category.name}
        </TableCell>
        <TableCell align="right">${category.totalSpent}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Expenses
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell component="th" scope="row">
                        {expense.date}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">${expense.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories }) => {
  return (
    <section className="px-4 py-1">
       <div className="container m-auto max-w-2xl">
        <Typography variant="h6" component="div">
          Categories
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {/* <TableCell /> */}
                {/* <TableCell>Category</TableCell>
                <TableCell align="right">Total</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <Row key={category.name} category={category} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       </div>
    </section>
  );
}
