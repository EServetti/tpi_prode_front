import { api } from './api'
import { ENDPOINTS } from '../constants/constants'
import type { EstadoPartido, Game } from '../utils/types'

export interface ActualizarPartidoPayload {
  fechaInicio?: string;
  golesLocal?: number;
  golesVisitante?: number;
  estado?: EstadoPartido;
}

export const partidosService = {
  listar: async (): Promise<Game[]> => {
    const { data } = await api.get<Game[]>(ENDPOINTS.partidos.base)
    return data
  },

  actualizar : async (id: string, payload: ActualizarPartidoPayload) => {
    const { data } = await api.put<Game>(ENDPOINTS.partidos.byId(id), payload)
    return data
  }
}