import { ReactElement } from 'react'
import { Layout } from '@/shared/layouts/layout'
import { Button, Paper, Typography } from '@mui/material'
import NextLink from 'next/link'

import { Branches } from '@/features/branches/ui/branches/branches'
import { AddBranch } from '@/features/branches/ui/add-branch/add-branch'

const BranchesPage = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5">Регионы</Typography>
        <AddBranch />
      </div>

      <Branches />
    </div>
  )
}

BranchesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default BranchesPage
