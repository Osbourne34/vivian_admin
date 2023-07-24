import { ReactElement, useState } from 'react'
import NextLink from 'next/link'

import { Fab, TablePaginationProps, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Layout } from '@/shared/layouts/layout'

import {
  DataGrid,
  GridColDef,
  gridPageSelector,
  gridPageSizeSelector,
  GridPagination,
  gridRowCountSelector,
  GridSortModel,
  GridToolbar,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'

import { useQuery } from '@tanstack/react-query'
import { EmployeesService } from '@/features/employees'
import MuiPagination from '@mui/material/Pagination'

const Pagination = ({
  className,
}: Pick<TablePaginationProps, 'onPageChange' | 'className'>) => {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridRowCountSelector)
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector)

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={Math.ceil(pageCount / pageSize)}
      page={page + 1}
      onChange={(event, value) => {
        apiRef.current.setPage(value - 1)
      }}
    />
  )
}
const CustomPagination = (props: any) => {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'name',
    headerName: 'Имя',
    flex: 1,
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    flex: 1,
  },
  {
    field: 'active',
    type: 'boolean',
    headerName: 'Активен',
  },
]

const Employees = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [rowCount, setCount] = useState(0)
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: '',
      sort: null,
    },
  ])

  const { data, isLoading } = useQuery({
    queryKey: ['employees', paginationModel, sortModel],
    queryFn: () =>
      EmployeesService.getEmployees(
        paginationModel.page + 1,
        paginationModel.pageSize,
        sortModel[0].field,
        sortModel[0].sort,
      ),
    onSuccess: (data) => {
      setCount(data.pagination.total)
    },
  })

  const onSortModelChange = (data: GridSortModel) => {
    if (data.length) setSortModel(data)
    else setSortModel([{ field: '', sort: null }])
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Сотрудники
      </Typography>

      <div className="h-[640px]">
        <DataGrid
          columns={columns}
          rows={data?.data || []}
          loading={isLoading}
          sortingMode="server"
          onSortModelChange={onSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: GridToolbar, pagination: CustomPagination }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>

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

Employees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Employees
