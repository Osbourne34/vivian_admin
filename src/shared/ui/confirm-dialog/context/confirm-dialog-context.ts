import { createContext, useContext } from 'react'

export type ModalState = {
  text: string
  onConfirm: () => void
}

interface ConfirmDialogContext {
  openConfirm: (modalState: ModalState) => void
  closeConfirm: () => void
}

export const ConfirmDialogContext = createContext<ConfirmDialogContext | null>(
  null,
)

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)

  if (!context) {
    throw new Error('No Confirm Dialog')
  }

  return context
}
