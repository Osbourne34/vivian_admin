import { ReactNode, useRef, useState } from 'react'
import { ModalContext, ModalState } from './modal-context'
import Modal from '../modal'

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = (props: ModalProviderProps) => {
  const [open, setOpen] = useState(false)
  const modalState = useRef<ModalState>()

  const { children } = props

  const openModal = (modalData: ModalState) => {
    modalState.current = modalData
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      <Modal
        open={open}
        onClose={closeModal}
        title={modalState.current?.title || ''}
        content={modalState.current?.modal}
      />
      {children}
    </ModalContext.Provider>
  )
}
