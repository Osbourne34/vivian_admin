import { useRouter } from 'next/router'
import { Button, Dialog, DialogTitle } from '@mui/material'
import { BranchForm } from '../branch-form/branch-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Error, ResponseWithMessage } from '@/shared/http'
import { FormInputs, initialData } from '../branch-form/initial-data'
import { BranchesService } from '../../service/branches-service'

export const AddBranch = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const createMutation = useMutation<ResponseWithMessage, Error, FormInputs>({
    mutationFn: BranchesService.createBranch,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['branches'])
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
        Создать регион
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Создание региона</DialogTitle>
        <BranchForm
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
