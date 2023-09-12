import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Paper, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { EmployeesService } from '@/features/employees'
import { EmployeeForm } from '@/features/employees/ui/forms/employee-form'
import {
  FormInputs,
  initialData,
} from '@/features/employees/ui/forms/initial-data'

import { Layout } from '@/shared/layouts/layout'
import { Error, ResponseWithMessage } from '@/shared/http'

const EditEmployees = () => {
  const { query, push } = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [initFormData, setInitFormData] = useState<FormInputs>(initialData)
  const [error, setError] = useState('')

  useEffect(() => {
    EmployeesService.getEmployee(Number(query.id))
      .then(({ data }) => {
        setInitFormData({
          ...data,
          address: data.address ? data.address : '',
          avatar: data.avatar ? new File([], data.avatar) : null,
          birthday: data.birthday ? dayjs(data.birthday, 'DD MM YYYY') : null,
          branch_id: data.branch_id ? String(data.branch_id) : '',
          description: data.description ? data.description : '',
          password: '',
          password_confirmation: '',
          phone: data.phone.slice(3),
        })
      })
      .catch(() => {})
  }, [query.id])

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    { id: number; body: FormData }
  >({
    mutationFn: EmployeesService.updateEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['employees'])
      push('/employees')
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (err) => {
      if (err.status === 401) {
        push('/login')
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

    if (data.password === '') {
      formData.delete('password')
      formData.delete('password_confirmation')
    }
    formData.set(
      'birthday',
      data.birthday ? data.birthday.format('DD.MM.YYYY') : '',
    )
    formData.set('phone', data.phone)
    formData.set('active', data.active ? '1' : '0')
    formData.append('_method', 'PUT')

    try {
      await updateMutation.mutateAsync({
        id: Number(query.id),
        body: formData,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Редактирование сотрудника
      </Typography>

      <Paper elevation={4} className="p-5">
        <EmployeeForm
          error={error}
          initialData={initFormData}
          submit={handleSubmit}
          requiredPassword={false}
          titleSubmit="Сохранить"
        />
      </Paper>
    </div>
  )
}

EditEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = () => {
  return {
    props: {},
  }
}

export default EditEmployees
