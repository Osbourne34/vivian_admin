import { http, ResponseWithPagination } from '@/shared/http'
import { Employee } from '../types/employee'

export const EmployeesService = {
  createEmployees: (body: FormData) => {
    return http.post('/api/user/users', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getEmployees: async (
    page: number = 1,
    perpage: number = 10,
    orderby: string = '',
    sort: string | null = null,
  ) => {
    const { data } = await http<ResponseWithPagination<Employee[]>>(
      'api/user/users',
      {
        params: {
          page,
          perpage,
          sort,
          orderby,
        },
      },
    )
    return data
  },
}
