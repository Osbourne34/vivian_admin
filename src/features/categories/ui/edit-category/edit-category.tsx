import { Error, ResponseWithMessage } from '@/shared/http'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CategoriesService } from '../../service/categories-service'
import { enqueueSnackbar } from 'notistack'
import { FormInputs } from '../category-form/initial-data'
import { Category } from '../../types/category'
import { CircularProgress } from '@mui/material'
import { CategoryForm } from '../category-form/category-form'

interface EditCategoryProps {
  id: number
}

export const EditCategory = (props: EditCategoryProps) => {
  const { id } = props

  const router = useRouter()
  const queryClient = useQueryClient()

  const { closeModal } = useModal()

  const [category, setCategory] = useState<Category>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    { id: number; body: { name: string } }
  >({
    mutationFn: CategoriesService.updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['categories'])
      closeModal()
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
      await updateMutation.mutateAsync({ id, body: data })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  useEffect(() => {
    const getCategory = async () => {
      setIsLoading(true)
      try {
        const { data } = await CategoriesService.getCategory(id)
        setCategory(data)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    getCategory()
  }, [id])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center px-6 pb-8 pt-5">
          <CircularProgress />
        </div>
      ) : (
        <CategoryForm
          error={error}
          onCancel={() => closeModal()}
          submit={handleSubmit}
          initialData={{
            name: category?.name || '',
          }}
          submitTitle="Сохранить"
        />
      )}
    </>
  )
}
