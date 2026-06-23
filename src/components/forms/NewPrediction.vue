<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Game, UserGroup } from '../../utils/types'
import PredictionCard from './PredictionCard.vue'
import { usePartidos } from '../../hooks/usePartidos'

const props = withDefaults(
  defineProps<{
    groups: UserGroup[]
    loading?: boolean
    errorMessage?: string | null
  }>(),
  { loading: false, errorMessage: null },
)

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      partido: Game
      grupoId: string
      golesLocal: number
      golesVisitante: number
    },
  ): void
  (e: 'cancel'): void
}>()

const { partidos, isLoading: partidosLoading } = usePartidos()

// Solo mostramos partidos pronosticables (no jugados todavía)
const availableGames = computed(() =>
  partidos.value.filter((g) => g.estado === 'POR_JUGARSE'),
)

const selectedGameId = ref<string>('')
const selectedGroupId = ref<string>(
  props.groups.length === 1 ? String(props.groups[0].id) : '',
)

// Si la lista de grupos cambia, mantener consistencia: si queda solo uno, autoselect
watch(
  () => props.groups,
  (g) => {
    if (g.length === 1) selectedGroupId.value = String(g[0].id)
    else if (!g.some((group) => String(group.id) === selectedGroupId.value)) {
      selectedGroupId.value = ''
    }
  },
)

const selectedGame = computed<Game | null>(
  () => availableGames.value.find((g) => String(g.id) === selectedGameId.value) ?? null,
)

const newPrediction = computed(() =>
  selectedGame.value
    ? {
        id: '',
        golesLocal: 0,
        golesVisitante: 0,
        fechaPronostico: new Date().toISOString(),
        puntosObtenidos: 0,
        partido: selectedGame.value,
      }
    : null,
)

const onCardSubmit = (payload: { golesLocal: number; golesVisitante: number }) => {
  if (!selectedGame.value || !selectedGroupId.value) return
  emit('submit', {
    partido: selectedGame.value,
    grupoId: selectedGroupId.value,
    golesLocal: payload.golesLocal,
    golesVisitante: payload.golesVisitante,
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- selector de grupo: solo cuando hay más de uno -->
    <div v-if="groups.length > 1" class="flex flex-col gap-1.5">
      <label for="groups-dropdown" class="text-sm !text-text font-medium">Grupo</label>
      <select id="groups-dropdown" v-model="selectedGroupId" class="!bg-bg">
        <option value="" disabled>Elegí un grupo</option>
        <option v-for="g in groups" :key="g.id" :value="String(g.id)">
          {{ g.nombre }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="games-dropdown" class="text-sm !text-text font-medium">Partido</label>
      <select
        id="games-dropdown"
        v-model="selectedGameId"
        :disabled="partidosLoading"
        class="!bg-bg"
      >
        <option value="" disabled>
          {{ partidosLoading ? 'Cargando partidos...' : 'Elegí un partido' }}
        </option>
        <option v-for="game in availableGames" :key="game.id" :value="String(game.id)">
          {{ game.equipoLocal.nombre }} vs {{ game.equipoVisitante.nombre }} — Fecha {{ game.fecha.id }}
        </option>
      </select>
      <p v-if="!partidosLoading && availableGames.length === 0" class="text-xs">
        No hay partidos pronosticables por ahora.
      </p>
    </div>

    <PredictionCard
      v-if="newPrediction && selectedGroupId"
      :prediction="newPrediction"
      always-enabled
      @submit="onCardSubmit"
    />

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="flex justify-end">
      <button
        type="button"
        class="!bg-transparent !text-text border border-border-base hover:!bg-bg"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
    </div>

    <p v-if="loading" class="text-xs text-text-muted text-right">Guardando pronóstico...</p>
  </div>
</template>
