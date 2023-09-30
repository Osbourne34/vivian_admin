import { ChangeEvent, useCallback, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Paper, SelectChangeEvent, TextField } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { BranchesService } from '../../service/branches-service'
import { NestedTable } from '../nested-table/nested-table'
import { Branch } from '../../types/Branch'

import { useConfirmDialog } from '@/shared/ui/confirm-dialog/context/confirm-dialog-context'
import { Sort } from '@/shared/ui/table'
import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import EditBranch from '../edit-branch/edit-branch'
import debounce from 'lodash.debounce'

export const Branches = () => {
  const router = useRouter()
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
    data: braches,
    isFetching,
    isError,
  } = useQuery<ResponseWithPagination<Branch[]>, Error>({
    queryKey: ['branches', sort, page, rowsPerPage, debouncedSearchValue],
    queryFn: () =>
      BranchesService.getBranches({
        page,
        perpage: rowsPerPage,
        orderby: sort.orderby,
        sort: sort.sort,
        search: debouncedSearchValue,
      }),
    onError: (error) => {
      if (error?.status === 401) {
        router.push('/login')
      }
    },
    retry: 0,
    keepPreviousData: true,
  })

  const deleteMutation = useMutation<ResponseWithMessage, Error, number>({
    mutationFn: BranchesService.deleteBranch,
    onSuccess: (data) => {
      if (braches?.data.length === 1 && page !== 1) {
        setPage((prevState) => prevState - 1)
      } else {
        queryClient.invalidateQueries([
          'branches',
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
        router.push('/login')
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
    debouncedSearch(value)
    setSearch(value)
  }

  const handleUpdate = (id: number) => {
    openModal({
      title: 'Редактирование региона',
      modal: <EditBranch id={id} />,
    })
  }

  const handleDelete = (id: number) => {
    openConfirm({
      text: 'Вы действительно хотите удалить этот регион?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id)
      },
    })
  }

  return (
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
      <NestedTable
        data={braches?.data || []}
        onSort={handleSort}
        sort={sort}
        count={braches?.pagination.last_page || 1}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        isLoading={isFetching}
        isError={isError}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </Paper>
  )
}
