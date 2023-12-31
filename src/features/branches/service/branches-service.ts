import {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
  http,
} from '@/shared/http'
import { Branch, BranchDetail } from '../types/branch'

export const BranchesService = {
  getBranches: async (params: {
    page: number
    perpage: number
    orderby: 'asc' | 'desc'
    sort: string
    search: string
  }) => {
    const { data } = await http<ResponseWithPagination<Branch[]>>(
      'api/branches',
      { params },
    )

    return data
  },

  getBranch: async (id: number) => {
    const { data } = await http<ResponseWithData<BranchDetail>>(
      `api/branches/${id}/edit`,
    )

    return data
  },

  createBranch: async (body: {
    name: string
    parent_id: string
    warehouse: boolean
  }) => {
    const { data } = await http.post<ResponseWithMessage>('/api/branches', body)

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
      `/api/branches/${id}`,
      body,
    )

    return data
  },

  deleteBranch: async (id: number) => {
    const { data } = await http.delete<ResponseWithMessage>(
      `api/branches/${id}`,
    )

    return data
  },
}
