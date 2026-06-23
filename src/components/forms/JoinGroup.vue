<script setup lang="ts">
import { ref } from 'vue'

export interface JoinGroupPayload {
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
  (e: 'submit', payload: JoinGroupPayload): void
  (e: 'cancel'): void
}>()

const codigoInvitacion = ref('')

const onSubmit = () => {
  emit('submit', {
    codigoInvitacion: codigoInvitacion.value.trim(),
  })
}
</script>

<template>
  <form class="flex flex-col gap-4 !m-0 !max-w-none" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-1.5">
      <label for="join-group-code" class="text-sm !text-text font-medium">
        Código de invitación
      </label>
      <input
        id="join-group-code"
        v-model="codigoInvitacion"
        type="text"
        placeholder="Ej: AMIGOS-2026"
        required
      />
      <p class="text-xs">
        Pedile el código al creador del grupo y pegalo acá.
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
        :disabled="loading || !codigoInvitacion.trim()"
      >
        {{ loading ? 'Ingresando...' : 'Ingresar al grupo' }}
      </button>
    </div>
  </form>
</template>
