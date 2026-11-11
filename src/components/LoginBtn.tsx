import { IconButton, Box, Tooltip, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import React from "react";

export default function LoginBtn(session: Session) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={session.user?.name ?? 'User'} src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key='logout' onClick={() => signOut()}>
          <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

