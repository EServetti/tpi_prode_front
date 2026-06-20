import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import { useAuthContext } from '../context/AuthContext'
import { sessionStorage } from '../utils/session'
import type { LoginCredentials, RegisterPayload, User } from '../utils/types'

const fetchSession = async (token: string): Promise<{ token: string; user: User }> => {
  // El token debe estar en la cookie antes de llamar a /auth/me
  // (el interceptor de axios lo agrega como Bearer en el header).
  sessionStorage.setToken(token)
  const user = await authService.me()
  return { token, user }
}

export const useAuth = () => {
  const auth = useAuthContext()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { token } = await authService.login(credentials)
      return fetchSession(token)
    },
    onSuccess: ({ token, user }) => {
      auth.setSession(token, user)
      router.push('/dashboard')
    },
    onError: () => {
      auth.clearSession()
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { token } = await authService.register(payload)
      return fetchSession(token)
    },
    onSuccess: ({ token, user }) => {
      auth.setSession(token, user)
      router.push('/dashboard')
    },
    onError: () => {
      auth.clearSession()
    },
  })

  const logout = () => {
    auth.clearSession()
    router.push('/login')
  }

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    loginStatus: loginMutation,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    registerStatus: registerMutation,
    logout,
  }
}

export const useCurrentUser = () => {
  const auth = useAuthContext()
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    enabled: () => auth.isAuthenticated.value,
  })
}
