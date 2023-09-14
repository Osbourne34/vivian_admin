import { ChangeEvent } from 'react'

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'

import { useQuery } from '@tanstack/react-query'
import { EmployeesService } from '../../service/employees-service'
import { ComboBox } from '@/shared/ui/combobox/combobox'

import { Status, Verify, statusValues, verifyValues } from './filters'
import { branchesSort } from '@/shared/utils/branches-sort'

interface EmployeesFilterProps {
  search: string
  onChangeSearch: (value: string) => void
  onChangeBranch: (value: number | null) => void
  verify: Verify
  onChangeVerify: (value: Verify) => void
  status: Status
  onChangeStatus: (value: Status) => void
  onChangeRole: (value: string | null) => void
}

export const EmployeesFilter = (props: EmployeesFilterProps) => {
  const {
    search,
    onChangeSearch,
    onChangeBranch,
    verify,
    onChangeVerify,
    status,
    onChangeStatus,
    onChangeRole,
  } = props

  const {
    data: branches,
    isFetching: branchesLoading,
    refetch: branchesRefetch,
  } = useQuery(['branches'], () => EmployeesService.getBranches(), {
    select: (data) => {
      const result = branchesSort(data.data)

      return {
        data: result,
        status: data.status,
      }
    },
    enabled: false,
  })

  const {
    data: roles,
    isFetching: rolesLoading,
    refetch: rolesRefetch,
  } = useQuery(['roles'], () => EmployeesService.getRoles('client'), {
    enabled: false,
  })

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeSearch(event.target.value)
  }

  const handleChangeRegion = (
    event: any,
    value: { id: number; name: string } | null,
  ) => {
    onChangeBranch(value?.id || null)
  }

  const handleChangeVerify = (event: SelectChangeEvent<string>) => {
    onChangeVerify(event.target.value as Verify)
  }

  const handleChangeStatus = (event: SelectChangeEvent<String>) => {
    onChangeStatus(event.target.value as Status)
  }

  const handleChangeRole = (
    event: any,
    value: { id: number; name: string } | null,
  ) => {
    onChangeRole(value?.name || null)
  }

  return (
    <Box
      className="p-3"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
      })}
    >
      <Grid container spacing={2}>
        <Grid xs={8} item>
          <TextField
            onChange={handleChangeSearch}
            value={search}
            label="Поиск..."
            size="small"
            fullWidth
          />
        </Grid>
        <Grid xs={4} item>
          <ComboBox
            options={branches?.data || []}
            labelKey={'name'}
            onChange={handleChangeRegion}
            isLoading={branchesLoading}
            refetch={branchesRefetch}
            label="Регион"
          />
        </Grid>
        <Grid xs={4} item>
          <FormControl fullWidth size="small">
            <InputLabel>Верификация</InputLabel>
            <Select
              value={verify}
              onChange={handleChangeVerify}
              label="Верификация"
            >
              {verifyValues.map(({ id, label, value }) => (
                <MenuItem value={value} key={id}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={4} item>
          <FormControl fullWidth size="small">
            <InputLabel>Статус</InputLabel>
            <Select value={status} onChange={handleChangeStatus} label="Статус">
              {statusValues.map(({ id, label, value }) => (
                <MenuItem value={value} key={id}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={4} item>
          <ComboBox
            options={roles?.data || []}
            labelKey={'name'}
            onChange={handleChangeRole}
            isLoading={rolesLoading}
            refetch={rolesRefetch}
            label="Роль"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
