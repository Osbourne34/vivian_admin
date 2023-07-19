import { ReactElement, useState } from 'react'
import Layout from '@/shared/layouts/layout'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { CreateAdminForm } from '@/features/employees'

const Admins = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between space-x-5">
        <Typography variant="h5">Админ</Typography>
        <Button onClick={handleClickOpen} variant="contained">
          Создать Админа
        </Button>
      </div>

      <div className="h-[700px]">{/* <DataGrid /> */}</div>

      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Создать админа</DialogTitle>
        <CreateAdminForm onClose={handleClose} />
      </Dialog>
    </div>
  )
}

Admins.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Admins
