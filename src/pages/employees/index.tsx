import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
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
  Box,
  Grid,
  InputLabel,
  FormControl,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'

import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

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
import { BranchesService } from '@/features/branches'

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

  const [branch, setBranch] = useState('')
  const [verify, setVerify] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [orient, setOrient] = useState('')
  const [manager, setManager] = useState('')

  const [open, setOpen] = useState(false)
  const deleteId = useRef<number>()

  const { data, isLoading, isFetching, error, isError } = useQuery<
    ResponseWithPagination<Employee[]>,
    Error
  >({
    queryKey: [
      'employees',
      page,
      rowsPerPage,
      order,
      orderBy,
      debouncedSearch,
      branch,
      verify,
      status,
      role,
      orient,
      manager,
    ],
    queryFn: () =>
      EmployeesService.getEmployees({
        page,
        perpage: rowsPerPage,
        order,
        sort: orderBy,
        search: debouncedSearch,
        branch_id: branch ? branch : null,
        sortbyactivity: verify,
        sortbyverified: status,
        role,
        orient_id: orient ? orient : null,
        manager_id: manager ? manager : null,
      }),
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

  const { data: branches } = useQuery(['branches'], () =>
    //@ts-ignore
    BranchesService.getBranches(),
  )

  const { data: roles } = useQuery(['roles'], () => EmployeesService.getRoles())

  const { data: orients } = useQuery(['orients'], () =>
    EmployeesService.getOrients(),
  )

  const { data: managers } = useQuery(['managers'], () =>
    EmployeesService.getManagers(),
  )

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
    if (page !== 1) {
      setPage(1)
    }
  }, [debouncedSearch])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5">Сотрудники</Typography>
        <Button
          component={NextLink}
          href="/employees/create"
          variant="contained"
        >
          Добавить сотрудника
        </Button>
      </div>
      <Paper elevation={4}>
        <Box
          className="p-3"
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
          })}
        >
          <Grid container spacing={2}>
            <Grid xs={3} item>
              <TextField
                onChange={(event) => setSeachValue(event.target.value)}
                value={searchValue}
                size="small"
                label="Поиск..."
                fullWidth
              />
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Регион</InputLabel>
                <Select
                  value={branch}
                  onChange={(event) => {
                    setBranch(event.target.value)
                  }}
                  label="Регион"
                >
                  <MenuItem value="">Все</MenuItem>
                  {branches?.data.map(({ id, name, childrens }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Верификация</InputLabel>
                <Select
                  value={verify}
                  onChange={(event) => {
                    setVerify(event.target.value)
                  }}
                  label="Верификация"
                >
                  <MenuItem value={''}>Все</MenuItem>
                  <MenuItem value={'verifieds'}>Верифицированные</MenuItem>
                  <MenuItem value={'unverifieds'}>Неверифицированные</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value)
                  }}
                  label="Статус"
                >
                  <MenuItem value={''}>Все</MenuItem>
                  <MenuItem value={'active'}>Активные</MenuItem>
                  <MenuItem value={'disactive'}>Неактивные</MenuItem>
                  <MenuItem value={'trasheds'}>Удаленные</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Роль</InputLabel>
                <Select
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value)
                  }}
                  label="Роль"
                >
                  <MenuItem value="">Все</MenuItem>
                  {roles?.data.map(({ id, name }) => (
                    <MenuItem key={id} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Ориентир</InputLabel>
                <Select
                  value={orient}
                  onChange={(event) => {
                    setOrient(event.target.value)
                  }}
                  label="Ориентир"
                >
                  <MenuItem value="">Все</MenuItem>
                  {orients?.data.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl size="small" fullWidth>
                <InputLabel>Менеджер</InputLabel>
                <Select
                  value={manager}
                  onChange={(event) => {
                    setManager(event.target.value)
                  }}
                  label="Менеджер"
                >
                  <MenuItem value="">Все</MenuItem>
                  {managers?.data.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <TableContainer className="relative h-[600px]">
          {isFetching && (
            <div className="sticky bottom-0 left-0 right-0 top-0 z-10">
              <div className="absolute flex h-[600px] w-full items-center justify-center bg-black/5">
                <CircularProgress />
              </div>
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
                <TableCell sx={{ width: 100 }}>
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'id')}
                    active={orderBy === 'id'}
                    direction={order}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'name')}
                    active={orderBy === 'name'}
                    direction={order}
                  >
                    Имя
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'phone')}
                    active={orderBy === 'phone'}
                    direction={order}
                  >
                    Телефон
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'active')}
                    active={orderBy === 'active'}
                    direction={order}
                  >
                    Активен
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: 120 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map(({ active, id, name, phone }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{phone}</TableCell>
                  <TableCell padding="none" sx={{ px: 2 }}>
                    {active ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
                  </TableCell>
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
        <Box
          className="flex items-center justify-end space-x-4 p-3"
          sx={(theme) => ({
            borderTop: `1px solid ${theme.palette.grey[300]}`,
          })}
        >
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
        </Box>
      </Paper>

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
