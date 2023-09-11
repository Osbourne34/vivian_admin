import { useEffect, useState } from 'react'
import { OrientForm } from '../orient-form/orient-form'
import { Error, ResponseWithMessage } from '@/shared/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { OrientsService } from '../../service/orients-service'
import { Orient } from '../../types/orient'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { FormInputs } from '../orient-form/initial-data'

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
      try {
        const { data } = await OrientsService.getOrient(id)
        setOrient(data)
      } catch (error) {}
    }

    getOrient()
  }, [])

  return (
    <OrientForm
      error={error}
      onCancel={() => closeModal()}
      submit={handleSubmit}
      initialData={{
        branch_id: orient ? orient.branch_id : '',
        name: orient ? orient.name : '',
      }}
      submitTitle="Сохранить"
    />
  )
}
