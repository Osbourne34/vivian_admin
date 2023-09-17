import { BaseSyntheticEvent, ReactElement, useState } from 'react'
import { useRouter } from 'next/router'

import { Paper, Typography } from '@mui/material'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'

import { EmployeesService } from '@/features/employees'
import { EmployeeForm } from '@/features/employees/ui/forms/employee-form'
import {
  FormInputs,
  initialData,
} from '@/features/employees/ui/forms/initial-data'

import { Layout } from '@/shared/layouts/layout'
import { Error, ResponseWithMessage } from '@/shared/http'

const CreateEmployees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

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

    try {
      await createMutation.mutateAsync(formData)
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
        <EmployeeForm
          error={error}
          initialData={initialData}
          submit={handleSubmit}
          requiredPassword={true}
          titleSubmit="Создать"
        />
      </Paper>
    </div>
  )
}

CreateEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateEmployees
