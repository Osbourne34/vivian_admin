import { useState } from 'react'
import { useRouter } from 'next/router'

import { IconButton, Paper, SelectChangeEvent } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteIcon from '@mui/icons-material/Delete'

import { EmployeesService } from '../../service/employees-service'
import { Employee } from '../../types/employee'
import { EmployeesFilter } from '../employees-filter/employees-filter'
import { Status, Verify } from '../../config/filters'

import { Column, Sort, Table } from '@/shared/ui/table'
import { useDebounce } from '@/shared/hooks'
import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { useConfirmDialog } from '@/shared/ui/confirm-dialog/context/context'

export const Employees = () => {
  const { push } = useRouter()
  const queryClient = useQueryClient()
  const { openConfirm, closeConfirm } = useConfirmDialog()

  const [sort, setSort] = useState<Sort>({
    orderby: 'asc',
    sort: 'id',
  })

  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState<number | null>(null)
  const [verify, setVerify] = useState<Verify>(Verify.All)
  const [status, setStatus] = useState<Status>(Status.All)
  const [role, setRole] = useState<string | null>(null)

  const debouncedSearchValue = useDebounce(search)

  const { data, isError, isFetching } = useQuery<
    ResponseWithPagination<Employee[]>,
    Error
  >({
    queryKey: [
      'employees',
      sort,
      page,
      rowsPerPage,
      debouncedSearchValue,
      branch,
      verify,
      status,
      role,
    ],
    queryFn: () =>
      EmployeesService.getEmployees({
        branch_id: branch,
        orderby: sort.orderby,
        sort: sort.sort,
        page: page,
        perpage: rowsPerPage,
        role,
        search: debouncedSearchValue,
        sortbyactivity: status,
        sortbyverified: verify,
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
    mutationFn: EmployeesService.deleteEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        'employees',
        sort,
        page,
        rowsPerPage,
        debouncedSearchValue,
        branch,
        verify,
        status,
        role,
      ])
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

  const handleUpdate = (id: number) => {
    push(`/employees/edit/${id}`)
  }

  const handleDelete = (id: number) => {
    openConfirm({
      text: 'Вы действительно хотите удалить этого сотрудника?',
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
      title: 'Имя',
      sortable: true,
    },
    {
      key: 'phone',
      title: 'Номер телефона',
      sortable: true,
    },
    {
      key: 'birthday',
      title: 'День рождения',
      sortable: true,
    },
    {
      key: 'address',
      title: 'Адресс',
      sortable: true,
      align: 'right',
    },
    {
      key: 'active',
      title: 'Активен',
      boolean: true,
    },
    {
      key: 'action',
      title: 'Действия',
      align: 'right',
      component: (item: any) => {
        return (
          <div className={'flex gap-2'}>
            <IconButton
              onClick={() => handleUpdate(item.id)}
              size="small"
              color="primary"
            >
              <EditRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(item.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )
      },
      width: 100,
    },
  ]

  return (
    <Paper elevation={4}>
      <EmployeesFilter
        search={search}
        onChangeSearch={setSearch}
        onChangeBranch={setBranch}
        verify={verify}
        onChangeVerify={setVerify}
        status={status}
        onChangeStatus={setStatus}
        onChangeRole={setRole}
      />
      <Table
        columns={columns}
        data={data?.data}
        onSort={handleSort}
        sort={sort}
        count={data?.pagination.last_page || 1}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        isLoading={isFetching}
        isError={isError}
      />
    </Paper>
  )
}
