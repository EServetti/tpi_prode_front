import axios, { type AxiosError } from 'axios'

interface BackendErrorBody {
  message?: string
  error?: string
  detail?: string
  errors?: Array<{ message?: string; defaultMessage?: string }>
}

export const getErrorMessage = (error: unknown, fallback = 'Ocurrió un error inesperado'): string => {
  if (!error) return fallback

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendErrorBody | string>
    const data = axiosError.response?.data

    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object') {
      if (data.message) return data.message
      if (data.detail) return data.detail
      if (data.error) return data.error
      if (data.errors?.length) {
        const first = data.errors[0]
        const msg = first.message ?? first.defaultMessage
        if (msg) return msg
      }
    }

    const status = axiosError.response?.status
    if (status && status >= 500) return `Error del servidor (${status}). Intentá de nuevo más tarde.`
    if (status) return `${fallback} (${status})`
    if (axiosError.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor.'
  }

  if (error instanceof Error && error.message) return error.message
  return fallback
}
