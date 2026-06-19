<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const { user, logout } = useAuth()
const { isDark, toggle: toggleTheme } = useTheme()

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const onLogout = async () => {
  await logout()
}
</script>

<template>
  <div class="hs-dropdown relative inline-flex">
    <button
      id="user-dropdown-btn"
      type="button"
      class="hs-dropdown-toggle !p-0 !bg-primary !border-0 size-10 rounded-full text-white font-semibold flex items-center justify-center hover:!bg-primary-hover"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Menú de usuario"
    >
      {{ initials }}
    </button>

    <div
      class="hs-dropdown-menu hs-dropdown-open:opacity-100 transition-[opacity,margin] duration-200 opacity-0 hidden min-w-60 bg-surface border border-border-base shadow-md rounded-lg p-2 absolute right-0 top-full mt-2 z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-dropdown-btn"
    >
      <div class="px-3 py-2 border-b border-border-base mb-2">
        <p class="text-xs uppercase text-text-muted">Nombre</p>
        <p class="text-text">{{ user?.name }}</p>
        <p class="text-xs uppercase text-text-muted mt-1">Email</p>
        <p class="text-text text-sm">{{ user?.email }}</p>
      </div>

      <div class="flex items-center justify-between gap-3 px-3 py-2 rounded-md">
        <span class="text-sm text-text">Tema</span>
        <div class="inline-flex bg-bg border border-border-base rounded-full p-1 gap-1">
          <button
            type="button"
            class="!p-1.5 !border-0 !rounded-full flex items-center justify-center transition-colors"
            :class="
              !isDark
                ? '!bg-primary !text-white'
                : '!bg-transparent !text-text-muted hover:!text-text'
            "
            aria-label="Modo claro"
            :aria-pressed="!isDark"
            @click="!isDark || toggleTheme()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <button
            type="button"
            class="!p-1.5 !border-0 !rounded-full flex items-center justify-center transition-colors"
            :class="
              isDark
                ? '!bg-primary !text-white'
                : '!bg-transparent !text-text-muted hover:!text-text'
            "
            aria-label="Modo oscuro"
            :aria-pressed="isDark"
            @click="isDark || toggleTheme()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="w-full text-left !bg-transparent !text-danger hover:!bg-bg !border-0 rounded-md px-3 py-2 mt-1"
        @click="onLogout"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>
