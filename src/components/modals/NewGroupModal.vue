<script setup lang="ts">
import NewGroup, { type NewGroupPayload } from '../forms/NewGroup.vue'

interface Props {
  showModal: boolean
  toggleModal: () => void
  loading?: boolean
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), { loading: false, errorMessage: null })

const emit = defineEmits<{
  (e: 'submit', payload: NewGroupPayload): void
}>()

const onBackdropClick = () => {
  if (props.loading) return
  props.toggleModal()
}

const onSubmit = (payload: NewGroupPayload) => {
  emit('submit', payload)
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-group-title"
      @click.self="onBackdropClick"
    >
      <Transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-150"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
        appear
      >
        <div
          v-if="showModal"
          class="bg-surface border border-border-base rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        >
          <header
            class="flex items-center justify-between px-5 py-4 border-b border-border-base"
          >
            <h3 id="new-group-title" class="!mb-0 text-lg">Crear grupo</h3>
            <button
              type="button"
              class="!p-2 !bg-transparent !border-0 size-8 rounded-full text-text-muted hover:!text-text hover:!bg-bg flex items-center justify-center"
              aria-label="Cerrar"
              @click="toggleModal"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto p-5">
            <NewGroup
              :loading="loading"
              :error-message="errorMessage"
              @submit="onSubmit"
              @cancel="toggleModal"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
