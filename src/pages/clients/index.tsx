import React, { ReactElement } from 'react'
import NextLink from 'next/link'

import { Button, Typography } from '@mui/material'

import { Layout } from '@/shared/layouts/layout'
import { Clients } from '@/features/clients/ui/clients/clients'

const ClientsPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Typography variant="h5">Клиенты</Typography>
        <Button component={NextLink} href="/clients/create" variant="contained">
          Создать клиента
        </Button>
      </div>

      <Clients />
    </>
  )
}

ClientsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ClientsPage
