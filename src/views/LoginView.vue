<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../hooks/useAuth'
import { APP_NAME } from '../constants/app-data'

const { login, loginStatus } = useAuth()
const email = ref('')
const password = ref('')

const onSubmit = () => {
  login({ email: email.value, password: password.value })
}
</script>

<template>
  <div class="w-full h-screen flex flex-row justify-center items-center overflow-y-hidden">
    <sectiion class="flex-2 h-full flex flex-col items-center justify-center bg-surface">
      <form class="w-[50%] h-full flex flex-col justify-center" @submit.prevent="onSubmit">
        <h1 class="italic underline">{{ APP_NAME }}</h1>
        <h2 class="!mb-5">Iniciar sesión</h2>
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit" :disabled="loginStatus.isPending.value">
          {{ loginStatus.isPending.value ? 'Cargando...' : 'Entrar' }}
        </button>
        <p v-if="loginStatus.isError.value" class="error">Error al iniciar sesión</p>
        <p>¿Aún no estas registrado? <router-link to="/register">Crear cuenta</router-link></p>
      </form>
    </sectiion>
    <sectiion class="flex-1 hidden lg:flex !p-0">
      <video src="../assets/videos/mascota_dominadas.mp4" autoplay loop></video>
    </sectiion>
  </div>
</template>
