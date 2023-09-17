import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConfirmDialog } from '@/shared/ui/confirm-dialog/context/confirm-dialog-context'
import { Column, Sort, Table } from '@/shared/ui/table'
import {
  Error,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { Client } from '../../types/client'
import { ClientsService } from '../../service/client-service'
import { enqueueSnackbar } from 'notistack'
import { Paper, SelectChangeEvent } from '@mui/material'
import { Actions } from '@/shared/ui/actions/actions'
import { ClientsFilter } from '../clients-filter/clients-filter'
import { Status, Verify } from '../clients-filter/filters'

import debounce from 'lodash.debounce'

export const Clients = () => {
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
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [branch, setBranch] = useState<number | null>(null)
  const [manager, setManager] = useState<number | null>(null)
  const [verify, setVerify] = useState<Verify>(Verify.All)
  const [status, setStatus] = useState<Status>(Status.All)

  const {
    data: clients,
    isError,
    isFetching,
  } = useQuery<ResponseWithPagination<Client[]>, Error>({
    queryKey: [
      'clients',
      sort,
      page,
      rowsPerPage,
      debouncedSearchValue,
      branch,
      manager,
      verify,
      status,
    ],
    queryFn: () =>
      ClientsService.getClients({
        branch_id: branch,
        orderby: sort.orderby,
        sort: sort.sort,
        page: page,
        perpage: rowsPerPage,
        search: debouncedSearchValue,
        manager_id: manager,
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
    mutationFn: ClientsService.deleteClient,
    onSuccess: (data) => {
      if (clients?.data.length === 1 && page !== 1) {
        setPage((prevState) => prevState - 1)
      } else {
        queryClient.invalidateQueries([
          'clients',
          sort,
          page,
          rowsPerPage,
          debouncedSearchValue,
          branch,
          manager,
          verify,
          status,
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

  const handleUpdate = (id: number) => {
    push(`/clients/edit/${id}`)
  }

  const handleDelete = (id: number) => {
    openConfirm({
      text: 'Вы действительно хотите удалить этого клиента?',
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
    },
    {
      key: 'manager_id',
      title: 'Менеджер',
      sortable: true,
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
          <Actions
            onDelete={() => handleDelete(item.id)}
            onUpdate={() => handleUpdate(item.id)}
          />
        )
      },
      width: 100,
    },
  ]

  return (
    <Paper elevation={4}>
      <ClientsFilter
        search={search}
        onChangeSearch={(value) => {
          debouncedSearch(value)
          setSearch(value)
        }}
        onChangeBranch={(value) => {
          setBranch(value)
          setPage(1)
        }}
        verify={verify}
        onChangeVerify={(value) => {
          setVerify(value)
          setPage(1)
        }}
        status={status}
        onChangeStatus={(value) => {
          setStatus(value)
          setPage(1)
        }}
        onChangeManager={(value) => {
          setManager(value)
          setPage(1)
        }}
      />
      <Table
        columns={columns}
        data={clients?.data}
        onSort={handleSort}
        sort={sort}
        count={clients?.pagination.last_page || 1}
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
