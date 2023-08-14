import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { routes } from '@/shared/routes/routes'

export const SidebarMenu = () => {
  const router = useRouter()

  const activeRoute = (link: string) => {
    if (router.pathname === link) return true
    return link !== '/' ? router.pathname.startsWith(link) : false
  }

  return (
    <List>
      {routes.map(({ id, title, link, Icon }) => {
        return (
          <ListItemButton
            selected={activeRoute(link)}
            key={id}
            component={NextLink}
            href={link}
          >
            <ListItemIcon>
                <Icon />
              </ListItemIcon>
            <ListItemText primary={title} />
          </ListItemButton>
        )
      })}
    </List>
  )
}
