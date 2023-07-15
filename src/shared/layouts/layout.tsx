import React, { ReactNode } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'

import { routes } from '../routes/routes'
import { Collapse } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { SidebarMenu } from './sidebar-menu/sidebar-menu'
import { Avatar } from './avatar/avatar'

const drawerWidth = 300

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps) => {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  const drawer = (
    <div>
      <List>
        {/* {routes.map(({ title, children, link, id }) => {
          if (link) {
            return (
              <ListItemButton
                key={id}
                href={link}
                component={NextLink}
                selected={router.pathname === link}
              >
                <ListItemText primary={title} />
              </ListItemButton>
            )
          } else {
            return (
              <>
                <ListItemButton onClick={handleClick} key={id}>
                  <ListItemText primary={title} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {children?.map(({ id, link, title }) => (
                      <ListItemButton
                        key={id}
                        sx={{ pl: 4 }}
                        href={link}
                        component={NextLink}
                        selected={router.pathname === link}
                      >
                        <ListItemText primary={title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            )
          }
        })} */}

        {/* <SidebarMenu items={routes} /> */}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}

export default Layout
