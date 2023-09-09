import { Dayjs } from "dayjs"

export interface Employee {
  id: number
  name: string
  phone: string
  birthday: string | null
  address: string | null
  active: boolean
}

export interface EmployeeEdit extends Employee {
  branch_id: number | null
  description: string | null
  avatar: string | null
  roles: string[]
}

export interface FormInputs {
  name: string
  phone: string
  birthday: Dayjs | null
  address: string
  description: string
  password: string
  password_confirmation: string
  active: boolean
  branch_id: string
  roles: string[]
  avatar: File | null
}
