import { ReactElement, useEffect, useState } from 'react'
import { Layout } from '@/shared/layouts/layout'
import {
  DataGrid,
  GridPagination,
  GridToolbar,
  gridPageSelector,
  gridRowCountSelector,
  gridPageSizeSelector,
  ruRU,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
  GridColDef,
} from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination'
import { TablePaginationProps } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function Pagination({
  className,
}: Pick<TablePaginationProps, 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridRowCountSelector)
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector)

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount / pageSize}
      page={page + 1}
      onChange={(event, value) => {
        apiRef.current.setPage(value - 1)
      }}
    />
  )
}

const CustomPagination = (props: any) => {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}

const Home = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [rowCountState, setRowCountState] = useState(0)
  const [sortParams, setSortParams] = useState({ field: '', sort: '' })
  const [searchValue, setSearchValue] = useState('')

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `http://localhost:3001/products?_limit=${
            paginationModel.pageSize
          }&_page=${paginationModel.page + 1}&_sort=${
            sortParams.field
          }&_order=${sortParams.sort}&q=${searchValue}`,
        )
        const totalCount = response.headers.get('X-Total-Count')
        const data = await response.json()

        setRowCountState(Number(totalCount))
        setProducts(data)
      } catch (error) {
        console.log(error, 'error')
      } finally {
        setIsLoading(false)
      }
    }

    getProduct()
  }, [paginationModel, sortParams, searchValue])

  const columns: GridColDef[] = [
    { field: 'id' },
    { field: 'title', flex: 1 },
    { field: 'price', flex: 1 },
    { field: 'category', flex: 1 },
    { field: 'brand', flex: 1 },
    {
      field: 'action',
      type: 'actions',
      getActions: (params: any) => [
        <GridActionsCellItem
          key={1}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => console.log(params)}
        />,
        <GridActionsCellItem
          key={2}
          sx={{ justifyContent: 'flex-end' }}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => console.log(params)}
          showInMenu
        />,
      ],
    },
  ]

  const onSortModelChange = (data: any) => {
    if (data.length) setSortParams(data[0])
    else setSortParams({ field: '', sort: '' })
  }

  const onFilterModelChange = (data: any) => {
    setSearchValue(data.quickFilterValues.join(''))
  }

  return (
    <div className="h-[700px]">
      <DataGrid
        rows={products}
        columns={columns}
        loading={true}
        sortingMode="server"
        onSortModelChange={onSortModelChange}
        filterMode="server"
        onFilterModelChange={onFilterModelChange}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCountState}
        pageSizeOptions={[10, 25, 50]}
        slots={{ toolbar: GridToolbar, pagination: CustomPagination }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
