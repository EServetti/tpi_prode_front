<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  ctaLabel?: string
}>()

defineEmits<{
  (e: 'cta'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-6 py-10 gap-3">
    <div
      class="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center"
    >
      <slot name="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </slot>
    </div>

    <h3 class="text-base !mb-0">{{ title }}</h3>
    <p v-if="description" class="text-sm max-w-xs">{{ description }}</p>

    <button
      v-if="ctaLabel"
      type="button"
      class="mt-2 !bg-primary hover:!bg-primary-hover !text-white"
      @click="$emit('cta')"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>
