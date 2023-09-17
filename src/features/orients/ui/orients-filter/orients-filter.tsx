import { useQuery } from '@tanstack/react-query'
import { Box, Grid, TextField } from '@mui/material'
import { ComboBox } from '@/shared/ui/combobox/combobox'
import { ChangeEvent } from 'react'
import { branchesSort } from '@/shared/utils/branches-sort'
import { Filters } from '@/shared/api/filters/filters'

interface OrientsFilterProps {
  search: string
  onChangeSearch: (value: string) => void
  onChangeBranch: (value: number | null) => void
}

export const OrientsFilter = (props: OrientsFilterProps) => {
  const { search, onChangeSearch, onChangeBranch } = props

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeSearch(event.target.value)
  }

  const handleChangeRegion = (
    event: any,
    value: { id: number; name: string } | null,
  ) => {
    onChangeBranch(value?.id || null)
  }

  const {
    data: branches,
    isFetching: branchesLoading,
    refetch: branchesRefetch,
  } = useQuery(['branches'], Filters.getBranches, {
    select: (data) => {
      const result = branchesSort(data.data)

      return {
        data: result,
        status: data.status,
      }
    },
    enabled: false,
  })

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
      </Grid>
    </Box>
  )
}
