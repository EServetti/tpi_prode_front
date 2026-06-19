import { inject, provide, ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import type { User } from '../utils/types'
import { sessionStorage } from '../utils/session'

export interface AuthContext {
  user: Ref<User | null>
  token: Ref<string | null>
  isAuthenticated: ComputedRef<boolean>
  setSession: (token: string, user: User) => void
  clearSession: () => void
}

export const AuthKey: InjectionKey<AuthContext> = Symbol('AuthContext')

export const createAuthContext = (): AuthContext => {
  const user = ref<User | null>(sessionStorage.getUser())
  const token = ref<string | null>(sessionStorage.getToken())
  const isAuthenticated = computed(() => !!token.value)

  const setSession = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    sessionStorage.setSession(newToken, newUser)
  }

  const clearSession = () => {
    token.value = null
    user.value = null
    sessionStorage.clearSession()
  }

  return { user, token, isAuthenticated, setSession, clearSession }
}

export const provideAuth = (): AuthContext => {
  const ctx = createAuthContext()
  provide(AuthKey, ctx)
  return ctx
}

export const useAuthContext = (): AuthContext => {
  const ctx = inject(AuthKey)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
