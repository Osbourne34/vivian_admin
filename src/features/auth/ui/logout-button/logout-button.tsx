import { MenuItem, Typography } from '@mui/material'
import { AuthService } from '../../service/auth-service'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

interface LogoutButtonProps {
  onClick: () => void
}

export const LogoutButton = (props: LogoutButtonProps) => {
  const router = useRouter()
  const { onClick } = props

  const logout = async () => {
    onClick()

    try {
      await AuthService.logout()
    } catch (error) {
      console.log('error', error)
    } finally {
      Cookies.remove('token', {
        path: '/',
      })
      router.push('/login')
    }
  }
  return (
    <MenuItem onClick={logout}>
      <Typography textAlign="center">Выйти</Typography>
    </MenuItem>
  )
}
