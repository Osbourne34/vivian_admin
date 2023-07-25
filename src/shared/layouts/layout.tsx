import React, { ReactNode } from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { routes } from '../routes/routes'
import { Avatar } from './avatar/avatar'
import { SidebarMenu } from './sidebar-menu/sidebar-menu'
import { useRouter } from 'next/router'
import { TreeItem, TreeView } from '@mui/lab'

const drawerWidth = 300

interface LayoutProps {
  children: ReactNode
}

const Menu = () => {
  const { pathname, push } = useRouter()
  const [expanded, setExpanded] = React.useState<string[]>([
    pathname.slice(0, pathname.lastIndexOf('/')) || pathname,
  ])
  const [selected, setSelected] = React.useState<string[]>([
    pathname.slice(0, pathname.lastIndexOf('/')) || pathname,
  ])

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds)
  }

  return (
    <TreeView
      sx={{ py: 1 }}
      selected={selected}
      expanded={expanded}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem
        onClick={() => push('/')}
        nodeId="/"
        label="Дашбоард"
        sx={{
          '& .MuiTreeItem-content': {
            pl: 1,
            pr: 2,
            py: 1.5,
          },
        }}
      />
      <TreeItem
        onClick={() => push('/employees')}
        nodeId="/employees"
        label="Сотрудники"
        sx={{
          '& .MuiTreeItem-content': {
            pl: 1,
            pr: 2,
            py: 1.5,
          },
        }}
      />
    </TreeView>
  )
}

export const Layout = (props: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      {/* <SidebarMenu items={routes} /> */}

      <Menu />
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
