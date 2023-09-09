import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  text: string
  loading: boolean
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { onClose, open, onConfirm, text, loading } = props

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Подтвердите действие</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <LoadingButton
          loading={loading}
          onClick={onConfirm}
          variant="contained"
        >
          Ок
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
