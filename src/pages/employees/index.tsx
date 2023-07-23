import { ReactElement } from 'react'
import NextLink from 'next/link'

import { Button, Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Layout } from '@/shared/layouts/layout'

import { DataGrid } from '@mui/x-data-grid'

const Admins = () => {
  return (
    <div>
      <Typography variant="h5" mb={3}>
        Сотрудники
      </Typography>

      {/* <div className="h-[700px]"><DataGrid /></div> */}

      <Fab
        component={NextLink}
        href="/employees/create"
        color="primary"
        aria-label="add"
        className="fixed bottom-6 right-6"
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

Admins.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Admins
