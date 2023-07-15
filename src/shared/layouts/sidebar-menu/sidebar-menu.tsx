import { Collapse, List, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'

interface SidebarMenuProps {
  items: [
    {
      id: string
      title: string
      link?: string
      children?: any
    }
  ]
}

export const SidebarMenu = (props: SidebarMenuProps) => {
  const { items } = props

  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      {items.map(({ id, title, link, children }) => {
        return (
          <>
            <ListItemButton onClick={handleClick} key={id}>
              <ListItemText primary={title} />
            </ListItemButton>
            {children && children.length ? (
              <>
                <SidebarMenu items={children} />
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {children?.map(({ id, link, title }) => (
                      <ListItemButton key={id} sx={{ pl: 4 }} href={link}>
                        <ListItemText primary={title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : null}
          </>
        )
      })}
    </>
  )
}
