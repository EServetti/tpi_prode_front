<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import UserCard from '../components/UserCard.vue'
import EmptyState from '../components/EmptyState.vue'
import PredictionCard from '../components/forms/PredictionCard.vue'
import NewPredictionModal, {
  type NewPredictionPayload,
} from '../components/modals/NewPredictionModal.vue'
import {
  useGroupMembers,
  useKickMember,
  useUpdateGroup,
  useUserGroups,
} from '../hooks/useGroups'
import { useCreatePrediction, useUserPredictions } from '../hooks/usePredictions'
import { useAuthContext } from '../context/AuthContext'
import { getErrorMessage } from '../utils/error'
import type { Group, GroupUser } from '../utils/types'

const route = useRoute()
const router = useRouter()

const { user: currentUser } = useAuthContext()
const { groups: userGroups, isLoading: groupsLoading } = useUserGroups()

const groupId = computed(() => String(route.params.id))

const userGroup = computed(
  () => userGroups.value.find((g) => String(g.id) === groupId.value) ?? null,
)

const group = computed<Group | null>(() => userGroup.value)
const isCreator = computed(() => userGroup.value?.rol === 'CREADOR')

type Section = 'predictions' | 'ranking' | 'info'
const toggleSection = ref<Section>('ranking')

// Si el usuario está en "info" pero pierde el rol de creador, lo sacamos de esa pestaña
watch(isCreator, (creator) => {
  if (!creator && toggleSection.value === 'info') toggleSection.value = 'ranking'
})

const formImageUrl = ref('')
const formName = ref('')
const formCode = ref('')

// Cargar el formulario con los datos reales cuando llegan
watch(
  group,
  (g) => {
    if (!g) return
    formImageUrl.value = g.icono ?? ''
    formName.value = g.nombre ?? ''
    formCode.value = g.codigoInvitacion ?? ''
  },
  { immediate: true },
)

const updateGroupMutation = useUpdateGroup()

const updateGroupError = computed(() => {
  if (!updateGroupMutation.isError.value) return null
  return getErrorMessage(updateGroupMutation.error.value, 'No se pudo actualizar el grupo')
})

const onInfoSubmit = () => {
  if (!group.value) return
  updateGroupMutation.mutate({
    id: group.value.id,
    payload: {
      nombre: formName.value.trim(),
      icono: formImageUrl.value.trim(),
      codigoInvitacion: formCode.value.trim(),
    },
  })
}

const showNewPredictionModal = ref(false)
const toggleNewPredictionModal = () => {
  showNewPredictionModal.value = !showNewPredictionModal.value
}

const createPredictionMutation = useCreatePrediction()

const createPredictionError = computed(() => {
  if (!createPredictionMutation.isError.value) return null
  return getErrorMessage(
    createPredictionMutation.error.value,
    'No se pudo guardar el pronóstico',
  )
})

const onCreatePrediction = (payload: NewPredictionPayload) => {
  createPredictionMutation.mutate(
    {
      partidoId: payload.partido.id,
      grupoId: payload.grupoId,
      golesLocal: payload.golesLocal,
      golesVisitante: payload.golesVisitante,
    },
    {
      onSuccess: () => {
        showNewPredictionModal.value = false
        createPredictionMutation.reset()
      },
    },
  )
}

const { data: membersData, isLoading: membersLoading } = useGroupMembers(
  () => group.value?.id ?? null,
)

const members = computed<GroupUser[]>(() =>
  (membersData.value ?? []).map((m) => ({
    id: m.miembro.id,
    nombre: m.miembro.nombreUsuario,
    puntos: m.puntos,
    resultadosExactos: m.resultadosExactos,
  })),
)

const creatorId = computed(
  () =>
    membersData.value?.find((m) => m.rol === 'CREADOR')?.miembro.id ?? null,
)

const rankedUsers = computed(() => [...members.value].sort((a, b) => b.puntos - a.puntos))

// Reusa la cache de useUserPredictions (misma queryKey por userId). El hook se llama otra vez
// pero vue-query devuelve los datos cacheados al instante si ya se cargaron en el dashboard.
// TODO: cuando el backend asocie partidos a grupos/torneos, filtrar acá por ese vínculo.
const { predictions: userPredictions, isLoading: userPredictionsLoading } =
  useUserPredictions()

const goBack = () => router.replace({ name: 'dashboard' })

const kickMutation = useKickMember()

const onKickUser = (user: GroupUser) => {
  if (!group.value) return
  if (user.id === currentUser.value?.id) return
  const confirmed = window.confirm(`¿Expulsar a ${user.nombre} del grupo?`)
  if (!confirmed) return
  kickMutation.mutate({
    usuarioId: user.id,
    grupoId: group.value.id,
  })
}
</script>

<template>
  <ProtectedLayout>
    <section class="flex-1 flex flex-col">
      <header
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border-base"
      >
        <div>
          <h2 class="text-lg sm:text-xl !mb-0">
            {{ group?.nombre ?? (groupsLoading ? 'Cargando...' : 'Grupo') }}
          </h2>
          <p class="text-xs">{{ members.length }} participantes</p>
        </div>

        <div
          v-if="group"
          class="inline-flex w-full sm:w-auto bg-surface border border-border-base rounded-full p-1 gap-1"
        >
          <button
            type="button"
            class="flex-1 sm:flex-none !px-2 sm:!px-3 !py-1 sm:!py-1.5 !border-0 !rounded-full text-xs sm:text-sm transition-colors"
            :class="
              toggleSection === 'ranking'
                ? '!bg-primary !text-white'
                : '!bg-transparent !text-text-muted hover:!text-text'
            "
            @click="toggleSection = 'ranking'"
          >
            Ranking
          </button>
          <button
            type="button"
            class="flex-1 sm:flex-none !px-2 sm:!px-3 !py-1 sm:!py-1.5 !border-0 !rounded-full text-xs sm:text-sm transition-colors"
            :class="
              toggleSection === 'predictions'
                ? '!bg-primary !text-white'
                : '!bg-transparent !text-text-muted hover:!text-text'
            "
            @click="toggleSection = 'predictions'"
          >
            Mis pronósticos
          </button>
          <button
            v-if="isCreator"
            type="button"
            class="flex-1 sm:flex-none !px-2 sm:!px-3 !py-1 sm:!py-1.5 !border-0 !rounded-full text-xs sm:text-sm transition-colors"
            :class="
              toggleSection === 'info'
                ? '!bg-primary !text-white'
                : '!bg-transparent !text-text-muted hover:!text-text'
            "
            @click="toggleSection = 'info'"
          >
            Datos
          </button>
        </div>
      </header>

      <!-- loading -->
      <div
        v-if="groupsLoading && !group"
        class="flex-1 flex items-center justify-center text-sm text-text-muted"
      >
        Cargando grupo...
      </div>

      <!-- grupo no encontrado -->
      <div
        v-else-if="!group"
        class="flex-1 flex items-center justify-center"
      >
        <EmptyState
          title="Grupo no encontrado"
          description="No pertenecés a este grupo o ya no está disponible."
          cta-label="Volver al inicio"
          @cta="goBack"
        >
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </template>
        </EmptyState>
      </div>

      <!-- sección ranking -->
      <div v-else-if="toggleSection === 'ranking'" class="flex-1 p-6">
        <div
          v-if="membersLoading"
          class="flex-1 flex items-center justify-center text-sm text-text-muted"
        >
          Cargando participantes...
        </div>

        <div
          v-else-if="rankedUsers.length === 0"
          class="flex-1 flex items-center justify-center"
        >
          <EmptyState
            title="Todavía no hay participantes"
            description="Compartí el código de invitación para que se sumen al grupo."
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </template>
          </EmptyState>
        </div>

        <ul v-else class="flex flex-col gap-3 max-w-2xl mx-auto">
          <UserCard
            v-for="(user, idx) in rankedUsers"
            :key="user.id"
            :user="user"
            :position="idx + 1"
            :can-kick="isCreator && user.id !== currentUser?.id"
            :is-creator="String(user.id) === String(creatorId)"
            @kick="onKickUser"
          />
        </ul>
      </div>

      <!-- sección pronosticos -->
      <div v-else-if="toggleSection === 'predictions'" class="flex-1 flex flex-col">
        <div
          v-if="userPredictionsLoading"
          class="flex-1 flex items-center justify-center text-sm text-text-muted"
        >
          Cargando pronósticos...
        </div>

        <div
          v-else-if="userPredictions.length === 0"
          class="flex-1 flex items-center justify-center"
        >
          <EmptyState
            title="No tenés pronósticos en este grupo"
            description="Cargá tus pronósticos para los partidos de la fecha y sumá puntos."
            cta-label="Cargar un pronóstico"
            @cta="toggleNewPredictionModal"
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M9 14h6" />
                <path d="M9 18h6" />
              </svg>
            </template>
          </EmptyState>
        </div>

        <div v-else class="flex-1 flex flex-col">
          <div class="flex items-center justify-between px-6 pt-6 pb-3 gap-3">
            <p class="text-xs">
              {{ userPredictions.length }}
              {{
                userPredictions.length === 1
                  ? 'pronóstico cargado'
                  : 'pronósticos cargados'
              }}
            </p>
            <button
              type="button"
              class="!bg-primary hover:!bg-primary-hover !text-white !border-0 inline-flex items-center gap-2"
              @click="toggleNewPredictionModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Nuevo pronóstico
            </button>
          </div>

          <ul class="flex-1 px-6 pb-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <PredictionCard
              v-for="(prediction, idx) in userPredictions"
              :key="idx"
              :prediction="prediction"
            />
          </ul>
        </div>
      </div>

      <!-- sección datos del grupo (solo creador) -->
      <div
        v-else-if="toggleSection === 'info' && isCreator"
        class="flex-1 p-6"
      >
        <form
          class="flex flex-col gap-4 max-w-lg mx-auto !m-0 sm:!mx-auto"
          @submit.prevent="onInfoSubmit"
        >
          <div class="flex flex-col gap-1.5">
            <label class="text-sm !text-text font-medium">Imagen del grupo</label>
            <div class="flex items-center gap-4">
              <div
                class="size-16 rounded-xl overflow-hidden border border-border-base bg-surface shrink-0"
              >
                <img
                  v-if="formImageUrl"
                  :src="formImageUrl"
                  alt="Vista previa"
                  class="size-full object-cover"
                />
                <div
                  v-else
                  class="size-full flex items-center justify-center text-text-muted text-xs"
                >
                  Sin imagen
                </div>
              </div>
              <input
                v-model="formImageUrl"
                type="url"
                placeholder="https://..."
                class="flex-1"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="group-name" class="text-sm !text-text font-medium">Nombre</label>
            <input
              id="group-name"
              v-model="formName"
              type="text"
              placeholder="Nombre del grupo"
              required
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="group-code" class="text-sm !text-text font-medium">
              Código de invitación
            </label>
            <input
              id="group-code"
              v-model="formCode"
              type="text"
              placeholder="Ej: AMIGOS-2026"
              required
            />
            <p class="text-xs">
              Compartí este código para que otros usuarios se sumen al grupo.
            </p>
          </div>

          <div
            v-if="updateGroupMutation.isSuccess.value && !updateGroupMutation.isPending.value"
            class="text-xs text-green-600"
          >
            Cambios guardados correctamente.
          </div>
          <p v-if="updateGroupError" class="error">{{ updateGroupError }}</p>

          <div class="flex justify-end mt-2">
            <button
              type="submit"
              class="!bg-primary hover:!bg-primary-hover !text-white !border-0"
              :disabled="updateGroupMutation.isPending.value"
            >
              {{ updateGroupMutation.isPending.value ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <NewPredictionModal
      :show-modal="showNewPredictionModal"
      :toggle-modal="toggleNewPredictionModal"
      :groups="userGroup ? [userGroup] : []"
      :loading="createPredictionMutation.isPending.value"
      :error-message="createPredictionError"
      @submit="onCreatePrediction"
    />
  </ProtectedLayout>
</template>
