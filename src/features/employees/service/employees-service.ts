import {
  http,
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { Employee } from '../types/employee'

export const EmployeesService = {
  createEmployees: (body: FormData) => {
    return http.post<ResponseWithMessage>('/api/user/users', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getEmployees: async (
    page: number = 1,
    perpage: number = 10,
    orderby: string | null = null,
    sort: string = '',
    search: string = '',
  ) => {
    const { data } = await http<ResponseWithPagination<Employee[]>>(
      'api/user/users',
      {
        params: {
          page,
          perpage,
          sort,
          orderby,
          search,
        },
      },
    )
    return data
  },

  getEmployee: async (id: number) => {
    const { data } = await http<
      ResponseWithData<{
        branch_id: null | number
        orient_id: null | number
        manager_id: null | number
        name: string
        phone: string
        birthday: string | null
        address: string | null
        description: string | null
        avatar: string | null
        roles: string[]
        active: boolean
      }>
    >(`api/user/users/${id}/edit`)

    return data
  },

  updateEmployee: async (id: number, body: FormData) => {
    return http.post(`api/user/users/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteEmployees: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(
      `api/user/users/${id}`,
    )

    return data
  },
}
