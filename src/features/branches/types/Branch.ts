export interface Branch {
  id: number
  name: string
  warehouse: boolean
  childrens?: Branch[]
  parent_id: number
}
