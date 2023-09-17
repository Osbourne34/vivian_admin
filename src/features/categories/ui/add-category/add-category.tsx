import { Button, Dialog, DialogTitle } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CategoryForm } from '../category-form/category-form'
import { FormInputs, initialData } from '../category-form/initial-data'
import { Error, ResponseWithMessage } from '@/shared/http'
import { CategoriesService } from '../../service/categories-service'
import { enqueueSnackbar } from 'notistack'

export const AddCategory = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const createMutation = useMutation<ResponseWithMessage, Error, FormInputs>({
    mutationFn: CategoriesService.createCategory,
    onSuccess(data) {
      queryClient.invalidateQueries(['categories'])
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
        Создать категорию
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Создание категорий</DialogTitle>
        <CategoryForm
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
