<script setup lang="ts">
import AppHeader from './AppHeader.vue'

// TODO: implementar redirección
// - Leer isAuthenticated desde useAuthContext()
// - Si no está autenticado: redirigir a /login (router.replace)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
