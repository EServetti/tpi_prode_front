<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Prediction } from '../../utils/types'

interface Props {
  prediction: Prediction
  alwaysEnabled?: boolean
}

const params = withDefaults(defineProps<Props>(), { alwaysEnabled: false })
const prediction = params.prediction

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      prediccionGolesLocal: number
      prediccionGolesVisitante: number
    },
  ): void
}>()

const internalEditing = ref(false)
const isEditing = computed(() => params.alwaysEnabled || internalEditing.value)

const golesLocalRef = ref(prediction.prediccionGolesLocal)
const golesVisitanteRef = ref(prediction.prediccionGolesVisitante)

const hasChanges = computed(
  () =>
    prediction.prediccionGolesLocal !== golesLocalRef.value ||
    prediction.prediccionGolesVisitante !== golesVisitanteRef.value,
)

const showActions = computed(() => params.alwaysEnabled || hasChanges.value)

// El partido queda bloqueado cuando ya empezó o faltan 30 min o menos para que empiece
const isLocked = computed(
  () => prediction.partido.fechaPartido <= Date.now() + 30 * 60 * 1000,
)

const sign = (a: number, b: number) => Math.sign(a - b)

const points = computed(() => {
  if (
    prediction.prediccionGolesLocal === prediction.partido.golesLocal &&
    prediction.prediccionGolesVisitante === prediction.partido.golesVisitante
  ) {
    return 3
  }
  if (
    sign(prediction.prediccionGolesLocal, prediction.prediccionGolesVisitante) ===
    sign(prediction.partido.golesLocal, prediction.partido.golesVisitante)
  ) {
    return 1
  }
  return 0
})

const pointsLabel = computed(() => (points.value === 1 ? '1 punto' : `${points.value} puntos`))

const pointsClass = computed(() => {
  if (points.value === 3) return 'bg-green-600/10 text-green-600'
  if (points.value === 1) return 'bg-yellow-500/10 text-yellow-500'
  return 'bg-text-muted/10 text-text-muted'
})

const onCancel = () => {
  golesLocalRef.value = prediction.prediccionGolesLocal
  golesVisitanteRef.value = prediction.prediccionGolesVisitante
  internalEditing.value = false
}

const onSubmit = () => {
  emit('submit', {
    prediccionGolesLocal: golesLocalRef.value,
    prediccionGolesVisitante: golesVisitanteRef.value,
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
      <span class="inline-flex items-center gap-2 min-w-0">
        <img
          :src="prediction.grupo.icono"
          :alt="prediction.grupo.nombre"
          class="size-5 rounded-full object-cover shrink-0"
        />
        <span class="!text-text font-medium truncate">
          {{ prediction.grupo.nombre }}
        </span>
      </span>
      <span class="inline-flex items-center gap-2 shrink-0">
        <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          Fecha {{ prediction.partido.fecha }}
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
      </span>
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
        <span v-if="!isEditing">{{ prediction.prediccionGolesLocal }}</span>
        <input v-else v-model="golesLocalRef" class="!w-10" type="number" min="0" />
        <span class="text-text-muted text-base">vs</span>
        <span v-if="!isEditing">{{ prediction.prediccionGolesVisitante }}</span>
        <input v-else v-model="golesVisitanteRef" class="!w-10" type="number" min="0" />
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

    <!-- resultado real + badge de puntos -->
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
      <span
        class="px-2 py-0.5 rounded-full text-xs font-semibold"
        :class="pointsClass"
      >
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
