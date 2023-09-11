import React, { ReactNode } from 'react'
import { Dialog, DialogTitle } from '@mui/material'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  content: ReactNode
}

const Modal = (props: ModalProps) => {
  const { onClose, open, title, content } = props

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      {content}
    </Dialog>
  )
}

export default Modal
