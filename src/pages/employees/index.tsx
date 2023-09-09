import { ReactElement } from 'react'
import NextLink from 'next/link'

import { Typography, Button } from '@mui/material'

import { Layout } from '@/shared/layouts/layout'
import { Employees } from '@/features/employees/ui/employees/employees'

const EmployeesPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Typography variant="h5">Сотрудники</Typography>
        <Button
          component={NextLink}
          href="/employees/create"
          variant="contained"
        >
          Добавить сотрудника
        </Button>
      </div>

      <Employees />
    </>
  )
}

EmployeesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default EmployeesPage
