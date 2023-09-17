import { useRouter } from 'next/router'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, Dialog, DialogTitle } from '@mui/material'
import { RoleForm } from '../role-form/role-form'
import { FormInputs, initialData } from '../role-form/initial-data'
import { Error, ResponseWithMessage } from '@/shared/http'
import { RolesService } from '../../service/roles-service'

export const AddRole = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const createMutation = useMutation<ResponseWithMessage, Error, FormInputs>({
    mutationFn: RolesService.createRole,
    onSuccess(data) {
      queryClient.invalidateQueries(['roles'])
      handleClose()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError(err) {
      if (err.status === 401) {
        router.push('/login')
        return
      }
      setError(err.message!)
    },
  })

  const handleSubmit = async (data: FormInputs) => {
    try {
      await createMutation.mutateAsync(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Создать роль
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Создание роли</DialogTitle>
        <RoleForm
          error={error}
          initialData={initialData}
          submit={handleSubmit}
          onCancel={handleClose}
          submitTitle="Создать"
        />
      </Dialog>
    </>
  )
}
