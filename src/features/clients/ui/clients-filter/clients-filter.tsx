import { ComboBox } from '@/shared/ui/combobox/combobox'
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
import { ChangeEvent } from 'react'
import { Status, Verify, statusValues, verifyValues } from './filters'
import { Filters } from '@/shared/api/filters/filters'
import { useQuery } from '@tanstack/react-query'
import { branchesSort } from '@/shared/utils/branches-sort'

interface ClientsFilterProps {
  search: string
  onChangeSearch: (value: string) => void
  onChangeBranch: (value: number | null) => void
  verify: Verify
  onChangeVerify: (value: Verify) => void
  status: Status
  onChangeStatus: (value: Status) => void
  onChangeManager: (value: number | null) => void
}

export const ClientsFilter = (props: ClientsFilterProps) => {
  const {
    search,
    onChangeSearch,
    onChangeBranch,
    verify,
    onChangeVerify,
    status,
    onChangeStatus,
    onChangeManager,
  } = props

  const {
    data: branches,
    isFetching: branchesLoading,
    refetch: branchesRefetch,
  } = useQuery(['branches'], () => Filters.getBranches(), {
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
    data: managers,
    isFetching: managersLoading,
    refetch: managersRefetch,
  } = useQuery(['managers'], Filters.getManagers, {
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

  const handleChangeManager = (
    event: any,
    value: { id: number; name: string } | null,
  ) => {
    onChangeManager(value?.id || null)
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
            options={managers?.data || []}
            labelKey={'name'}
            onChange={handleChangeManager}
            isLoading={managersLoading}
            refetch={managersRefetch}
            label="Менеджер"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
