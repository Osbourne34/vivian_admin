import { ReactNode, useEffect, useMemo, useState } from 'react'
import { ColorModeContext } from './color-mode-context'
import { ThemeProvider } from '@emotion/react'
import { roboto } from '../font/font'
import { PaletteMode, createTheme } from '@mui/material'

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light')

  useEffect(() => {
    if (localStorage.getItem('theme')) {
      setMode(localStorage.getItem('theme') as PaletteMode)
    }
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light')
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [mode],
  )

  const modeTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: roboto.style.fontFamily,
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={modeTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}
