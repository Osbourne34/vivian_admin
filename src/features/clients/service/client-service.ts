import {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
  http,
} from '@/shared/http'
import { Client, ClientDetail } from '../types/client'

export const ClientsService = {
  getClients: async (params: {
    search: string
    sort: string
    orderby: 'asc' | 'desc'
    branch_id: number | null
    manager_id: number | null
    sortbyverified: string
    sortbyactivity: string
    page: number
    perpage: number
  }) => {
    const { data } = await http<ResponseWithPagination<Client[]>>(
      'api/clients',
      {
        params,
      },
    )

    return data
  },

  getClient: async (id: number) => {
    const { data } = await http<ResponseWithData<ClientDetail>>(
      `api/clients/${id}/edit`,
    )

    return data
  },

  createClient: async (body: FormData) => {
    const { data } = await http.post<ResponseWithMessage>('api/clients', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },

  updateClient: async ({ id, body }: { id: number; body: FormData }) => {
    const { data } = await http.post<ResponseWithMessage>(
      `api/clients/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return data
  },

  deleteClient: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(`api/clients/${id}`)

    return data
  },
}
