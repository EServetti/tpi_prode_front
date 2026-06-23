import { api } from './api'
import { ENDPOINTS } from '../constants/constants'
import type { Game } from '../utils/types'

export const partidosService = {
  listar: async (): Promise<Game[]> => {
    const { data } = await api.get<Game[]>(ENDPOINTS.partidos.base)
    return data
  },
}
