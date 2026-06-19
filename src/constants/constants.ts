export const API_BASE_URL = 'https://mockapi.example.com/api'

export const MOCK_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  me: `${API_BASE_URL}/auth/me`,
  logout: `${API_BASE_URL}/auth/logout`,
  matches: `${API_BASE_URL}/matches`,
  predictions: `${API_BASE_URL}/predictions`,
  ranking: `${API_BASE_URL}/ranking`,
} as const

export const STORAGE_KEYS = {
  token: 'prode_token',
  user: 'prode_user',
} as const
