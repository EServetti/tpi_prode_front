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
  nombre: string
  escudo: string
}

export interface Group {
  id: string
  nombre: string
  icono: string
}

export interface Game {
  id: string
  golesLocal: number
  golesVisitante: number
  equipoLocal: Team
  equipoVisitante: Team
  fecha: number
  fechaPartido: number
}

export interface Prediction {
  prediccionGolesLocal: number
  prediccionGolesVisitante: number
  grupo: Group
  partido: Game
}

export interface GroupUser {
  id: string
  nombre: string
  puntos: number
  resultadosExactos: number
  avatar?: string
}
