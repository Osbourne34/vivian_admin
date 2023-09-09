import { ReactNode, useRef, useState } from 'react'
import { ConfirmDialogContext, ModalState } from './context'
import { ConfirmDialog } from '../confirm-dialog'

interface ConfirmDialogProviderProps {
  children: ReactNode
}

export const ConfirmDialogProvider = ({
  children,
}: ConfirmDialogProviderProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const modalState = useRef<ModalState>()

  const openConfirm = (modalData: ModalState) => {
    modalState.current = modalData
    setOpen(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    await modalState.current?.onConfirm()
    setIsLoading(false)
  }

  const closeConfirm = () => {
    setIsLoading(false)
    setOpen(false)
  }

  return (
    <ConfirmDialogContext.Provider value={{ openConfirm, closeConfirm }}>
      <ConfirmDialog
        open={open}
        onClose={closeConfirm}
        loading={isLoading}
        onConfirm={handleConfirm}
        text={modalState.current?.text || ''}
      />
      {children}
    </ConfirmDialogContext.Provider>
  )
}
