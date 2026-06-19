<script setup lang="ts">
import { computed } from 'vue'
import type { GroupUser } from '../utils/types'

interface Props {
  user: GroupUser
  position: number
}

const props = defineProps<Props>()

const initials = computed(() =>
  props.user.nombre
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

const positionClass = computed(() => {
  if (props.position === 1) return 'bg-yellow-500/10 text-yellow-500'
  if (props.position === 2) return 'bg-gray-400/10 text-gray-400'
  if (props.position === 3) return 'bg-amber-700/10 text-amber-700'
  return 'bg-primary/10 text-primary'
})
</script>

<template>
  <li
    class="bg-surface border border-border-base rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:border-primary transition-colors"
  >
    <!-- línea 1 (mobile): puesto + iniciales | línea izquierda en desktop -->
    <div class="flex items-center gap-3 sm:contents">
      <span
        class="size-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
        :class="positionClass"
      >
        #{{ position }}
      </span>

      <div
        v-if="user.avatar"
        class="size-10 rounded-full overflow-hidden shrink-0 bg-bg"
      >
        <img :src="user.avatar" :alt="user.nombre" class="size-full object-cover" />
      </div>
      <div
        v-else
        class="size-10 rounded-full shrink-0 bg-primary text-white flex items-center justify-center font-semibold"
      >
        {{ initials }}
      </div>
    </div>

    <!-- línea 2 (mobile): nombre + stats + puntos -->
    <div class="flex items-center gap-3 sm:contents">
      <div class="flex-1 min-w-0">
        <p class="!text-text font-medium truncate">{{ user.nombre }}</p>
        <p class="text-xs flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          {{ user.resultadosExactos }} resultados exactos
        </p>
      </div>

      <div class="text-right shrink-0">
        <p class="!text-text font-bold text-lg leading-none">{{ user.puntos }}</p>
        <p class="text-xs uppercase tracking-wide">pts</p>
      </div>
    </div>
  </li>
</template>
