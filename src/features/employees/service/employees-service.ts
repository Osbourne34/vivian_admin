import { http } from '@/shared/http'
import { Dayjs } from 'dayjs'

export const EmployeesService = {
  createAdmin: (body: {
    name: string
    phone: string
    birthday: string | null | Dayjs
    address: string
    description: string
    password: string
    password_confirmation: string
    active: boolean
  }) => {
    return http.post('/api/user/admins', body)
  },
}
