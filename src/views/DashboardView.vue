<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import PredictionCard from '../components/forms/PredictionCard.vue'
import NewGroupModal from '../components/modals/NewGroupModal.vue'
import JoinGroupModal from '../components/modals/JoinGroupModal.vue'
import NewPredictionModal, {
  type NewPredictionPayload,
} from '../components/modals/NewPredictionModal.vue'
import { useCreateGroup, useJoinGroup, useUserGroups } from '../hooks/useGroups'
import { useCreatePrediction, useUserPredictions } from '../hooks/usePredictions'
import type { NewGroupPayload } from '../components/forms/NewGroup.vue'
import type { JoinGroupPayload } from '../components/forms/JoinGroup.vue'
import { getErrorMessage } from '../utils/error'

const { groups, createdGroups, isLoading: groupsLoading } = useUserGroups()

const MAX_CREATED_GROUPS = 3
const canCreateMoreGroups = computed(() => createdGroups.value.length < MAX_CREATED_GROUPS)

const showNewGroupModal = ref(false)
const toggleNewGroupModal = () => {
  showNewGroupModal.value = !showNewGroupModal.value
}

const createGroupMutation = useCreateGroup()

const createGroupError = computed(() => {
  if (!createGroupMutation.isError.value) return null
  return getErrorMessage(createGroupMutation.error.value, 'No se pudo crear el grupo')
})

const onCreateGroup = (payload: NewGroupPayload) => {
  createGroupMutation.mutate(payload, {
    onSuccess: () => {
      showNewGroupModal.value = false
      createGroupMutation.reset()
    },
  })
}

const showJoinGroupModal = ref(false)
const toggleJoinGroupModal = () => {
  showJoinGroupModal.value = !showJoinGroupModal.value
}

const joinGroupMutation = useJoinGroup()

const joinGroupError = computed(() => {
  if (!joinGroupMutation.isError.value) return null
  return getErrorMessage(
    joinGroupMutation.error.value,
    'No se pudo ingresar al grupo. Verificá el código.',
  )
})

const onJoinGroup = (payload: JoinGroupPayload) => {
  joinGroupMutation.mutate(payload, {
    onSuccess: () => {
      showJoinGroupModal.value = false
      joinGroupMutation.reset()
    },
  })
}

const { predictions, isLoading: predictionsLoading } = useUserPredictions()

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

const selectedGroupId = ref<string | null>(null)

const selectedGroup = computed(() =>
  selectedGroupId.value
    ? groups.value.find((g) => String(g.id) === String(selectedGroupId.value)) ?? null
    : null,
)

const filteredPredictions = computed(() => {
  if (selectedGroupId.value === null) return predictions.value
  return predictions.value.filter(
    (p) => String(p.grupo.id) === String(selectedGroupId.value),
  )
})

const selectedLabel = computed(() => selectedGroup.value?.nombre ?? 'Todos los grupos')

const onSelectGroup = (id: string | null) => {
  selectedGroupId.value = id
}
</script>

<template>
  <ProtectedLayout>
    <div class="flex-1 flex flex-col lg:flex-row">
      <!-- sección mis pronósticos -->
      <section class="w-full lg:flex-3 flex flex-col">
        <!-- header -->
        <header
          class="flex items-center justify-between px-6 py-5 border-b border-border-base"
        >
          <div>
            <h2 class="text-xl !mb-0">Mis pronósticos</h2>
            <p class="text-xs">
              {{ predictions.length }}
              {{ predictions.length === 1 ? 'pronóstico cargado' : 'pronósticos cargados' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <!-- filtro de grupo -->
            <div class="hs-dropdown relative inline-flex">
              <button
                id="group-filter-btn"
                type="button"
                class="hs-dropdown-toggle !bg-bg !text-text border border-border-base hover:!border-primary inline-flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Filtrar por grupo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M7 12h10" />
                  <path d="M10 18h4" />
                </svg>
                <span class="truncate max-w-40">{{ selectedLabel }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                class="hs-dropdown-menu hs-dropdown-open:opacity-100 transition-[opacity,margin] duration-200 opacity-0 hidden min-w-56 bg-surface border border-border-base shadow-md rounded-lg p-2 absolute right-0 top-full mt-2 z-50"
                role="menu"
                aria-labelledby="group-filter-btn"
              >
                <button
                  type="button"
                  class="w-full text-left !bg-transparent !border-0 rounded-md px-3 py-2 hover:!bg-bg flex items-center justify-between gap-2"
                  :class="selectedGroupId === null ? '!text-primary' : '!text-text'"
                  @click="onSelectGroup(null)"
                >
                  <span>Todos los grupos</span>
                  <svg
                    v-if="selectedGroupId === null"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </button>
                <p
                  v-if="groups.length === 0"
                  class="px-3 py-2 text-xs text-text-muted"
                >
                  No tenés grupos todavía.
                </p>
                <button
                  v-for="option in groups"
                  :key="option.id"
                  type="button"
                  class="w-full text-left !bg-transparent !border-0 rounded-md px-3 py-2 hover:!bg-bg flex items-center justify-between gap-2"
                  :class="String(selectedGroupId) === String(option.id) ? '!text-primary' : '!text-text'"
                  @click="onSelectGroup(String(option.id))"
                >
                  <span class="inline-flex items-center gap-2 min-w-0">
                    <img
                      :src="option.icono"
                      :alt="option.nombre"
                      class="size-5 rounded-full object-cover shrink-0"
                    />
                    <span class="truncate">{{ option.nombre }}</span>
                  </span>
                  <svg
                    v-if="String(selectedGroupId) === String(option.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </button>
              </div>
            </div>

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
        </header>

        <div
          v-if="predictionsLoading"
          class="flex-1 flex items-center justify-center text-sm text-text-muted"
        >
          Cargando pronósticos...
        </div>

        <div
          v-else-if="filteredPredictions.length === 0"
          class="flex-1 flex items-center justify-center"
        >
          <EmptyState
            title="Todavía no cargaste pronósticos"
            description="Pronosticá el resultado de los próximos partidos para sumar puntos en tus grupos."
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

        <ul v-else class="flex-1 p-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PredictionCard v-for="(prediction, idx) in filteredPredictions" 
          :key="idx"
          :prediction="prediction"
          />
        </ul>
      </section>

      <!-- sección "mis grupos" -->
      <aside
        class="w-full bg-surface border-t border-border-base lg:border-t-0 lg:border-l lg:flex-1 flex flex-col"
      >
        <header
          class="flex items-center justify-between px-5 py-4 border-b border-border-base"
        >
          <div>
            <h2 class="text-lg !mb-0">Mis grupos</h2>
            <p class="text-xs">{{ groups.length }} grupos activos</p>
          </div>
          <button
            type="button"
            class="!p-2 !bg-primary !border-0 size-9 rounded-full text-white flex items-center justify-center hover:!bg-primary-hover disabled:!opacity-40 disabled:cursor-not-allowed disabled:hover:!bg-primary"
            :aria-label="canCreateMoreGroups ? 'Crear grupo' : 'Límite de grupos creados alcanzado'"
            :title="canCreateMoreGroups ? 'Crear grupo' : `Ya creaste ${MAX_CREATED_GROUPS} grupos (máximo permitido)`"
            :disabled="!canCreateMoreGroups"
            @click="toggleNewGroupModal"
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
          </button>
        </header>

        <div
          v-if="groupsLoading"
          class="flex-1 flex items-center justify-center text-sm text-text-muted"
        >
          Cargando grupos...
        </div>

        <div v-else-if="groups.length === 0" class="flex-1 flex items-center justify-center">
          <EmptyState
            title="Aún no estás en ningún grupo"
            description="Creá un grupo o unite a uno existente para competir con tus amigos."
            cta-label="Crear grupo"
            @cta="toggleNewGroupModal"
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

        <ul v-else class="flex-1 p-3 flex flex-col gap-2">
          <router-link
            :to="{ name: 'group', params: { id: group.id } }"
            v-for="group in groups"
            :key="group.nombre"
            class="bg-bg border border-border-base rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors"
          >
            <img
              :src="group.icono"
              :alt="group.nombre"
              class="size-12 rounded-lg object-cover shrink-0 bg-surface"
            />

            <span class="flex-1 min-w-0">
              <p class="!text-text font-medium truncate">{{ group.nombre }}</p>
              <p class="text-xs flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3"
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
                {{ group.cantidadParticipantes ?? 0 }}
                {{ group.cantidadParticipantes === 1 ? 'participante' : 'participantes' }}
              </p>
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 text-text-muted shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </router-link>
        </ul>

        <footer class="px-5 py-3 border-t border-border-base flex flex-col gap-2">
          <button
            type="button"
            class="w-full !bg-transparent !text-primary border border-border-base hover:!bg-bg"
            @click="toggleJoinGroupModal"
          >
            Unirse a un grupo
          </button>
        </footer>
      </aside>
    </div>

    <NewGroupModal
      :show-modal="showNewGroupModal"
      :toggle-modal="toggleNewGroupModal"
      :loading="createGroupMutation.isPending.value"
      :error-message="createGroupError"
      @submit="onCreateGroup"
    />

    <JoinGroupModal
      :show-modal="showJoinGroupModal"
      :toggle-modal="toggleJoinGroupModal"
      :loading="joinGroupMutation.isPending.value"
      :error-message="joinGroupError"
      @submit="onJoinGroup"
    />

    <NewPredictionModal
      :show-modal="showNewPredictionModal"
      :toggle-modal="toggleNewPredictionModal"
      :groups="groups"
      :loading="createPredictionMutation.isPending.value"
      :error-message="createPredictionError"
      @submit="onCreatePrediction"
    />
  </ProtectedLayout>
</template>
