<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Game } from '../../utils/types'
import { useUpdatePartido } from '../../hooks/usePartidos';
import type { ActualizarPartidoPayload } from '../../services/partidos.service';

interface Props {
  game: Game
}

const props = defineProps<Props>()

const {isPending, mutate: updatePartido} = useUpdatePartido()

// ISO local "YYYY-MM-DDTHH:mm:ss" → "YYYY-MM-DDTHH:mm" para <input type="datetime-local">
const toDatetimeLocal = (iso: string): string => iso.slice(0, 16)

const golesLocalRef = ref(props.game.golesLocal)
const golesVisitanteRef = ref(props.game.golesVisitante)
const fechaInicioRef = ref(toDatetimeLocal(props.game.fechaInicio))
const estadoPartidoRef = ref(props.game.estado)

watch(
  () => props.game,
  (g) => {
    golesLocalRef.value = g.golesLocal
    golesVisitanteRef.value = g.golesVisitante
    fechaInicioRef.value = toDatetimeLocal(g.fechaInicio)
    estadoPartidoRef.value = g.estado
  },
)

const hasChanges = computed(
  () =>
    golesLocalRef.value !== props.game.golesLocal ||
    golesVisitanteRef.value !== props.game.golesVisitante ||
    fechaInicioRef.value !== toDatetimeLocal(props.game.fechaInicio) ||
    estadoPartidoRef.value !== props.game.estado
)

const isPast = computed(() => props.game.estado === 'FINALIZADO')

const onCancel = () => {
  golesLocalRef.value = props.game.golesLocal
  golesVisitanteRef.value = props.game.golesVisitante
  fechaInicioRef.value = toDatetimeLocal(props.game.fechaInicio)
  estadoPartidoRef.value = props.game.estado
}

const hadleUpdate = () => {
  const changesPayload: ActualizarPartidoPayload = {}
  if (golesLocalRef.value !== props.game.golesLocal) changesPayload.golesLocal = golesLocalRef.value
  if (golesVisitanteRef.value !== props.game.golesVisitante) changesPayload.golesVisitante = golesVisitanteRef.value
  if (fechaInicioRef.value !== props.game.fechaInicio) changesPayload.fechaInicio = fechaInicioRef.value
  if (estadoPartidoRef.value !== props.game.estado) changesPayload.estado = estadoPartidoRef.value

  updatePartido({id: props.game.id, payload: changesPayload})
}

const isLocked = computed(() => props.game.estado === "FINALIZADO")
</script>

<template>
  <div
    class="bg-surface border border-border-base rounded-2xl p-5 flex flex-col gap-4 hover:border-primary transition-colors"
  >
    <div class="flex items-center justify-between text-xs gap-2">
      <span class="inline-flex items-center gap-2 shrink-0">
        <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          Fecha {{ game.fecha.id }}
        </span>
        <span
          v-if="isPast"
          class="px-2 py-0.5 rounded-full bg-text-muted/10 text-text-muted font-semibold"
        >
          Finalizado
        </span>
      </span>
    </div>

    <label class="flex flex-col gap-1.5 text-xs">
      <span class="!text-text font-medium">Fecha y hora del partido</span>
      <input
        v-model="fechaInicioRef"
        type="datetime-local"
        class="!w-full"
      />
    </label>

    <label class="flex flex-col gap-1.5 text-xs">
      <span class="!text-text font-medium">Estado del partido</span>
      <select id="game-status-dropdown" v-model="estadoPartidoRef">
        <option value="POR_JUGARSE">Por jugarse</option>
        <option value="EN_JUEGO">En juego</option>
        <option value="FINALIZADO">Finalizado</option>
      </select>
    </label>

    <div class="flex items-center justify-between gap-3">
      <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
        <img
          :src="game.equipoLocal.escudo"
          :alt="game.equipoLocal.nombre"
          class="size-14 object-contain"
        />
        <p class="!text-text text-sm font-medium truncate w-full">
          {{ game.equipoLocal.nombre }}
        </p>
        <input
          :disabled="isLocked"
          v-model.number="golesLocalRef"
          type="number"
          min="0"
          class="!w-16 text-center font-bold"
        />
      </div>

      <span class="text-text-muted text-sm font-semibold">vs</span>

      <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
        <img
          :src="game.equipoVisitante.escudo"
          :alt="game.equipoVisitante.nombre"
          class="size-14 object-contain"
        />
        <p class="!text-text text-sm font-medium truncate w-full">
          {{ game.equipoVisitante.nombre }}
        </p>
        <input
          :disabled="isLocked"
          v-model.number="golesVisitanteRef"
          type="number"
          min="0"
          class="!w-16 text-center font-bold"
        />
      </div>
    </div>

    <section v-if="hasChanges" class="w-full flex justify-end gap-2 mt-auto">
      <button
        type="button"
        class="!p-0 !bg-transparent !border-0 size-8 rounded-full text-green-600 hover:!bg-green-600/10 flex items-center justify-center transition-colors disabled:opacity-70"
        aria-label="Guardar resultado"
        :disabled="isPending"
        @click="hadleUpdate"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5"
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
        type="button"
        class="!p-0 !bg-transparent !border-0 size-8 rounded-full text-text-muted hover:!bg-text-muted/10 hover:!text-text flex items-center justify-center transition-colors disabled:opacity-70"
        aria-label="Cancelar cambios"
        :disabled="isPending"
        @click="onCancel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </section>
  </div>
</template>
