import { Dayjs } from 'dayjs'

export type FormInputs = {
  name: string
  phone: string
  birthday: Dayjs | null
  address: string
  description: string
  password: string
  password_confirmation: string
  active: boolean
  branch_id: string
  manager_id: string
  avatar: File | null
}

export const initialData: FormInputs = {
  name: '',
  phone: '',
  birthday: null,
  address: '',
  description: '',
  password: '',
  password_confirmation: '',
  active: true,
  branch_id: '',
  manager_id: '',
  avatar: null,
}
