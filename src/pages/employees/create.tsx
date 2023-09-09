import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'

import { Paper, Typography } from '@mui/material'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { EmployeesService } from '@/features/employees'
import { CreateForm } from '@/features/employees/ui/forms/create-form'
import { Layout } from '@/shared/layouts/layout'
import { Error, ResponseWithMessage } from '@/shared/http'

const CreateEmployees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')

  const createMutation = useMutation<ResponseWithMessage, Error, FormData>({
    mutationFn: EmployeesService.createEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['employees'])
      router.push('/employees')
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

  const handleSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание сотрудника
      </Typography>

      <Paper elevation={4} className="p-5">
        <CreateForm
          error={error}
          loading={createMutation.isLoading}
          submit={handleSubmit}
        />
      </Paper>
    </div>
  )
}

CreateEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateEmployees
