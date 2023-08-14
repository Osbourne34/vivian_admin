import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Layout } from '@/shared/layouts/layout'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Collapse,
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
import NextLink from 'next/link'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { Branch } from '@/features/branches/types/Branch'
import { useDebounce } from '@/shared/hooks'
import {
  ResponseWithPagination,
  Error,
  ResponseWithMessage,
} from '@/shared/http'
import { BranchesService } from '@/features/branches'

import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

type Order = 'asc' | 'desc'

const Branches = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [opened, setOpened] = useState<number[]>([])

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Branch>('id')

  const [searchValue, setSeachValue] = useState<string>('')
  const debouncedSearch = useDebounce(searchValue)

  const [open, setOpen] = useState(false)
  const deleteId = useRef<number>()

  const { data, isLoading, isFetching, error, isError } = useQuery<
    ResponseWithPagination<Branch[]>,
    Error
  >({
    queryKey: ['branches', page, rowsPerPage, order, orderBy, debouncedSearch],
    queryFn: () =>
      BranchesService.getBranches({
        page,
        perpage: rowsPerPage,
        orderby: order,
        sort: orderBy,
        search: debouncedSearch,
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
    mutationFn: BranchesService.deleteBranch,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['branches'])
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
    property: keyof Branch,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
      router.push(`/branches/edit/${id}`)
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
        <Typography variant="h5">Регионы</Typography>
        <Button
          component={NextLink}
          href="/branches/create"
          variant="contained"
        >
          Добавить регион
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
                <TableCell sx={{ width: 72 }} />
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
                    onClick={(event) => handleRequestSort(event, 'warehouse')}
                    active={orderBy === 'warehouse'}
                    direction={order}
                  >
                    Имеется склад
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: 120 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map(({ id, name, warehouse, childrens }) => (
                <Fragment key={id}>
                  <TableRow>
                    <TableCell padding="none" sx={{ px: 2 }}>
                      {childrens?.length ? (
                        <IconButton
                          onClick={() => {
                            if (opened.includes(id)) {
                              setOpened((prevState) =>
                                prevState.filter((value) => value !== id),
                              )
                            } else {
                              setOpened([...opened, id])
                            }
                          }}
                        >
                          {opened.includes(id) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      ) : null}
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell padding="none" sx={{ px: 2 }}>
                      {warehouse ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
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
                  <TableRow>
                    <TableCell sx={{ p: 0, borderBottom: 'none' }} colSpan={5}>
                      <Collapse
                        in={opened.includes(id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box
                          sx={(theme) => ({
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.grey[300]}`,
                          })}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: 100 }}>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Имеется склад</TableCell>
                                <TableCell sx={{ width: 120 }}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {childrens?.map(({ id, name, warehouse }) => (
                                <TableRow key={id}>
                                  <TableCell>{id}</TableCell>
                                  <TableCell>{name}</TableCell>
                                  <TableCell padding="none" sx={{ px: 2 }}>
                                    {warehouse ? (
                                      <CheckRoundedIcon fontSize={'small'} />
                                    ) : (
                                      <CloseRoundedIcon fontSize={'small'} />
                                    )}
                                  </TableCell>
                                  <TableCell
                                    padding={'none'}
                                    sx={{ px: 2 }}
                                    align="right"
                                  >
                                    <div className="space-x-2">
                                      <IconButton
                                        size="small"
                                        onClick={editEmployee(id)}
                                      >
                                        <ModeEditOutlineRoundedIcon />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={deleteEmployee(id)}
                                        color="error"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
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

Branches.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Branches
