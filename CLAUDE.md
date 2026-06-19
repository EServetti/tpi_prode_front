# tpi_prode_front

Frontend del TPI de Programación IV (UTN). SPA de un sistema de prode (predicciones deportivas).

## Stack

- **Vue 3** + `<script setup>` + TypeScript
- **Vite** como bundler/dev server
- **Vue Router 4** para enrutado
- **TanStack Query** (`@tanstack/vue-query`) para fetching/caché
- **Axios** para HTTP
- **js-cookie** para persistencia de sesión
- **Tailwind CSS v4** (vía `@tailwindcss/vite`) para estilos

## Estructura

```
src/
├── components/        Componentes reutilizables (AppLayout, ProtectedView)
├── constants/         Constantes globales (endpoints mock, claves de cookies)
├── context/           Auth context vía provide/inject (AuthContext + AuthProvider)
├── hooks/             Composables (useAuth, useCurrentUser)
├── router/            Definición de rutas y guards
├── services/          Cliente axios + servicios de dominio (auth.service)
├── utils/             Tipos compartidos y helpers (session storage en cookies)
├── views/             Pantallas asociadas a rutas (Login, Register, Dashboard, NotFound)
├── App.vue            Monta AuthProvider + AppLayout
└── main.ts            Bootstrap: router + VueQueryPlugin
```

## Convenciones

- **Sintaxis de funciones**: siempre arrow functions (`const fn = () => {}`), no `function`.
- **Sesión**: token y user se persisten en cookies (`utils/session.ts`), no en localStorage.
- **Auth state**: se accede via `useAuthContext()` (provide/inject); las mutaciones de login/register pasan por `useAuth()` con TanStack Query.
- **Backend**: aún no hay conexión real. `services/auth.service.ts` devuelve datos mock con `setTimeout`. Los endpoints están en `constants/constants.ts` (`MOCK_ENDPOINTS`).
- **Rutas protegidas**: vía meta `requiresAuth` / `guestOnly` en el router. `ProtectedView` queda como componente alternativo para proteger contenido a nivel de slot (sin implementar todavía).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — type-check + build de producción
- `npm run preview` — preview del build
