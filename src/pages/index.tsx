import { ReactElement, useState } from 'react'
import { Layout } from '@/shared/layouts/layout'
import { useQuery } from '@tanstack/react-query'
import { EmployeesService } from '@/features/employees'

import { Error, ResponseWithPagination } from '@/shared/http'
import { Employee } from '@/features/employees/types/employee'
import { enqueueSnackbar } from 'notistack'
import { Button, SelectChangeEvent } from '@mui/material'
import { Table, Column, Sort } from '@/shared/ui/table'

const Home = () => {
  const [sort, setSort] = useState<Sort>({
    orderby: 'asc',
    sort: 'id',
  })
  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, isError, isLoading, isFetching } = useQuery<
    ResponseWithPagination<Employee[]>,
    Error
  >({
    queryKey: ['users', sort, page, rowsPerPage],
    queryFn: () =>
      EmployeesService.getEmployees({
        branch_id: null,
        orderby: sort.orderby,
        sort: sort.sort,
        page: page,
        perpage: rowsPerPage,
        role: 'client',
        search: '',
        sortbyactivity: '',
        sortbyverified: '',
      }),
    onError: (error) => {
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      })
    },
    retry: 0,
    keepPreviousData: true,
  })

  const handleSort = (sort: Sort) => {
    setSort(sort)
  }

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const columns: Column[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: 80,
    },
    {
      key: 'name',
      title: 'Имя',
      sortable: true,
    },
    {
      key: 'phone',
      title: 'Номер телефона',
      sortable: true,
    },
    {
      key: 'birthday',
      title: 'День рождения',
      sortable: true,
    },
    {
      key: 'address',
      title: 'Адресс',
      sortable: true,
      align: 'right',
    },
    {
      key: 'active',
      title: 'Активен',
      boolean: true,
    },
    {
      key: 'action',
      component: (item: any) => {
        return (
          <Button size="small" onClick={() => console.log('item', item)}>
            Delete
          </Button>
        )
      },
      width: 100,
    },
  ]

  return (
    <Table
      columns={columns}
      data={data?.data}
      onSort={handleSort}
      sort={sort}
      count={data?.pagination.last_page || 1}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      isLoading={isFetching}
      isError={isError}
    />
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
