<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <AppHeader class="sticky top-0 z-30" />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
