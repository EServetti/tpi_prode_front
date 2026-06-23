export const API_BASE_URL = '/api'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  grupos: {
    base: '/grupos',
    byId: (id: string) => `/grupos/${id}`,
    miembros: (id: string) => `/grupos/${id}/miembros`,
    ingresar: '/grupos/ingresar',
    expulsar: '/grupos/expulsar',
    porUsuario: (idUsuario: string) => `/grupos/usuario/${idUsuario}`,
  },
  partidos: {
    base: '/partidos',
    byId: (id: string) => `/partidos/${id}`,
  },
  pronosticos: {
    base: '/pronosticos',
    byId: (id: string) => `/pronosticos/${id}`,
    porUsuario: (idUsuario: string) => `/pronosticos/usuario/${idUsuario}`,
  },
  ranking: '/ranking',
} as const

export const STORAGE_KEYS = {
  token: 'prode_token',
  user: 'prode_user',
} as const
