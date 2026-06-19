import type { AuthResponse, LoginCredentials, RegisterPayload, User } from '../utils/types'

const mockUser: User = {
  id: '1',
  email: 'demo@prode.com',
  name: 'Demo User',
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(500)
    if (!credentials.email || !credentials.password) {
      throw new Error('Credenciales inválidas')
    }
    return { token: 'mock-jwt-token', user: { ...mockUser, email: credentials.email } }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    await delay(500)
    return {
      token: 'mock-jwt-token',
      user: { id: '1', email: payload.email, name: payload.name },
    }
  },

  me: async (): Promise<User> => {
    await delay(300)
    return mockUser
  },

  logout: async (): Promise<void> => {
    await delay(200)
  },
}
