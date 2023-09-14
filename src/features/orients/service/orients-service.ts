import {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
  http,
} from '@/shared/http'
import { Orient } from '../types/Orient'

export const OrientsService = {
  getOrients: async (params: {
    page: number
    perpage: number
    search: string
    sort: string
    orderby: string
    branch_id: number | null
  }) => {
    const { data } = await http<ResponseWithPagination<Orient[]>>(
      `api/orients`,
      {
        params,
      },
    )

    return data
  },

  getOrient: async (id: number) => {
    const { data } = await http<ResponseWithData<Orient>>(
      `api/orients/${id}/edit`,
    )

    return data
  },

  createOrient: async (body: { name: string; branch_id: string }) => {
    const { data } = await http.post<ResponseWithMessage>(`api/orients`, body)

    return data
  },

  updateOrient: async ({
    id,
    body,
  }: {
    id: number
    body: { name: string; branch_id: string }
  }) => {
    const { data } = await http.put<ResponseWithMessage>(
      `api/orients/${id}`,
      body,
    )

    return data
  },

  deleteOrient: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(`api/orients/${id}`)

    return data
  },

  getBranches: async () => {
    const { data } = await http<
      ResponseWithData<
        {
          id: number
          name: string
          parent_id: number
          parent_name: string | null
        }[]
      >
    >(`api/filter/branches`, {
      params: {
        tree: 0,
      },
    })

    return data
  },
}
