<script setup lang="ts">
import { useAuth } from '../hooks/useAuth'

const { user, logout } = useAuth()
</script>

<template>
  <section class="dashboard-view">
    <header>
      <h1>Dashboard</h1>
      <button @click="logout">Cerrar sesión</button>
    </header>
    <p v-if="user">Hola, {{ user.name }}</p>
  </section>
</template>
