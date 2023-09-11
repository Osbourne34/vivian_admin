import { useState } from 'react'
import { Button, Dialog, DialogTitle } from '@mui/material'
import { OrientForm } from '../orient-form/orient-form'
import { FormInputs, initialData } from '../orient-form/initial-data'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Error, ResponseWithMessage } from '@/shared/http'
import { OrientsService } from '../../service/orients-service'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'

export const AddOrient = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const createMutation = useMutation<ResponseWithMessage, Error, FormInputs>({
    mutationFn: OrientsService.createOrient,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orients'])
      handleClose()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (err) => {
      if (err.status === 401) {
        router.push('/login')
        return
      }

      setError(err?.message!)
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
        Создать ориентир
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Создание ориентира</DialogTitle>
        <OrientForm
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
