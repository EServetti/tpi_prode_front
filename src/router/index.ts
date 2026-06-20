import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { sessionStorage } from '../utils/session'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/group/:id',
    name: 'group',
    component: () => import('../views/GroupView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPanelView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = !!sessionStorage.getToken()
  const isAdmin = sessionStorage.isAdmin()
  if (to.meta.requiresAuth && !isAuthenticated) return { name: 'login' }
  if (to.meta.requiresAdmin && !isAdmin) return { name: 'dashboard' }
  if (to.meta.guestOnly && isAuthenticated) return { name: 'dashboard' }
})

router.afterEach(async () => {
  const { HSStaticMethods } = await import('preline')
  setTimeout(() => HSStaticMethods.autoInit(), 100)
})
