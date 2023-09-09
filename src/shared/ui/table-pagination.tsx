import {
  Box,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
} from '@mui/material'

interface TablePaginationProps {
  count?: number
  page: number
  rowsPerPage: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange: (event: SelectChangeEvent<string>) => void
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void
}

export const TablePagination = (props: TablePaginationProps) => {
  const {
    count,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50],
    onRowsPerPageChange,
    onPageChange,
  } = props

  return (
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
          onChange={onRowsPerPageChange}
          size="small"
        >
          {rowsPerPageOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Pagination
        size="large"
        color="primary"
        count={count}
        page={page}
        onChange={onPageChange}
      />
    </Box>
  )
}
