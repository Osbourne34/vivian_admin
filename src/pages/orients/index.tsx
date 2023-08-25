import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Layout } from '@/shared/layouts/layout'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { Orient } from '@/features/orients/types/Orient'
import { useDebounce } from '@/shared/hooks'
import {
  ResponseWithPagination,
  Error,
  ResponseWithMessage,
} from '@/shared/http'
import { OrientsService } from '@/features/orients/service/orients-service'

type Order = 'asc' | 'desc'

const Orients = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Orient>('id')

  const [searchValue, setSeachValue] = useState<string>('')
  const debouncedSearch = useDebounce(searchValue)

  const [branch, setBranch] = useState('')

  const [open, setOpen] = useState(false)
  const deleteId = useRef<number>()

  const {
    data: orients,
    isFetching,
    isError,
    error,
  } = useQuery<ResponseWithPagination<Orient[]>, Error>({
    queryKey: [
      'orients',
      page,
      rowsPerPage,
      order,
      orderBy,
      debouncedSearch,
      branch,
    ],
    queryFn: () =>
      OrientsService.getOrients({
        page,
        perpage: rowsPerPage,
        orderby: order,
        sort: orderBy,
        search: debouncedSearch,
        branch_id: branch ? branch : null,
      }),
    onError: (error) => {
      if (error?.status === 401) {
        router.push('/login')
      }
    },
    retry: 0,
    keepPreviousData: true,
    staleTime: 20000,
    refetchOnWindowFocus: false,
  })

  const deleteMutation = useMutation<ResponseWithMessage, Error, number>({
    mutationFn: OrientsService.deleteOrient,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orients'])
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
    property: keyof Orient,
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
      router.push(`/orients/edit/${id}`)
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
        <Typography variant="h5">Ориентиры</Typography>
        <Button component={NextLink} href="/orients/create" variant="contained">
          Добавить ориентир
        </Button>
      </div>

      <Paper elevation={4}>
        <Box
          className="p-3"
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
          })}
        >
          <TextField
            onChange={(event) => setSeachValue(event.target.value)}
            value={searchValue}
            size="small"
            label="Поиск..."
          />
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
                    Название
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, 'branch_id')}
                    active={orderBy === 'branch_id'}
                    direction={order}
                  >
                    Регион
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: 120 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {orients?.data.map(({ id, name, branch_id }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{branch_id}</TableCell>
                  <TableCell padding={'none'} sx={{ px: 2 }} align="right">
                    <div className="flex space-x-2">
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
            count={orients?.pagination.last_page}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить этот регион?
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

Orients.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Orients
