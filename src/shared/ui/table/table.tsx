import {
  CircularProgress,
  SelectChangeEvent,
  TableContainer,
  Typography,
  Table as MUITable,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Box,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

import { Column, Sort } from './types'

interface TableProps {
  columns: Column[]
  data: any
  onSort: (sort: Sort) => void
  sort: Sort
  count: number
  page: number
  rowsPerPage: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange: (event: SelectChangeEvent<string>) => void
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void
  isLoading: boolean
  isError: boolean
}

export const Table = (props: TableProps) => {
  const {
    columns,
    data = [],
    onSort,
    sort,
    count,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50],
    onRowsPerPageChange,
    onPageChange,
    isLoading,
    isError,
  } = props

  const handleSort = (key: string) => {
    if (key === sort.sort) {
      onSort({
        ...sort,
        orderby: sort.orderby === 'asc' ? 'desc' : 'asc',
      })
    } else {
      onSort({
        sort: key,
        orderby: 'asc',
      })
    }
  }

  return (
    <>
      <TableContainer sx={{ height: 600, position: 'relative' }}>
        {isLoading && (
          <div className="sticky bottom-0 left-0 right-0 top-0 z-10">
            <div className="absolute top-[57px] flex h-[543px] w-full items-center justify-center bg-black/5">
              <CircularProgress />
            </div>
          </div>
        )}
        {!isLoading && !isError && data.length === 0 && (
          <div className="absolute top-[57px] flex h-[543px] w-full items-center justify-center">
            <Typography variant="h5">Ничего не найдено</Typography>
          </div>
        )}
        <MUITable sx={{ minWidth: 600 }} stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(({ key, sortable, title, align, width }) => (
                <TableCell
                  sx={{ whiteSpace: 'nowrap' }}
                  key={key}
                  width={width}
                  align={align}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={sort.sort === key}
                      direction={sort.orderby}
                      onClick={() => handleSort(key)}
                    >
                      {title}
                    </TableSortLabel>
                  ) : (
                    title || null
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: any) => {
              return (
                <TableRow key={item.id}>
                  {columns.map(({ key, align, width, boolean, component }) => (
                    <TableCell
                      key={key}
                      padding={component ? 'none' : 'normal'}
                      width={width}
                      align={align}
                    >
                      {component ? (
                        <div className="px-4">{component(item)}</div>
                      ) : boolean ? (
                        <Boolean boolean={item[key]} />
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </MUITable>
      </TableContainer>
      <Box
        sx={(theme) => ({
          borderTop: `1px solid ${theme.palette.grey[300]}`,
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          px: 2,
          py: 1.5,
        })}
      >
        <div className="flex items-center space-x-2">
          <Typography>Строк на странице: </Typography>
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
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}

const Boolean = (props: { boolean: boolean }) => {
  const { boolean } = props
  return boolean ? <CheckRoundedIcon /> : <CloseRoundedIcon />
}
