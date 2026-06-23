import { api } from './api'
import { ENDPOINTS } from '../constants/constants'
import type { Group, MiembroGrupo, UserGroup } from '../utils/types'

export interface CrearGrupoPayload {
  nombre: string
  icono: string
  codigoInvitacion: string
}

export interface ActualizarGrupoPayload {
  nombre: string
  icono: string
  codigoInvitacion: string
}

export interface ExpulsarPayload {
  usuarioId: string
  grupoId: string
}

export interface IngresarPayload {
  usuarioId: string
  codigoInvitacion: string
}

export const gruposService = {
  porUsuario: async (idUsuario: string): Promise<UserGroup[]> => {
    const { data } = await api.get<UserGroup[]>(ENDPOINTS.grupos.porUsuario(idUsuario))
    return data
  },

  crear: async (payload: CrearGrupoPayload): Promise<Group> => {
    const { data } = await api.post<Group>(ENDPOINTS.grupos.base, payload)
    return data
  },

  actualizar: async (id: string, payload: ActualizarGrupoPayload): Promise<Group> => {
    const { data } = await api.put<Group>(ENDPOINTS.grupos.byId(id), payload)
    return data
  },

  expulsar: async (payload: ExpulsarPayload): Promise<MiembroGrupo> => {
    const { data } = await api.put<MiembroGrupo>(ENDPOINTS.grupos.expulsar, payload)
    return data
  },

  ingresar: async (payload: IngresarPayload): Promise<MiembroGrupo> => {
    const { data } = await api.post<MiembroGrupo>(ENDPOINTS.grupos.ingresar, payload)
    return data
  },

  miembros: async (id: string): Promise<MiembroGrupo[]> => {
    const { data } = await api.get<MiembroGrupo[]>(ENDPOINTS.grupos.miembros(id))
    return data
  },
}
