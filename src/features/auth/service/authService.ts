import { ResponseWithData, http } from '@/shared/http'
import { User } from '../types/user'

export const AuthService = {
  login: async (body: { phone: string; password: string }) => {
    const { data } = await http.post<
      ResponseWithData<{ token: string; user: User }>
    >('api/auth/login', body)

    return data
  },

  logout: () => {
    return http.post('api/auth/logout')
  },
}
