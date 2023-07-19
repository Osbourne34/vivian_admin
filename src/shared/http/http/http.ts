import axios from 'axios'
import Cookies from 'js-cookie'

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${Cookies.get('token')}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    if (error.response) {
      // Ошибка авторизаций
      if (error.response.status === 401) {
        Cookies.remove('token')
        return Promise.reject({
          message: error.response.data.message,
          status: error.response.status,
        })
      }

      // Ошибка от backend-а
      return Promise.reject(error.response.data)
    }
    // Остальные ошибки
    return Promise.reject({ message: error.message, status: false })
  }
)
