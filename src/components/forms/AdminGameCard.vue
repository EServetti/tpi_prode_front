<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Game } from '../../utils/types'

interface Props {
  game: Game
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      gameId: string
      golesLocal: number
      golesVisitante: number
      fechaInicio: string
    },
  ): void
}>()

// ISO local "YYYY-MM-DDTHH:mm:ss" → "YYYY-MM-DDTHH:mm" para <input type="datetime-local">
const toDatetimeLocal = (iso: string): string => iso.slice(0, 16)

const golesLocalRef = ref(props.game.golesLocal)
const golesVisitanteRef = ref(props.game.golesVisitante)
const fechaInicioRef = ref(toDatetimeLocal(props.game.fechaInicio))

watch(
  () => props.game,
  (g) => {
    golesLocalRef.value = g.golesLocal
    golesVisitanteRef.value = g.golesVisitante
    fechaInicioRef.value = toDatetimeLocal(g.fechaInicio)
  },
)

const hasChanges = computed(
  () =>
    golesLocalRef.value !== props.game.golesLocal ||
    golesVisitanteRef.value !== props.game.golesVisitante ||
    fechaInicioRef.value !== toDatetimeLocal(props.game.fechaInicio),
)

const isPast = computed(() => props.game.estado === 'FINALIZADO')

const onCancel = () => {
  golesLocalRef.value = props.game.golesLocal
  golesVisitanteRef.value = props.game.golesVisitante
  fechaInicioRef.value = toDatetimeLocal(props.game.fechaInicio)
}

const onSubmit = () => {
  emit('submit', {
    gameId: props.game.id,
    golesLocal: golesLocalRef.value,
    golesVisitante: golesVisitanteRef.value,
    fechaInicio: `${fechaInicioRef.value}:00`,
  })
}
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
        class="!p-0 !bg-transparent !border-0 size-8 rounded-full text-green-600 hover:!bg-green-600/10 flex items-center justify-center transition-colors"
        aria-label="Guardar resultado"
        @click="onSubmit"
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
        class="!p-0 !bg-transparent !border-0 size-8 rounded-full text-text-muted hover:!bg-text-muted/10 hover:!text-text flex items-center justify-center transition-colors"
        aria-label="Cancelar cambios"
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
