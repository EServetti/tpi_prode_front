import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  pronosticosService,
  type ActualizarPronosticoPayload,
  type CrearPronosticoPayload,
} from '../services/pronosticos.service'
import { useAuthContext } from '../context/AuthContext'

const userPredictionsKey = (userId: string) => ['predictions', 'byUser', userId] as const

export const useUserPredictions = () => {
  const { user, isAuthenticated } = useAuthContext()
  const userId = computed(() => user.value?.id ?? null)

  const query = useQuery({
    queryKey: ['predictions', 'byUser', userId],
    queryFn: () => pronosticosService.porUsuario(userId.value!),
    enabled: () => isAuthenticated.value && !!userId.value,
  })

  const predictions = computed(() => query.data.value ?? [])

  return {
    ...query,
    predictions,
  }
}

export const useCreatePrediction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (payload: Omit<CrearPronosticoPayload, 'usuarioId'>) =>
      pronosticosService.crear({
        ...payload,
        usuarioId: user.value!.id,
      }),
    onSuccess: () => {
      const userId = user.value?.id
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userPredictionsKey(userId) })
      }
    },
  })
}

export const useUpdatePrediction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ActualizarPronosticoPayload
    }) => pronosticosService.actualizar(id, payload),
    onSuccess: () => {
      const userId = user.value?.id
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userPredictionsKey(userId) })
      }
    },
  })
}
