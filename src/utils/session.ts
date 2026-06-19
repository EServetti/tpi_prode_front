import Cookies from 'js-cookie'
import { STORAGE_KEYS } from '../constants/constants'
import type { User } from './types'

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'lax',
  secure: window.location.protocol === 'https:',
}

export const sessionStorage = {
  getToken: (): string | null => Cookies.get(STORAGE_KEYS.token) ?? null,

  getUser: (): User | null => {
    const raw = Cookies.get(STORAGE_KEYS.user)
    return raw ? (JSON.parse(raw) as User) : null
  },

  setSession: (token: string, user: User): void => {
    Cookies.set(STORAGE_KEYS.token, token, COOKIE_OPTIONS)
    Cookies.set(STORAGE_KEYS.user, JSON.stringify(user), COOKIE_OPTIONS)
  },

  clearSession: (): void => {
    Cookies.remove(STORAGE_KEYS.token)
    Cookies.remove(STORAGE_KEYS.user)
  },
}
