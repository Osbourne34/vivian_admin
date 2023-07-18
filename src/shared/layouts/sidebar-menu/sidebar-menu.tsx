import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import NextLink from 'next/link'

type MenuItemBase = {
  id: string
  title: string
}

type MenuItemLink = MenuItemBase & {
  link: string
  children?: never
}

type MenuItemChildren = MenuItemBase & {
  children: MenuItem[]
  link?: never
}

type MenuItem = MenuItemLink | MenuItemChildren

interface SidebarMenuProps {
  items: MenuItem[]
}

const MenuItem = ({
  items,
  level = 1,
}: {
  items: MenuItem[]
  level?: number
}) => {
  const [open, setOpen] = useState<string[]>([])

  const isChild = (children?: MenuItem[]) => {
    return children && children.length
  }

  const handleOpen = (openId: string) => {
    if (open.includes(openId)) {
      const newArray = open.filter((id) => id !== openId)
      setOpen(newArray)
    } else {
      setOpen((prevState) => [...prevState, openId])
    }
  }

  return (
    <>
      {items.map(({ children, id, link, title }) => {
        return (
          <React.Fragment key={id}>
            <ListItemButton
              component={isChild(children) ? 'div' : NextLink}
              href={isChild(children) ? '' : link}
              sx={{ pl: 2 * level }}
              onClick={() => handleOpen(id)}
            >
              <ListItemText primary={title} />
              {isChild(children) && (
                <>{open.includes(id) ? <ExpandLess /> : <ExpandMore />}</>
              )}
            </ListItemButton>
            {isChild(children) && (
              <Collapse in={open.includes(id)} timeout="auto" unmountOnExit>
                <List disablePadding>
                  <MenuItem level={level + 1} items={children!} />
                </List>
              </Collapse>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

export const SidebarMenu = (props: SidebarMenuProps) => {
  const { items } = props

  return (
    <List>
      <MenuItem items={items} />
    </List>
  )
}
