import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import DashboardPage from '../pages/dashboard/DashboardPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router