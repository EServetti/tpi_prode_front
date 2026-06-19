import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import { useAuthContext } from '../context/AuthContext'
import type { LoginCredentials, RegisterPayload } from '../utils/types'

export const useAuth = () => {
  const auth = useAuthContext()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: ({ token, user }) => {
      auth.setSession(token, user)
      router.push('/dashboard')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ token, user }) => {
      auth.setSession(token, user)
      router.push('/dashboard')
    },
  })

  const logout = async () => {
    await authService.logout()
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
