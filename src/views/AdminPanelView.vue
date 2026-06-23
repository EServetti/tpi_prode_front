<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import AdminGameCard from '../components/forms/AdminGameCard.vue'
import { usePartidos } from '../hooks/usePartidos'

const { partidos, isLoading: partidosLoading } = usePartidos()

const fechaOptions = computed(() =>
  Array.from(new Set(partidos.value.map((g) => String(g.fecha.id)))).sort(
    (a, b) => Number(a) - Number(b),
  ),
)

const selectedFecha = ref<string>('')

// Cuando llegan los partidos, autoselect la primera fecha disponible
watch(
  fechaOptions,
  (options) => {
    if (!selectedFecha.value && options.length > 0) {
      selectedFecha.value = options[0]
    }
  },
  { immediate: true },
)

const filteredGames = computed(() =>
  partidos.value.filter((g) => String(g.fecha.id) === selectedFecha.value),
)

const onSelectFecha = (fecha: string) => {
  selectedFecha.value = fecha
}

const onGameSubmit = (_payload: {
  gameId: string
  golesLocal: number
  golesVisitante: number
  fechaInicio: string
}) => {
  // TODO: PUT /partidos/{id} con { fechaId, fechaInicio, golesLocal, golesVisitante }
}
</script>

<template>
  <ProtectedLayout>
    <section class="flex-1 flex flex-col">
      <header
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border-base"
      >
        <div>
          <h2 class="text-lg sm:text-xl !mb-0">Panel de administración</h2>
          <p class="text-xs">Cargá los resultados reales de cada partido</p>
        </div>

        <!-- filtro por fecha -->
        <div class="hs-dropdown relative inline-flex">
          <button
            id="fecha-filter-btn"
            type="button"
            class="hs-dropdown-toggle !bg-bg !text-text border border-border-base hover:!border-primary inline-flex items-center gap-2"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Filtrar por fecha"
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
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
            <span>Fecha {{ selectedFecha }}</span>
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
            class="hs-dropdown-menu hs-dropdown-open:opacity-100 transition-[opacity,margin] duration-200 opacity-0 hidden min-w-44 bg-surface border border-border-base shadow-md rounded-lg p-2 absolute right-0 top-full mt-2 z-50"
            role="menu"
            aria-labelledby="fecha-filter-btn"
          >
            <button
              v-for="option in fechaOptions"
              :key="option"
              type="button"
              class="w-full text-left !bg-transparent !border-0 rounded-md px-3 py-2 hover:!bg-bg flex items-center justify-between gap-2"
              :class="selectedFecha === option ? '!text-primary' : '!text-text'"
              @click="onSelectFecha(option)"
            >
              <span>Fecha {{ option }}</span>
              <svg
                v-if="selectedFecha === option"
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
      </header>

      <div
        v-if="partidosLoading"
        class="flex-1 flex items-center justify-center text-sm text-text-muted"
      >
        Cargando partidos...
      </div>

      <div
        v-else-if="filteredGames.length === 0"
        class="flex-1 flex items-center justify-center"
      >
        <EmptyState
          title="No hay partidos para esta fecha"
          description="Elegí otra fecha desde el filtro para ver y cargar resultados."
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
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
          </template>
        </EmptyState>
      </div>

      <ul v-else class="flex-1 p-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdminGameCard
          v-for="game in filteredGames"
          :key="game.id"
          :game="game"
          @submit="onGameSubmit"
        />
      </ul>
    </section>
  </ProtectedLayout>
</template>
