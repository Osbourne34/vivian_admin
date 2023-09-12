export interface Branch {
  id: number
  name: string
  warehouse: boolean
  childrens?: Branch[]
}

export interface BranchDetail {
  id: number
  parent_id: number
  name: string
  warehouse: boolean
}
