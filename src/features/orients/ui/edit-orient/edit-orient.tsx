import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { CircularProgress } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { OrientForm } from '../orient-form/orient-form'
import { FormInputs } from '../orient-form/initial-data'
import { OrientsService } from '../../service/orients-service'
import { Orient } from '../../types/Orient'

import { useModal } from '@/shared/ui/modal/context/modal-context'
import { Error, ResponseWithMessage } from '@/shared/http'

interface EditOrientProps {
  id: number
}

export const EditOrient = (props: EditOrientProps) => {
  const { id } = props

  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { closeModal } = useModal()
  const [orient, setOrient] = useState<Orient>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    { id: number; body: { name: string; branch_id: string } }
  >({
    mutationFn: OrientsService.updateOrient,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orients'])
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
    const getOrient = async () => {
      setIsLoading(true)
      try {
        const { data } = await OrientsService.getOrient(id)
        setOrient(data)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    getOrient()
  }, [id])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center px-6 pb-8 pt-5">
          <CircularProgress />
        </div>
      ) : (
        <OrientForm
          error={error}
          onCancel={() => closeModal()}
          submit={handleSubmit}
          initialData={{
            branch_id: orient?.branch_id ? orient.branch_id : '',
            name: orient?.name ? orient.name : '',
          }}
          submitTitle="Сохранить"
        />
      )}
    </>
  )
}
