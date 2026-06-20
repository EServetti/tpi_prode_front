<script setup lang="ts">
import { computed, ref } from 'vue'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import AdminGameCard from '../components/forms/AdminGameCard.vue'
import type { Game } from '../utils/types'

const MS_HOUR = 60 * 60 * 1000
const MS_DAY = 24 * MS_HOUR

const MOCK_GAMES: Game[] = [
  {
    id: 'g1',
    fecha: 5,
    fechaPartido: Date.now() - 5 * MS_DAY,
    golesLocal: 2,
    golesVisitante: 1,
    equipoLocal: {
      nombre: 'River Plate',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/river.jpg',
    },
    equipoVisitante: {
      nombre: 'Boca Juniors',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/boca2026.jpg',
    },
  },
  {
    id: 'g2',
    fecha: 5,
    fechaPartido: Date.now() - 3 * MS_HOUR,
    golesLocal: 0,
    golesVisitante: 3,
    equipoLocal: {
      nombre: 'Racing Club',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/racing.jpg',
    },
    equipoVisitante: {
      nombre: 'Independiente',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/independiente.jpg',
    },
  },
  {
    id: 'g3',
    fecha: 6,
    fechaPartido: Date.now() + 2 * MS_DAY,
    golesLocal: 0,
    golesVisitante: 0,
    equipoLocal: {
      nombre: 'San Lorenzo',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/sanlorenzo.jpg',
    },
    equipoVisitante: {
      nombre: 'Huracán',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/huracan.jpg',
    },
  },
  {
    id: 'g4',
    fecha: 6,
    fechaPartido: Date.now() + 3 * MS_DAY,
    golesLocal: 0,
    golesVisitante: 0,
    equipoLocal: {
      nombre: 'Vélez Sarsfield',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/velez.jpg',
    },
    equipoVisitante: {
      nombre: 'Estudiantes',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/estudiantes.jpg',
    },
  },
  {
    id: 'g5',
    fecha: 7,
    fechaPartido: Date.now() + 6 * MS_DAY,
    golesLocal: 0,
    golesVisitante: 0,
    equipoLocal: {
      nombre: 'Talleres',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/talleres.jpg',
    },
    equipoVisitante: {
      nombre: 'Belgrano',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/belgrano.jpg',
    },
  },
]

const fechaOptions = computed(() =>
  Array.from(new Set(MOCK_GAMES.map((g) => g.fecha))).sort((a, b) => a - b),
)

const selectedFecha = ref<number>(fechaOptions.value[0] ?? 1)

const filteredGames = computed(() =>
  MOCK_GAMES.filter((g) => g.fecha === selectedFecha.value),
)

const onSelectFecha = (fecha: number) => {
  selectedFecha.value = fecha
}

const onGameSubmit = (_payload: {
  gameId: string
  golesLocal: number
  golesVisitante: number
}) => {
  // TODO: conectar con el backend para persistir el resultado
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
        v-if="filteredGames.length === 0"
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
