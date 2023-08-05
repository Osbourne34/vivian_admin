import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Fab,
  Typography,
  Pagination,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  CircularProgress,
  AlertTitle,
  IconButton,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { EmployeesService } from '@/features/employees'
import { Employee } from '@/features/employees/types/employee'

import { Layout } from '@/shared/layouts/layout'

import { useDebounce } from '@/shared/hooks'

import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'

type Order = 'asc' | 'desc'

const Employees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Employee>('id')

  const [searchValue, setSeachValue] = useState<string>('')
  const debouncedSearch = useDebounce(searchValue)

  const [open, setOpen] = useState(false)
  const deleteId = useRef<number>()

  const { data, isLoading, isFetching, error, isError } = useQuery<
    ResponseWithPagination<Employee[]>,
    Error
  >({
    queryKey: ['employees', page, rowsPerPage, order, orderBy, debouncedSearch],
    queryFn: () =>
      EmployeesService.getEmployees(
        page,
        rowsPerPage,
        order,
        orderBy,
        debouncedSearch,
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Employee,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const deleteEmployee = useCallback(
    (id: number) => () => {
      handleClickOpen()
      deleteId.current = id
    },
    [],
  )

  const editEmployee = useCallback(
    (id: number) => () => {
      router.push(`/employees/edit/${id}`)
    },
    [],
  )

  const confirmDeletionEmployee = () => {
    deleteMutation.mutate(Number(deleteId.current))
  }

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Сотрудники
      </Typography>
      <Paper>
        <div className="p-3">
          <TextField
            onChange={(event) => setSeachValue(event.target.value)}
            value={searchValue}
            size="small"
            label="Поиск сотрудника"
          />
        </div>
        <TableContainer sx={{ height: 588, position: 'relative' }}>
          {isLoading && (
            <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black/5">
              <CircularProgress />
            </div>
          )}
          {isError && (
            <Alert variant="filled" severity="error">
              <AlertTitle>Ошибка</AlertTitle>
              {error.message}
            </Alert>
          )}
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.grey[300]}`,
                    backgroundColor: theme.palette.grey[100],
                    width: 100,
                  })}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'id')}
                    active={orderBy === 'id'}
                    direction={order}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.grey[300]}`,
                    backgroundColor: theme.palette.grey[100],
                  })}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'name')}
                    active={orderBy === 'name'}
                    direction={order}
                  >
                    Имя
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.grey[300]}`,
                    backgroundColor: theme.palette.grey[100],
                  })}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'phone')}
                    active={orderBy === 'phone'}
                    direction={order}
                  >
                    Телефон
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.grey[300]}`,
                    backgroundColor: theme.palette.grey[100],
                  })}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'active')}
                    active={orderBy === 'active'}
                    direction={order}
                  >
                    Активен
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.grey[300]}`,
                    backgroundColor: theme.palette.grey[100],
                    width: 120,
                  })}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map(({ active, id, name, phone }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{phone}</TableCell>
                  <TableCell>{JSON.stringify(active)}</TableCell>
                  <TableCell padding={'none'} sx={{ px: 2 }} align="right">
                    <div className="space-x-2">
                      <IconButton onClick={editEmployee(id)}>
                        <ModeEditOutlineRoundedIcon />
                      </IconButton>
                      <IconButton onClick={deleteEmployee(id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex items-center justify-end space-x-4 p-3">
          <div className="flex items-center space-x-2">
            <div>Строк на странице: </div>
            <Select
              value={String(rowsPerPage)}
              onChange={handleChangeRowsPerPage}
              size="small"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
          <Pagination
            size="large"
            color="primary"
            count={data?.pagination.last_page}
            page={page}
            onChange={handleChangePage}
          />
        </div>
      </Paper>
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
            onClick={confirmDeletionEmployee}
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
