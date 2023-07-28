import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/signin',
      component: SignInView
    },
    {
      path: '/home',
      component: HomeView
    }
  ]
})

export default router
