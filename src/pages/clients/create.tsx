import React, { BaseSyntheticEvent, ReactElement, useState } from 'react'
import { Paper, Typography } from '@mui/material'
import { Layout } from '@/shared/layouts/layout'
import { ClientForm } from '@/features/clients/ui/client-form/client-form'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { Error, ResponseWithMessage } from '@/shared/http'
import { ClientsService } from '@/features/clients/service/client-service'
import {
  FormInputs,
  initialData,
} from '@/features/clients/ui/client-form/initial-data'

const CreateClient = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')

  const createMutation = useMutation<ResponseWithMessage, Error, FormData>({
    mutationFn: ClientsService.createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients'])
      router.push('/clients')
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

  const handleSubmit = async (
    data: FormInputs,
    event: BaseSyntheticEvent<object | any, any> | undefined,
  ) => {
    data.phone = `998${data.phone}`
    const formData = new FormData(event?.target)
    formData.set(
      'birthday',
      data.birthday ? data.birthday.format('DD.MM.YYYY') : '',
    )
    formData.set('phone', data.phone)
    formData.set('active', data.active ? '1' : '0')
    console.log('submit')

    try {
      await createMutation.mutateAsync(formData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание клиента
      </Typography>

      <Paper elevation={4} className="p-5">
        <ClientForm
          error={error}
          initialData={initialData}
          requiredPassword
          submit={handleSubmit}
          titleSubmit="Создать"
        />
      </Paper>
    </div>
  )
}

CreateClient.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateClient
