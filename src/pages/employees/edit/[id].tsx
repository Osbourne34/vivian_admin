import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'

import { Paper, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EditForm } from '@/features/employees/ui/forms/edit-form'
import { EmployeesService } from '@/features/employees'
import { Layout } from '@/shared/layouts/layout'
import { Error, ResponseWithMessage } from '@/shared/http'

const EditEmployees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    { id: number; body: FormData }
  >({
    mutationFn: EmployeesService.updateEmployee,
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

  const handleSubmit = async (body: FormData) => {
    try {
      await updateMutation.mutateAsync({
        id: Number(router.query.id),
        body,
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
        <EditForm
          id={Number(router.query.id)}
          submit={handleSubmit}
          loading={updateMutation.isLoading}
          error={error}
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
