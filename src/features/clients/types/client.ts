export interface Client {
  id: number
  name: string
  phone: string
  birthday: string | null
  address: string | null
  manager_id: number | null
  active: boolean
}

export interface ClientDetail extends Client {
  branch_id: number | null
  description: string | null
  avatar: string | null
}
