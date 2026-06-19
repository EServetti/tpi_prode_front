<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Game, Group } from '../../utils/types'
import PredictionCard from './PredictionCard.vue'

const props = defineProps<{ group: Group }>()
const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      partido: Game
      prediccionGolesLocal: number
      prediccionGolesVisitante: number
    },
  ): void
  (e: 'cancel'): void
}>()

const MS_HOUR = 60 * 60 * 1000
const MS_DAY = 24 * MS_HOUR

const MOCK_GAMES: Game[] = [
  {
    id: 'g1',
    golesLocal: 0,
    golesVisitante: 0,
    fecha: 7,
    fechaPartido: Date.now() + 2 * MS_DAY,
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
    id: 'g2',
    golesLocal: 0,
    golesVisitante: 0,
    fecha: 7,
    fechaPartido: Date.now() + 3 * MS_DAY,
    equipoLocal: {
      nombre: "Newell's",
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/newells.jpg',
    },
    equipoVisitante: {
      nombre: 'Rosario Central',
      escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/central.jpg',
    },
  },
  {
    id: 'g3',
    golesLocal: 0,
    golesVisitante: 0,
    fecha: 7,
    fechaPartido: Date.now() + 5 * MS_DAY,
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

const selectedGameId = ref<string>('')

const selectedGame = computed<Game | null>(
  () => MOCK_GAMES.find((g) => g.id === selectedGameId.value) ?? null,
)

const newPrediction = computed(() =>
  selectedGame.value
    ? {
        grupo: props.group,
        prediccionGolesLocal: 0,
        prediccionGolesVisitante: 0,
        partido: selectedGame.value,
      }
    : null,
)

const onCardSubmit = (payload: {
  prediccionGolesLocal: number
  prediccionGolesVisitante: number
}) => {
  if (!selectedGame.value) return
  emit('submit', {
    partido: selectedGame.value,
    prediccionGolesLocal: payload.prediccionGolesLocal,
    prediccionGolesVisitante: payload.prediccionGolesVisitante,
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label for="games-dropdown" class="text-sm !text-text font-medium">Partido</label>
      <select id="games-dropdown" v-model="selectedGameId" class="!bg-bg">
        <option value="" disabled>Elegí un partido</option>
        <option v-for="game in MOCK_GAMES" :key="game.id" :value="game.id">
          {{ game.equipoLocal.nombre }} vs {{ game.equipoVisitante.nombre }} — Fecha {{ game.fecha }}
        </option>
      </select>
    </div>

    <PredictionCard
      v-if="newPrediction"
      :prediction="newPrediction"
      always-enabled
      @submit="onCardSubmit"
    />

    <div class="flex justify-end">
      <button
        type="button"
        class="!bg-transparent !text-text border border-border-base hover:!bg-bg"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>
