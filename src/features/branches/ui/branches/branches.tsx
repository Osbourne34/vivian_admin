import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Paper, SelectChangeEvent, TextField } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { BranchesService } from '../../service/branches-service'
import { NestedTable } from '../nested-table/nested-table'
import { Branch } from '../../types/branch'

import { useConfirmDialog } from '@/shared/ui/confirm-dialog/context/confirm-dialog-context'
import { useDebounce } from '@/shared/hooks'
import { Sort } from '@/shared/ui/table'
import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import EditBranch from '../edit-branch/edit-branch'

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

  const debouncedSearch = useDebounce(search)

  const { data, isFetching, isError } = useQuery<
    ResponseWithPagination<Branch[]>,
    Error
  >({
    queryKey: ['branches', sort, page, rowsPerPage, debouncedSearch],
    queryFn: () =>
      BranchesService.getBranches({
        page,
        perpage: rowsPerPage,
        orderby: sort.orderby,
        sort: sort.sort,
        search: debouncedSearch,
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
      queryClient.invalidateQueries([
        'branches',
        sort,
        page,
        rowsPerPage,
        debouncedSearch,
      ])
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

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
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

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

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
        data={data?.data || []}
        onSort={handleSort}
        sort={sort}
        count={data?.pagination.last_page || 1}
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
