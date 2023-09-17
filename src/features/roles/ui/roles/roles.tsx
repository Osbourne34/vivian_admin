import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Column, Sort, Table } from '@/shared/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { Role } from '../../types/role'
import { RolesService } from '../../service/roles-service'
import { enqueueSnackbar } from 'notistack'
import { Box, Chip, Paper, SelectChangeEvent, TextField } from '@mui/material'
import { Actions } from '@/shared/ui/actions/actions'
import { useRouter } from 'next/router'
import { useConfirmDialog } from '@/shared/ui/confirm-dialog/context/confirm-dialog-context'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import { EditRole } from '../edit-role/edit-role'
import debounce from 'lodash.debounce'

export const Roles = () => {
  const { push } = useRouter()
  const queryClient = useQueryClient()
  const { openConfirm, closeConfirm } = useConfirmDialog()
  const { openModal } = useModal()

  const [sort, setSort] = useState<Sort>({
    orderby: 'asc',
    sort: 'id',
  })

  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [search, setSearch] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')

  const {
    data: roles,
    isError,
    isFetching,
  } = useQuery<ResponseWithPagination<Role[]>, Error>({
    queryKey: ['roles', sort, page, rowsPerPage, debouncedSearchValue],
    queryFn: () =>
      RolesService.getRoles({
        orderby: sort.orderby,
        sort: sort.sort,
        page: page,
        perpage: rowsPerPage,
        search: debouncedSearchValue,
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

  const deleteMutation = useMutation<ResponseWithMessage, Error, number>({
    mutationFn: RolesService.deleteRole,
    onSuccess: (data) => {
      if (roles?.data.length === 1 && page !== 1) {
        setPage((prevState) => prevState - 1)
      } else {
        queryClient.invalidateQueries([
          'roles',
          sort,
          page,
          rowsPerPage,
          debouncedSearchValue,
        ])
      }
      closeConfirm()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (error) => {
      if (error?.status === 401) {
        push('/login')
      } else {
        enqueueSnackbar(error?.message, {
          variant: 'error',
        })
        closeConfirm()
      }
    },
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchValue(value)
      setPage(1)
    }, 500),
    [],
  )

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  const handleUpdate = (id: number) => {
    openModal({
      title: 'Редактирование ориентира',
      modal: <EditRole id={id} />,
    })
  }

  const handleDelete = (id: number) => {
    openConfirm({
      text: 'Вы действительно хотите удалить этот ориентир?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id)
      },
    })
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
      title: 'Название',
      sortable: true,
    },
    {
      key: 'permissions',
      title: 'Права',
      component: (item: any) => {
        return (
          <div className="flex flex-wrap gap-2 py-2">
            {item.permissions.map(
              (permission: { id: number; name: string }) => (
                <Chip
                  key={permission.id}
                  label={permission.name}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ),
            )}
          </div>
        )
      },
    },
    {
      key: 'action',
      title: 'Действия',
      align: 'right',
      component: (item: any) => {
        return (
          <Actions
            onDelete={() => handleDelete(item.id)}
            onUpdate={() => handleUpdate(item.id)}
          />
        )
      },
      width: 100,
    },
  ]

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchValue])

  return (
    <>
      <Paper elevation={4}>
        <Box
          className="p-3"
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
          })}
        >
          <TextField
            onChange={handleChangeSearch}
            value={search}
            label="Поиск..."
            size="small"
            fullWidth
          />
        </Box>
        <Table
          columns={columns}
          data={roles?.data}
          onSort={handleSort}
          sort={sort}
          count={roles?.pagination.last_page || 1}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          isLoading={isFetching}
          isError={isError}
        />
      </Paper>
    </>
  )
}
