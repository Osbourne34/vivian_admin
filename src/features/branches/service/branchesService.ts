import {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
  http,
} from '@/shared/http'
import { Branch } from '../types/Branch'

export const BranchesService = {
  getBranches: async (params: {
    page: number
    perpage: number
    orderby: 'asc' | 'desc'
    sort: string
    search: string
  }) => {
    const { data } = await http<ResponseWithPagination<Branch[]>>(
      'api/zones/branches',
      { params },
    )

    return data
  },

  getBranch: async (id: number) => {
    const { data } = await http<ResponseWithData<Branch>>(
      `api/zones/branches/${id}/edit`,
    )

    return data
  },

  createBranch: async (body: {
    name: string
    parent_id: string
    warehouse: boolean
  }) => {
    const { data } = await http.post<ResponseWithMessage>(
      '/api/zones/branches',
      body,
    )

    return data
  },

  updateBranch: async ({
    body,
    id,
  }: {
    body: {
      name: string
      parent_id: string
      warehouse: boolean
    }
    id: number
  }) => {
    const { data } = await http.put<ResponseWithMessage>(
      `/api/zones/branches/${id}`,
      body,
    )
    return data
  },

  deleteBranch: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(
      `api/zones/branches/${id}`,
    )

    return data
  },
}
