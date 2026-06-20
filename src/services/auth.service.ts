import { api } from './api'
import { ENDPOINTS } from '../constants/constants'
import type { LoginCredentials, RegisterPayload, User } from '../utils/types'

interface TokenResponse {
  token: string
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>(ENDPOINTS.auth.login, {
      email: credentials.email,
      password: credentials.password,
    })
    return data
  },

  register: async (payload: RegisterPayload): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>(ENDPOINTS.auth.register, {
      email: payload.email,
      password: payload.password,
      nombreUsuario: payload.name,
    })
    return data
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>(ENDPOINTS.auth.me)
    return data
  },
}
