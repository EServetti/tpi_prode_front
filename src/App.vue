<script setup lang="ts">
import AuthProvider from './context/AuthProvider.vue'
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AuthProvider>
    <AppLayout />
  </AuthProvider>
</template>
