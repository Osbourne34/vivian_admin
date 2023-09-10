import { Dayjs } from 'dayjs'

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

export const initialData = {
  active: true,
  address: '',
  birthday: null,
  description: '',
  name: '',
  password: '',
  password_confirmation: '',
  phone: '',
  roles: [],
  branch_id: '',
  avatar: null,
}
