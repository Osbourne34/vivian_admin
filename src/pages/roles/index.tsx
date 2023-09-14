import React, { ReactElement } from 'react'
import { Layout } from '@/shared/layouts/layout'
import { Typography } from '@mui/material'
import { Roles } from '@/features/roles/ui/roles/roles'
import { AddRole } from '@/features/roles/ui/add-role/add-role'

const RolesPage = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5">Роли</Typography>

        <AddRole />
      </div>

      <Roles />
    </div>
  )
}

RolesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default RolesPage
