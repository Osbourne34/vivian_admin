import { useState } from 'react'

import { LogoutButton } from '@/features/auth'
import { IconButton, Menu, Avatar as AvatarMUI } from '@mui/material'

export const Avatar = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 'auto' }}>
        <AvatarMUI />
      </IconButton>
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
        <LogoutButton onClick={handleCloseUserMenu} />
      </Menu>
    </>
  )
}
