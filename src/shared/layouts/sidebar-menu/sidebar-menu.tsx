import { routes } from '@/shared/routes/routes'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'

export const SidebarMenu = () => {
  const { pathname, push } = useRouter()
  const [opened, setOpened] = useState<string[]>(() => {
    const ids: string[] = []
    routes.forEach((route) => {
      if (route.children) {
        const found = route.children.find(({ link }) => pathname === link)
        if (found) {
          ids.push(route.id)
        }
      }
    })

    return ids
  })

  const selected = (link?: string) => {
    if (!link) false
    return link === pathname
  }

  const handleOpen = (id: string) => {
    if (opened.includes(id)) {
      setOpened((prevState) => {
        return prevState.filter((value) => value !== id)
      })
    } else {
      setOpened([...opened, id])
    }
  }

  const open = (id: string) => {
    return opened.some((value) => value === id)
  }

  return (
    <List>
      {routes.map(({ id, title, link, children }) => (
        <React.Fragment key={id}>
          <ListItemButton
            onClick={
              link
                ? () => {
                    push(link)
                    setOpened([])
                  }
                : () => handleOpen(id)
            }
            selected={selected(link)}
          >
            <ListItemText primary={title} />
            {children?.length ? (
              open(id) ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : null}
          </ListItemButton>
          {children?.length && (
            <Collapse in={open(id)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {children.map(({ id, link, title }) => (
                  <ListItemButton
                    selected={selected(link)}
                    key={id}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText
                      primary={title}
                      onClick={() => {
                        push(link)
                        setOpened((prevState) => {
                          const ids: string[] = []

                          routes.forEach((route) => {
                            if (route.children) {
                              const found = route.children.find(
                                (child) => child.id === id,
                              )
                              if (found) {
                                ids.push(route.id)
                              }
                            }
                          })

                          return ids
                        })
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}
