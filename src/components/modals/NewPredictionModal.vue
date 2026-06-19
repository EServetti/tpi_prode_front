<script setup lang="ts">
import type { Group } from '../../utils/types'
import NewPrediction from '../forms/NewPrediction.vue'

interface Props {
  showModal: boolean
  toggleModal: () => void
  group: Group
}

const props = defineProps<Props>()

const onBackdropClick = () => props.toggleModal()
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
      aria-labelledby="new-prediction-title"
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
            <div class="min-w-0">
              <h3 id="new-prediction-title" class="!mb-0 text-lg">Nuevo pronóstico</h3>
              <p class="text-xs truncate">{{ group.nombre }}</p>
            </div>
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
            <NewPrediction
              :group="group"
              @submit="toggleModal"
              @cancel="toggleModal"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
