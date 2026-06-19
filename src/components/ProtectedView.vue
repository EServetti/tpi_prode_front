<script setup lang="ts">
// TODO: implementar ProtectedView
// - Leer isAuthenticated desde useAuthContext()
// - Si no está autenticado: redirigir a /login (router.replace)
// - Si está autenticado: renderizar el <slot />
</script>

<template>
  <slot />
</template>
