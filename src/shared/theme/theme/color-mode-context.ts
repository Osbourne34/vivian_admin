import { createContext, useContext } from 'react'

interface ColorMode {
  toggleColorMode: () => void
}

export const ColorModeContext = createContext<ColorMode | null>(null)

export const useColorMode = () => {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error('Error Color mode context')
  }

  return context
}
