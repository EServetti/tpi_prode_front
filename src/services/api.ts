import axios from 'axios'
import { API_BASE_URL, ENDPOINTS } from '../constants/constants'
import { sessionStorage } from '../utils/session'
import { router } from '../router'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const AUTH_PATHS = [ENDPOINTS.auth.login, ENDPOINTS.auth.register] as string[]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clearSession()
      const requestedPath = error.config?.url ?? ''
      const isAuthRequest = AUTH_PATHS.some((path) => requestedPath.includes(path))
      if (!isAuthRequest && router.currentRoute.value.name !== 'login') {
        router.replace({ name: 'login' })
      }
    }
    return Promise.reject(error)
  },
)
