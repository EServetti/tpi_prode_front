<script setup lang="ts">
import { computed, ref } from 'vue'
import ProtectedView from '../components/ProtectedView.vue'
import EmptyState from '../components/EmptyState.vue'
import { MOCK_PREDICTIONS } from '../constants/app-data'
import PredictionCard from '../components/forms/PredictionCard.vue'

const MOCK_GROUPS = [
  {
    id: "1",
    nombre: 'Grupo amigos',
    icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3pdU5JXffFVf_PIsSusNpga_ZMi1Rgux8MO251d-rg&s=10',
    participantes: 5,
  },
  {
    id: "2",
    nombre: 'Prode trabajo',
    icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO6F4lRHj08jqcJ1i_CmpxGWIj9FhAD3fe3S2JQw0u6g&s=10',
    participantes: 15,
  },
  {
    id: "3",
    nombre: 'Torneo familia',
    icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ526KT7h9nkMoV1XI-lmuJMYfo0d4GiKNXVHjMt-CjaA&s=10',
    participantes: 8,
  },
]

const groups = MOCK_GROUPS

const selectedGroup = ref<string | null>(null)

const groupOptions = computed(() =>
  Array.from(new Set(MOCK_PREDICTIONS.map((p) => p.grupo.nombre))),
)

const predictions = computed(() =>
  selectedGroup.value
    ? MOCK_PREDICTIONS.filter((p) => p.grupo.nombre === selectedGroup.value)
    : MOCK_PREDICTIONS,
)

const selectedLabel = computed(() => selectedGroup.value ?? 'Todos los grupos')

const onSelectGroup = (group: string | null) => {
  selectedGroup.value = group
}
</script>

<template>
  <ProtectedView>
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
                  :class="selectedGroup === null ? '!text-primary' : '!text-text'"
                  @click="onSelectGroup(null)"
                >
                  <span>Todos los grupos</span>
                  <svg
                    v-if="selectedGroup === null"
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
                <button
                  v-for="option in groupOptions"
                  :key="option"
                  type="button"
                  class="w-full text-left !bg-transparent !border-0 rounded-md px-3 py-2 hover:!bg-bg flex items-center justify-between gap-2"
                  :class="selectedGroup === option ? '!text-primary' : '!text-text'"
                  @click="onSelectGroup(option)"
                >
                  <span class="truncate">{{ option }}</span>
                  <svg
                    v-if="selectedGroup === option"
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
          </div>
        </header>

        <div v-if="predictions.length === 0" class="flex-1 flex items-center justify-center">
          <EmptyState
            title="Todavía no cargaste pronósticos"
            description="Pronosticá el resultado de los próximos partidos para sumar puntos en tus grupos."
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

        <ul v-else class="flex-1 p-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PredictionCard v-for="(prediction, idx) in predictions" 
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
            class="!p-2 !bg-primary !border-0 size-9 rounded-full text-white flex items-center justify-center hover:!bg-primary-hover"
            aria-label="Crear grupo"
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

        <div v-if="groups.length === 0" class="flex-1 flex items-center justify-center">
          <EmptyState
            title="Aún no estás en ningún grupo"
            description="Creá un grupo o unite a uno existente para competir con tus amigos."
            cta-label="Crear grupo"
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
          <li
            v-for="group in groups"
            :key="group.nombre"
            class="bg-bg border border-border-base rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors"
          >
            <img
              :src="group.icono"
              :alt="group.nombre"
              class="size-12 rounded-lg object-cover shrink-0 bg-surface"
            />

            <router-link :to="{name: 'group', params: {id: group.id}}" class="flex-1 min-w-0">
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
                {{ group.participantes }} participantes
              </p>
            </router-link>

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
          </li>
        </ul>

        <footer class="px-5 py-3 border-t border-border-base flex flex-col gap-2">
          <button
            type="button"
            class="w-full !bg-transparent !text-primary border border-border-base hover:!bg-bg"
          >
            Unirse a un grupo
          </button>
        </footer>
      </aside>
    </div>
  </ProtectedView>
</template>
