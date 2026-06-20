<script setup lang="ts">
import { computed, ref } from 'vue'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import UserCard from '../components/UserCard.vue'
import EmptyState from '../components/EmptyState.vue'
import PredictionCard from '../components/forms/PredictionCard.vue'
import NewPredictionModal from '../components/modals/NewPredictionModal.vue'
import { MOCK_PREDICTIONS } from '../constants/app-data'
import type { Group, GroupUser } from '../utils/types'

const toggleSection = ref<'predictions' | 'ranking' | 'info'>('ranking')

const group: Group = {
  id: '1',
  nombre: 'Grupo amigos',
  icono:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3pdU5JXffFVf_PIsSusNpga_ZMi1Rgux8MO251d-rg&s=10',
}
const groupName = group.nombre

const formImageUrl = ref(group.icono)
const formName = ref(group.nombre)
const formCode = ref('AMIGOS-2026')

const onInfoSubmit = () => {
  // TODO: enviar al backend cuando esté disponible
}

const showNewPredictionModal = ref(false)
const toggleNewPredictionModal = () => {
  showNewPredictionModal.value = !showNewPredictionModal.value
}

const MOCK_USERS: GroupUser[] = [
  { id: '1', nombre: 'Lucía Fernández', puntos: 248, resultadosExactos: 12 },
  { id: '2', nombre: 'Mateo Gómez', puntos: 221, resultadosExactos: 9 },
  { id: '3', nombre: 'Sofía Martínez', puntos: 198, resultadosExactos: 8 },
  { id: '4', nombre: 'Juan Pérez', puntos: 175, resultadosExactos: 6 },
  { id: '5', nombre: 'Camila Rodríguez', puntos: 142, resultadosExactos: 5 },
  { id: '6', nombre: 'Tomás López', puntos: 118, resultadosExactos: 3 },
  { id: '7', nombre: 'Valentina Díaz', puntos: 97, resultadosExactos: 2 },
]

const rankedUsers = computed(() =>
  [...MOCK_USERS].sort((a, b) => b.puntos - a.puntos),
)

const userPredictions = computed(() =>
  MOCK_PREDICTIONS.filter((p) => p.grupo.nombre === groupName),
)
</script>

<template>
  <ProtectedLayout>
    <section class="flex-1 flex flex-col">
      <header
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border-base"
      >
        <div>
          <h2 class="text-lg sm:text-xl !mb-0">{{ groupName }}</h2>
          <p class="text-xs">{{ MOCK_USERS.length }} participantes</p>
        </div>

        <div
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

      <!-- sección ranking -->
      <div v-if="toggleSection === 'ranking'" class="flex-1 p-6">
        <ul class="flex flex-col gap-3 max-w-2xl mx-auto">
          <UserCard
            v-for="(user, idx) in rankedUsers"
            :key="user.id"
            :user="user"
            :position="idx + 1"
          />
        </ul>
      </div>

      <!-- sección pronosticos -->
      <div v-else-if="toggleSection === 'predictions'" class="flex-1 flex flex-col">
        <div
          v-if="userPredictions.length === 0"
          class="flex-1 flex items-center justify-center"
        >
          <EmptyState
            title="No tenés pronósticos en este grupo"
            description="Cargá tus pronósticos para los partidos de la fecha y sumá puntos."
            cta-label="Cargar un pronóstico"
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

      <!-- sección datos del grupo -->
      <div v-else-if="toggleSection === 'info'" class="flex-1 p-6">
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
              Código del grupo
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

          <div class="flex justify-end mt-2">
            <button type="submit" class="!bg-primary hover:!bg-primary-hover !text-white !border-0">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </section>

    <NewPredictionModal
      :show-modal="showNewPredictionModal"
      :toggle-modal="toggleNewPredictionModal"
      :group="group"
    />
  </ProtectedLayout>
</template>
