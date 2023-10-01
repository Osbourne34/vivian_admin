export interface User {
  id: number
  name: string
  phone: string
  phone_verified_at: string
  avatar: string | null
  verification: boolean
  roles: string[]
  permissions: string[]
  created_at: string
}
