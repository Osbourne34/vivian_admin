import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { Orients } from '@/features/orients/ui/orients/orients'

import { Layout } from '@/shared/layouts/layout'
import { AddOrient } from '@/features/orients/ui/add-orient/add-orient'

const OrientsPage = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5">Ориентиры</Typography>
        <AddOrient />
      </div>

      <Orients />
    </div>
  )
}

OrientsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default OrientsPage
