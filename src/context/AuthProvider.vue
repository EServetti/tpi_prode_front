<script setup lang="ts">
import { provideAuth } from './AuthContext'

provideAuth()
</script>

<template>
  <slot />
</template>
