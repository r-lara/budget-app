import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CategoryIcon from '@mui/icons-material/Category';
import Link from "next/link";

import { usePathname } from "next/navigation";
import { Paper } from '@mui/material';

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <Paper
      sx={{
        width: '100%',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={pathname}
        showLabels
        sx={{
          minHeight: 64,
        }}
      >
        <BottomNavigationAction
          component={Link}
          value="/"
          href="/"
          label="Home"
          icon={<HomeIcon />}
        />

        <BottomNavigationAction
          component={Link}
          value="/expenses"
          href="/expenses"
          label="Expenses"
          icon={<ShoppingBasketIcon />}
        />

        <BottomNavigationAction
          component={Link}
          value="/budget"
          href="/budget"
          label="Budget"
          icon={<CategoryIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
