import {
  http,
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/http'
import { Employee } from '../types/employee'

export const EmployeesService = {
  createEmployee: async (body: FormData) => {
    const { data } = await http.post<ResponseWithMessage>(
      '/api/user/users',
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return data
  },

  getEmployees: async (params: {
    page: number
    perpage: number
    orderby: 'asc' | 'desc'
    sort: string
    search: string
    branch_id: string | null
    sortbyverified: string
    sortbyactivity: string
    role: string
    orient_id: string | null
    manager_id: string | null
  }) => {
    const { data } = await http<ResponseWithPagination<Employee[]>>(
      'api/user/users',
      { params },
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

  updateEmployee: async ({ id, body }: { id: number; body: FormData }) => {
    const { data } = await http.post<ResponseWithMessage>(
      `api/user/users/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return data
  },

  deleteEmployees: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(
      `api/user/users/${id}`,
    )

    return data
  },

  getRoles: async () => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/roles')

    return data
  },

  getOrients: async () => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/orients')

    return data
  },

  getManagers: async () => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('/api/filter/managers')

    return data
  },
}
