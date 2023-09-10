export interface Employee {
  id: number
  name: string
  phone: string
  birthday: string | null
  address: string | null
  active: boolean
}

export interface EmployeeDetail extends Employee {
  branch_id: number | null
  description: string | null
  avatar: string | null
  roles: string[]
}
