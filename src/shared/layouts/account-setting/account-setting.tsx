import { useState } from 'react'

import { LogoutButton } from '@/features/auth'
import { IconButton, Menu, Avatar as AvatarMUI } from '@mui/material'

export const AccountSetting = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <AvatarMUI />
      </IconButton>
      <Menu
        sx={{ mt: 1 }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
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
        <LogoutButton onClick={handleCloseUserMenu} />
      </Menu>
    </>
  )
}
