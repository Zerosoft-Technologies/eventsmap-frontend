import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import CreateProfile from '../pages/CreateProfile.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create-profile',
    name: "Create Profile",
    component: CreateProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
