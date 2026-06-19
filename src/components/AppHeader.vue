<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { APP_NAME } from '../constants/app-data'
import UserDropdown from './UserDropdown.vue'

onMounted(async () => {
  await nextTick()
  const { HSStaticMethods } = await import('preline')
  HSStaticMethods.autoInit()
})
</script>

<template>
  <header
    class="w-full flex items-center justify-between px-6 py-3 bg-surface border-b border-border-base"
  >
    <router-link to="/dashboard" class="text-xl font-bold italic !text-text hover:!text-primary">
      {{ APP_NAME }}
    </router-link>

    <nav class="flex items-center gap-6">
      <router-link to="/mis-prodes" class="!text-text hover:!text-primary">
        Mis prodes
      </router-link>
      <router-link to="/mis-predicciones" class="!text-text hover:!text-primary">
        Mis predicciones
      </router-link>
    </nav>

    <UserDropdown />
  </header>
</template>
