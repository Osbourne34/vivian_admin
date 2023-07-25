import { ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Fab,
  TablePaginationProps,
  Typography,
  Pagination as MuiPagination,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  gridPageSelector,
  gridPageSizeSelector,
  GridPagination,
  gridRowCountSelector,
  GridRowId,
  GridSortModel,
  GridToolbar,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { EmployeesService } from '@/features/employees'
import { Employee } from '@/features/employees/types/employee'

import { Layout } from '@/shared/layouts/layout'

import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'

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

const Employees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: '',
      sort: null,
    },
  ])
  const [searchValue, setSeachValue] = useState<string>('')

  const [open, setOpen] = useState(false)
  const deleteId = useRef<GridRowId>()

  const { data, isFetching, error, isError, refetch } = useQuery<
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
    onError: (error) => {
      if (error?.status === 401) {
        router.push('/login')
      }
    },
    retry: 0,
    keepPreviousData: true,
    staleTime: 20000,
  })
  const deleteMutation = useMutation<ResponseWithMessage, Error, number>({
    mutationFn: EmployeesService.deleteEmployees,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['employees'])
      handleClose()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (error) => {
      if (error?.status === 401) {
        router.push('/login')
      } else {
        enqueueSnackbar(error?.message, {
          variant: 'error',
        })
      }
    },
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSortModelChange = (data: GridSortModel) => {
    if (data.length) setSortModel(data)
    else setSortModel([{ field: '', sort: null }])
  }

  const onFilterChange = (data: GridFilterModel) => {
    setSeachValue(data.quickFilterValues?.join('') || '')
  }

  const deleteEmployees = useCallback(
    (id: GridRowId) => () => {
      handleClickOpen()
      deleteId.current = id
    },
    [],
  )

  const editEmployees = useCallback((id: GridRowId) => () => {}, [])

  const confirmDeletionEmployees = () => {
    deleteMutation.mutate(Number(deleteId.current))
  }

  const columns = useMemo<GridColDef[]>(
    () => [
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
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id }) => [
          <GridActionsCellItem
            key={2}
            icon={<ModeEditOutlineRoundedIcon color="primary" />}
            label="Редактировать"
            onClick={deleteEmployees(id)}
          />,
          <GridActionsCellItem
            key={1}
            icon={<DeleteIcon color="error" />}
            label="Удалить"
            onClick={deleteEmployees(id)}
          />,
        ],
      },
    ],
    [deleteEmployees, editEmployees],
  )

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Сотрудники
      </Typography>

      <div className="h-[640px]">
        <DataGrid
          columns={columns}
          rows={data?.data || []}
          loading={isFetching}
          filterMode="server"
          onFilterModelChange={onFilterChange}
          sortingMode="server"
          onSortModelChange={onSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={data?.pagination.total || 0}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить этого сотрудника?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={deleteMutation.isLoading}
            onClick={handleClose}
            variant="outlined"
          >
            Отмена
          </Button>
          <LoadingButton
            loading={deleteMutation.isLoading}
            onClick={confirmDeletionEmployees}
            variant="contained"
            color="error"
          >
            Удалить
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

Employees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Employees
