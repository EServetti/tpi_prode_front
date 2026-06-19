<script setup lang="ts">
import ProtectedView from '../components/ProtectedView.vue'
import { useAuth } from '../hooks/useAuth'

const { user } = useAuth()
</script>

<template>
  <ProtectedView>
    <section class="p-6">
      <h1>Dashboard</h1>
      <p v-if="user">Hola, {{ user.name }}</p>
    </section>
  </ProtectedView>
</template>
