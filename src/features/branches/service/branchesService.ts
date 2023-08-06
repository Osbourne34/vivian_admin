import {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
  http,
} from '@/shared/http'
import { Branch } from '../types/Branch'

export const BranchesService = {
  getBranches: async (
    page: number = 1,
    perpage: number = 10,
    orderby: string | null = null,
    sort: string = '',
    search: string = '',
  ) => {
    const { data } = await http<ResponseWithPagination<Branch[]>>(
      'api/zones/branches',
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

  getBranch: async (id: number) => {
    const { data } = await http<ResponseWithData<Branch>>(
      `api/zones/branches/${id}/edit`,
    )

    return data
  },

  createBranch: (body: {
    name: string
    parent_id: string
    warehouse: boolean
  }) => {
    return http.post<ResponseWithMessage>('/api/zones/branches', body)
  },

  updateBranch: (
    body: {
      name: string
      parent_id: string
      warehouse: boolean
    },
    id: number,
  ) => {
    return http.put<ResponseWithMessage>(`/api/zones/branches/${id}`, body)
  },

  deleteBranch: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(
      `api/zones/branches/${id}`,
    )

    return data
  },
}
