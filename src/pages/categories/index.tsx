import React, { ReactElement } from 'react'
import { Typography } from '@mui/material'
import { Layout } from '@/shared/layouts/layout'
import { Categories } from '@/features/categories/ui/categories/categories'
import { AddCategory } from '@/features/categories/ui/add-category/add-category'

const CategoriesPage = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5">Категорий</Typography>

        <AddCategory />
      </div>

      <Categories />
    </div>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CategoriesPage
