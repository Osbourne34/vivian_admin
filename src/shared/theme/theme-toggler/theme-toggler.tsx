import { IconButton, useTheme } from '@mui/material'
import { useColorMode } from '../theme/color-mode-context'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export const ThemeToggler = () => {
  const { toggleColorMode } = useColorMode()
  const theme = useTheme()

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  )
}
