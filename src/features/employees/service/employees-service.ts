import { http } from '@/shared/http'
import { Dayjs } from 'dayjs'

export const EmployeesService = {
  createEmployees: (body: FormData) => {
    return http.post('/api/user/users', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
