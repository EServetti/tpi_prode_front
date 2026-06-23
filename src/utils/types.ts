export interface User {
  id: string
  email: string
  nombreUsuario: string
  rol: "USUARIO" | "ADMIN"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Team {
  id: string
  nombre: string
  escudo: string
}

export type EstadoPartido = 'POR_JUGARSE' | 'EN_JUEGO' | 'FINALIZADO' | 'SUSPENDIDO'
export type EstadoFecha = 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA'
export type Tendencia = 'LOCAL' | 'EMPATE' | 'VISITANTE'

export interface Fecha {
  id: string
  estadoFecha: EstadoFecha
}

export interface Group {
  id: string
  nombre: string
  icono: string
  codigoInvitacion?: string
  cantidadParticipantes?: number
}

// Grupo tal como lo devuelve /grupos/usuario/{id}: incluye el rol del usuario actual.
export interface UserGroup extends Group {
  rol: RolMiembro
}

export type RolMiembro = 'USUARIO' | 'CREADOR'
export type EstadoInvitacion = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'

export interface MiembroGrupo {
  id: string
  miembro: User
  grupo: Group
  codigoInvitacion: string
  rol: RolMiembro
  estado: EstadoInvitacion
  puntos: number
  resultadosExactos: number
}

export interface Game {
  id: string
  fechaInicio: string
  golesLocal: number
  golesVisitante: number
  estado: EstadoPartido
  tendencia: Tendencia
  fecha: Fecha
  equipoLocal: Team
  equipoVisitante: Team
}

export interface Prediction {
  id: string
  golesLocal: number
  golesVisitante: number
  fechaPronostico: string
  puntosObtenidos: number
  partido: Game
  grupo: Group
}

export interface GroupUser {
  id: string
  nombre: string
  puntos: number
  resultadosExactos: number
  avatar?: string
}
