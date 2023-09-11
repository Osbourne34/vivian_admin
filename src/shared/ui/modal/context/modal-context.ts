import { ReactNode, createContext, useContext } from 'react'

export type ModalState = {
  title: string
  modal: ReactNode
}

interface ModalContext {
  openModal: (modalState: ModalState) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContext | null>(null)

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('No Modal')
  }

  return context
}
