<script setup lang="ts">
import { ref } from 'vue'

export interface NewGroupPayload {
  nombre: string
  icono: string
  codigoInvitacion: string
}

withDefaults(
  defineProps<{
    loading?: boolean
    errorMessage?: string | null
  }>(),
  { loading: false, errorMessage: null },
)

const emit = defineEmits<{
  (e: 'submit', payload: NewGroupPayload): void
  (e: 'cancel'): void
}>()

const nombre = ref('')
const icono = ref('')
const codigoInvitacion = ref('')

const onSubmit = () => {
  emit('submit', {
    nombre: nombre.value.trim(),
    icono: icono.value.trim(),
    codigoInvitacion: codigoInvitacion.value.trim(),
  })
}
</script>

<template>
  <form class="flex flex-col gap-4 !m-0 !max-w-none" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm !text-text font-medium">Imagen del grupo</label>
      <div class="flex items-center gap-4">
        <div
          class="size-16 rounded-xl overflow-hidden border border-border-base bg-bg shrink-0"
        >
          <img
            v-if="icono"
            :src="icono"
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
          v-model="icono"
          type="url"
          placeholder="https://..."
          class="flex-1"
          required
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="new-group-name" class="text-sm !text-text font-medium">Nombre</label>
      <input
        id="new-group-name"
        v-model="nombre"
        type="text"
        placeholder="Nombre del grupo"
        required
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="new-group-code" class="text-sm !text-text font-medium">
        Código de invitación
      </label>
      <input
        id="new-group-code"
        v-model="codigoInvitacion"
        type="text"
        placeholder="Ej: AMIGOS-2026"
        required
      />
      <p class="text-xs">
        Compartí este código para que otros usuarios se sumen al grupo.
      </p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="flex justify-end gap-2 mt-2">
      <button
        type="button"
        class="!bg-transparent !text-text border border-border-base hover:!bg-bg"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="!bg-primary hover:!bg-primary-hover !text-white !border-0"
        :disabled="loading"
      >
        {{ loading ? 'Creando...' : 'Crear grupo' }}
      </button>
    </div>
  </form>
</template>
