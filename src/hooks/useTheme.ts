import { ref, watch, computed } from 'vue'
import Cookies from 'js-cookie'

type Theme = 'light' | 'dark'

const THEME_COOKIE = 'prode_theme'

const getInitialTheme = (): Theme => {
  const stored = Cookies.get(THEME_COOKIE) as Theme | undefined
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

const applyTheme = (value: Theme) => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(value)
}

applyTheme(theme.value)

watch(theme, (value) => {
  applyTheme(value)
  Cookies.set(THEME_COOKIE, value, { expires: 365, sameSite: 'lax' })
})

export const useTheme = () => {
  const isDark = computed(() => theme.value === 'dark')

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, isDark, toggle }
}
