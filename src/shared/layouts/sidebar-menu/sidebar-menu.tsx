import React, { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

import { Route, routes } from '@/shared/routes/routes'

export const SidebarMenu = () => {
  const router = useRouter()

  const activeRoute = (link: string) => {
    if (router.pathname === link) return true
    return link !== '/' ? router.pathname.startsWith(link) : false
  }

  return (
    <List>
      {routes.map((item) => {
        if (item.link) {
          return (
            <ListItemButton
              key={item.id}
              selected={activeRoute(item.link)}
              component={NextLink}
              href={item.link}
            >
              <ListItemIcon>
                <item.Icon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          )
        }
        if (item.children) {
          return (
            <NestedMenu key={item.id} item={item} activeRoute={activeRoute} />
          )
        }
      })}
    </List>
  )
}

interface NestedMenuProps {
  item: Route
  activeRoute: (link: string) => boolean
}

const NestedMenu = ({ item, activeRoute }: NestedMenuProps) => {
  const { Icon, title, children } = item
  const { pathname } = useRouter()

  const [open, setOpen] = useState(() => {
    return item.children!.some(({ link }) => pathname.includes(link!))
  })

  return (
    <>
      <ListItemButton onClick={() => setOpen((o) => !o)}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children!.map(({ id, title, link, Icon }) => (
            <ListItemButton
              selected={activeRoute(link!)}
              key={id}
              sx={{ pl: 4 }}
              component={NextLink}
              href={link!}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}
