import { ReactElement } from 'react'

import { Paper, Typography } from '@mui/material'

import { Layout } from '@/shared/layouts/layout'
import { CreateEmployeesForm } from '@/features/employees'

const CreateEmployees = () => {
  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание сотрудника
      </Typography>

      <Paper elevation={4} className="p-5">
        <CreateEmployeesForm />
      </Paper>
    </div>
  )
}

CreateEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateEmployees
