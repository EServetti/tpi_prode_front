<script setup lang="ts">
import { useAuthContext } from '../context/AuthContext'

const { isAuthenticated } = useAuthContext()
</script>

<template>
  <div class="app-layout">
    <nav v-if="isAuthenticated">
      <router-link to="/dashboard">Dashboard</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
