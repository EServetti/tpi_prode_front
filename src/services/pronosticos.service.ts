import { api } from './api'
import { ENDPOINTS } from '../constants/constants'
import type { Prediction } from '../utils/types'

export interface CrearPronosticoPayload {
  usuarioId: string
  partidoId: string
  grupoId: string
  golesLocal: number
  golesVisitante: number
}

export interface ActualizarPronosticoPayload {
  golesLocal: number
  golesVisitante: number
}

export const pronosticosService = {
  porUsuario: async (idUsuario: string): Promise<Prediction[]> => {
    const { data } = await api.get<Prediction[]>(ENDPOINTS.pronosticos.porUsuario(idUsuario))
    return data
  },

  crear: async (payload: CrearPronosticoPayload): Promise<Prediction> => {
    const { data } = await api.post<Prediction>(ENDPOINTS.pronosticos.base, payload)
    return data
  },

  actualizar: async (
    id: string,
    payload: ActualizarPronosticoPayload,
  ): Promise<Prediction> => {
    const { data } = await api.put<Prediction>(ENDPOINTS.pronosticos.byId(id), payload)
    return data
  },
}
