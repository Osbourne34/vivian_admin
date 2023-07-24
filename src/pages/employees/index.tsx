import { ReactElement, useState } from 'react'
import NextLink from 'next/link'

import {
  Fab,
  TablePaginationProps,
  Typography,
  Pagination as MuiPagination,
  Alert,
  Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import {
  DataGrid,
  GridColDef,
  GridFilterModel,
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

import { Layout } from '@/shared/layouts/layout'
import { useRouter } from 'next/router'
import { Employee } from '@/features/employees/types/employee'
import { Error, ResponseWithData, ResponseWithPagination } from '@/shared/http'

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
  const router = useRouter()

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
  const [searchValue, setSeachValue] = useState<string>('')

  const { data, isLoading, error, isError, refetch } = useQuery<
    ResponseWithPagination<Employee[]>,
    Error
  >({
    queryKey: ['employees', paginationModel, sortModel, searchValue],
    queryFn: () =>
      EmployeesService.getEmployees(
        paginationModel.page + 1,
        paginationModel.pageSize,
        sortModel[0].sort,
        sortModel[0].field,
        searchValue,
      ),
    onSuccess: (data) => {
      setCount(data.pagination.total)
    },
    onError: (error) => {
      if (error?.status === 401) {
        router.push('/login')
      }
    },
    retry: 0,
    staleTime: 20000,
  })

  const onSortModelChange = (data: GridSortModel) => {
    if (data.length) setSortModel(data)
    else setSortModel([{ field: '', sort: null }])
  }

  const onFilterChange = (data: GridFilterModel) => {
    setSeachValue(data.quickFilterValues?.join('') || '')
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
          filterMode="server"
          onFilterModelChange={onFilterChange}
          sortingMode="server"
          onSortModelChange={onSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[10, 25, 50]}
          slots={{
            toolbar: GridToolbar,
            pagination: CustomPagination,
            noRowsOverlay: () => (
              <div className="flex h-full flex-col items-center justify-center">
                {isError ? (
                  <>
                    <Alert variant="filled" severity="error">
                      {error?.message}
                    </Alert>
                    <Button
                      onClick={() => refetch()}
                      variant="outlined"
                      className="mt-4"
                    >
                      Загрузить снова
                    </Button>
                  </>
                ) : (
                  <div>Нет строк</div>
                )}
              </div>
            ),
          }}
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
