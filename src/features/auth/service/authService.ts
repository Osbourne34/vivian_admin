import { ResponseWithData, http } from '@/shared/http'
import { User } from '../types/User'

export const AuthService = {
  login: async (body: { phone: string; password: string }) => {
    const { data } = await http.post<
      ResponseWithData<{ token: string; user: User }>
    >('/api/auth/login', body)

    return data
  },

  logout: async () => {
    return http.post('/api/auth/logout')
  },
}
