export interface Column {
  key: string
  title?: string
  sortable?: boolean
  component?: (item: any) => JSX.Element
  width?: number
  align?: 'center' | 'right' | 'left'
  boolean?: boolean
}

type OrderBy = 'asc' | 'desc'

export type Sort = {
  sort: string
  orderby: OrderBy
}
