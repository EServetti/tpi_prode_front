<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Prediction } from '../../utils/types'

interface Props {
  prediction: Prediction
  alwaysEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { alwaysEnabled: false })

const emit = defineEmits<{
  (e: 'submit', payload: { golesLocal: number; golesVisitante: number }): void
}>()

const internalEditing = ref(false)
const isEditing = computed(() => props.alwaysEnabled || internalEditing.value)

const golesLocalRef = ref(props.prediction.golesLocal)
const golesVisitanteRef = ref(props.prediction.golesVisitante)

watch(
  () => props.prediction,
  (p) => {
    golesLocalRef.value = p.golesLocal
    golesVisitanteRef.value = p.golesVisitante
  },
)

const hasChanges = computed(
  () =>
    props.prediction.golesLocal !== golesLocalRef.value ||
    props.prediction.golesVisitante !== golesVisitanteRef.value,
)

const showActions = computed(() => props.alwaysEnabled || hasChanges.value)

// El partido queda bloqueado cuando ya empezó o faltan 30 min o menos para que empiece,
// o cuando el backend lo marca como no jugable.
const fechaInicioTs = computed(() =>
  new Date(props.prediction.partido.fechaInicio).getTime(),
)
const isLocked = computed(
  () =>
    props.prediction.partido.estado !== 'POR_JUGARSE' ||
    fechaInicioTs.value <= Date.now() + 30 * 60 * 1000,
)

const points = computed(() => props.prediction.puntosObtenidos ?? 0)

const pointsLabel = computed(() => (points.value === 1 ? '1 punto' : `${points.value} puntos`))

const pointsClass = computed(() => {
  if (points.value === 3) return 'bg-green-600/10 text-green-600'
  if (points.value === 1) return 'bg-yellow-500/10 text-yellow-500'
  return 'bg-text-muted/10 text-text-muted'
})

const onCancel = () => {
  golesLocalRef.value = props.prediction.golesLocal
  golesVisitanteRef.value = props.prediction.golesVisitante
  internalEditing.value = false
}

const onSubmit = () => {
  emit('submit', {
    golesLocal: golesLocalRef.value,
    golesVisitante: golesVisitanteRef.value,
  })
  internalEditing.value = false
}
</script>

<template>
  <div
    class="max-h-[300px] max-w-[600px] bg-surface border border-border-base rounded-2xl p-5 flex flex-col gap-4 hover:border-primary transition-colors"
  >
    <!-- header -->
    <div class="flex items-center justify-between text-xs gap-2">
      <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
        Fecha {{ prediction.partido.fecha.id }}
      </span>
      <button
        v-if="!alwaysEnabled"
        type="button"
        class="!p-1.5 !bg-transparent !border-0 size-7 rounded-md text-text-muted hover:!text-primary hover:!bg-primary/10 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:!text-text-muted disabled:hover:!bg-transparent"
        aria-label="Editar pronóstico"
        :disabled="isLocked"
        :title="isLocked ? 'El partido ya empezó o está por empezar' : 'Editar pronóstico'"
        @click="internalEditing = !internalEditing"
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
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
    </div>

    <!-- equipos y marcador pronosticado -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
        <img
          :src="prediction.partido.equipoLocal.escudo"
          :alt="prediction.partido.equipoLocal.nombre"
          class="size-14 object-contain"
        />
        <p class="!text-text text-sm font-medium truncate w-full">
          {{ prediction.partido.equipoLocal.nombre }}
        </p>
      </div>

      <div class="flex items-center gap-2 font-bold text-2xl !text-text">
        <span v-if="!isEditing">{{ prediction.golesLocal }}</span>
        <input v-else v-model.number="golesLocalRef" class="!w-10" type="number" min="0" />
        <span class="text-text-muted text-base">vs</span>
        <span v-if="!isEditing">{{ prediction.golesVisitante }}</span>
        <input v-else v-model.number="golesVisitanteRef" class="!w-10" type="number" min="0" />
      </div>

      <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
        <img
          :src="prediction.partido.equipoVisitante.escudo"
          :alt="prediction.partido.equipoVisitante.nombre"
          class="size-14 object-contain"
        />
        <p class="!text-text text-sm font-medium truncate w-full">
          {{ prediction.partido.equipoVisitante.nombre }}
        </p>
      </div>
    </div>

    <!-- resultado real + badge de puntos (solo si el partido ya empezó/terminó) -->
    <div
      v-if="isLocked"
      class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-bg border border-border-base"
    >
      <div class="flex items-center gap-2 text-xs">
        <span class="text-text-muted uppercase tracking-wide">Resultado</span>
        <span class="!text-text font-semibold">
          {{ prediction.partido.golesLocal }} - {{ prediction.partido.golesVisitante }}
        </span>
      </div>
      <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="pointsClass">
        {{ pointsLabel }}
      </span>
    </div>

    <!-- botones de guardado y cancelación -->
    <section v-if="showActions" class="w-full flex justify-end gap-2 mt-auto">
      <button
        type="button"
        class="!p-0 !bg-transparent !border-0 size-8 rounded-full text-green-600 hover:!bg-green-600/10 flex items-center justify-center transition-colors"
        aria-label="Guardar cambios"
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
        v-if="!alwaysEnabled"
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
