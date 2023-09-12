import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

import { Sort } from '@/shared/ui/table'

import { Branch } from '../../types/branch'
import { useState } from 'react'
import { Actions } from '@/shared/ui/actions/actions'

interface NestedTableProps {
  data: Branch[]
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
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}

export const NestedTable = (props: NestedTableProps) => {
  const {
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
    onUpdate,
    onDelete,
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
        <Table sx={{ minWidth: 600 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell width={100}>
                <TableSortLabel
                  active={sort.sort === 'id'}
                  direction={sort.orderby}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.sort === 'name'}
                  direction={sort.orderby}
                  onClick={() => handleSort('name')}
                >
                  Название
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.sort === 'warehouse'}
                  direction={sort.orderby}
                  onClick={() => handleSort('warehouse')}
                >
                  Имеется склад
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((branch) => (
              <Row
                key={branch.id}
                branch={branch}
                onUpdate={(id: number) => onUpdate(id)}
                onDelete={(id: number) => onDelete(id)}
              />
            ))}
          </TableBody>
        </Table>
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

interface RowProps {
  branch: Branch
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}

const Row = (props: RowProps) => {
  const {
    branch: { id, name, warehouse, childrens },
    onDelete,
    onUpdate,
  } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell padding="none" className="px-4">
          {childrens && childrens.length > 0 && (
            <IconButton onClick={() => setOpen((o) => !o)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{id}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          {warehouse ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
        </TableCell>
        <TableCell padding="none" className="px-4">
          <Actions
            onUpdate={() => onUpdate(id)}
            onDelete={() => onDelete(id)}
          />
        </TableCell>
      </TableRow>
      {childrens && childrens?.length > 0 && (
        <TableRow>
          <TableCell colSpan={6} padding="none">
            <Collapse in={open}>
              <div className="p-4">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={100}>ID</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell>Имеется склад</TableCell>
                      <TableCell width={100} align="right">
                        Действия
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {childrens.map(({ id, name, warehouse }) => (
                      <TableRow key={id}>
                        <TableCell width={100}>{id}</TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          {warehouse ? (
                            <CheckRoundedIcon />
                          ) : (
                            <CloseRoundedIcon />
                          )}
                        </TableCell>
                        <TableCell padding="none" className="px-4">
                          <Actions
                            onUpdate={() => onUpdate(id)}
                            onDelete={() => onDelete(id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
