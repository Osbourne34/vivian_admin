import { ResponseWithData, http } from '@/shared/http'

export const Filters = {
  getBranches: async () => {
    const { data } = await http<
      ResponseWithData<
        {
          id: number
          name: string
          parent_id: number
          parent_name: string | null
          warehouse: boolean
        }[]
      >
    >('api/filter/branches', {
      params: {
        tree: 0,
      },
    })

    return data
  },

  getBranchesTree: async () => {
    const { data } = await http<
      ResponseWithData<
        {
          id: number
          name: string
          parent_id: number
          warehouse: boolean
          childrens: { id: number; name: string; parent_id: number }[]
        }[]
      >
    >('api/filter/branches', {
      params: {
        tree: 1,
      },
    })

    return data
  },

  getRoles: async (withOutRole: string) => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/roles', {
      params: {
        withOutRole,
      },
    })

    return data
  },

  getOrients: async (branch_id?: number) => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/orients', {
      params: {
        branch_id,
      },
    })

    return data
  },

  getManagers: async () => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/managers')

    return data
  },

  getPermissions: async () => {
    const { data } = await http<
      ResponseWithData<{ id: number; name: string }[]>
    >('api/filter/permissions')

    return data
  },
}
