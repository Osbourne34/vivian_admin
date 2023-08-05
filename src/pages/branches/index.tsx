import React, { ReactElement } from 'react'
import { Layout } from '@/shared/layouts/layout'
import { Fab, Typography } from '@mui/material'
import NextLink from 'next/link'

import AddIcon from '@mui/icons-material/Add'

const Branches = () => {
  return (
    <div>
      <Typography variant="h5" mb={3}>
        Регионы
      </Typography>

      <Fab
        component={NextLink}
        href="/branches/create"
        color="primary"
        aria-label="add"
        className="fixed bottom-6 right-6"
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

Branches.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Branches
