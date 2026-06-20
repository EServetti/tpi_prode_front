export const API_BASE_URL = '/api'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  matches: '/matches',
  predictions: '/predictions',
  ranking: '/ranking',
} as const

export const STORAGE_KEYS = {
  token: 'prode_token',
  user: 'prode_user',
} as const
