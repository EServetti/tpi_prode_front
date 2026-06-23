import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  gruposService,
  type ActualizarGrupoPayload,
  type CrearGrupoPayload,
  type ExpulsarPayload,
  type IngresarPayload,
} from '../services/grupos.service'
import { useAuthContext } from '../context/AuthContext'

export const useUserGroups = () => {
  const { user, isAuthenticated } = useAuthContext()
  const userId = computed(() => user.value?.id ?? null)

  const query = useQuery({
    queryKey: ['groups', 'byUser', userId],
    queryFn: () => gruposService.porUsuario(userId.value!),
    enabled: () => isAuthenticated.value && !!userId.value,
  })

  const groups = computed(() => query.data.value ?? [])

  const createdGroups = computed(() => groups.value.filter((g) => g.rol === 'CREADOR'))

  return {
    ...query,
    groups,
    createdGroups,
  }
}

export const useGroupMembers = (grupoId: () => string | null) => {
  return useQuery({
    queryKey: ['groups', grupoId, 'members'],
    queryFn: () => gruposService.miembros(grupoId()!),
    enabled: () => !!grupoId(),
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (payload: CrearGrupoPayload) => gruposService.crear(payload),
    onSuccess: () => {
      const userId = user.value?.id
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['groups', 'byUser', userId] })
      }
    },
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarGrupoPayload }) =>
      gruposService.actualizar(id, payload),
    onSuccess: () => {
      const userId = user.value?.id
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['groups', 'byUser', userId] })
      }
    },
  })
}

export const useJoinGroup = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (payload: Omit<IngresarPayload, 'usuarioId'>) =>
      gruposService.ingresar({
        ...payload,
        usuarioId: user.value!.id,
      }),
    onSuccess: () => {
      const userId = user.value?.id
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['groups', 'byUser', userId] })
      }
    },
  })
}

export const useKickMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExpulsarPayload) => gruposService.expulsar(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['groups', variables.grupoId, 'members'],
      })
    },
  })
}
