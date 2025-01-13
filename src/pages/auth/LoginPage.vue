<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('user', JSON.stringify({
    name: username.value,
    avatar: null,
    role: 'Admin'
  }))
  router.push('/')
}

const goToRegister = () => {
  router.push({ name: 'Register' })
}

const goToResetPassword = () => {
  router.push({ name: 'ResetPassword' })
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-logo">
        <span class="auth-logo-text">M</span>goods
      </div>
      <h2 class="auth-title">Millionga ($) bir qadam</h2>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="auth-group">
          <label class="auth-label">Username</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-account auth-input-icon"></i>
            <input 
              type="text" 
              v-model="username"
              placeholder="Enter username"
              required
              class="auth-input"
            >
          </div>
        </div>
        
        <div class="auth-group">
          <label class="auth-label">Password</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-lock auth-input-icon"></i>
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter password"
              required
              class="auth-input"
            >
            <button 
              type="button"
              class="password-toggle"
              @click="togglePassword"
            >
              <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="auth-button">
          <i class="mdi mdi-login"></i>
          Log in to APP
        </button>

        <div class="auth-link">
          <button type="button" class="link" @click="goToResetPassword">
            <i class="mdi mdi-lock-reset"></i>
            Reset password
          </button>
          <span class="mx-2">|</span>
          <button type="button" class="link" @click="goToRegister">
            <i class="mdi mdi-account-plus"></i>
            Register
          </button>
        </div>

        <div class="auth-divider">
          <span class="auth-divider-text">or continue with</span>
        </div>
        
        <div class="social-buttons">
          <button type="button" class="social-button google">
            <i class="mdi mdi-google"></i>
            <span class="hidden sm:inline">Register with Google</span>
            <span class="sm:hidden">Google</span>
          </button>
          <button type="button" class="social-button telegram">
            <i class="mdi mdi-telegram"></i>
            <span class="hidden sm:inline">Register with Telegram</span>
            <span class="sm:hidden">Telegram</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--auth-icon);
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
}

.password-toggle:hover {
  color: var(--auth-text);
}

.link {
  background: none;
  border: none;
  color: var(--auth-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.link:hover {
  text-decoration: underline;
}

.mx-2 {
  margin: 0 0.5rem;
  color: var(--auth-text-secondary);
}

.hidden {
  display: none;
}

@media (min-width: 640px) {
  .sm\:inline {
    display: inline;
  }
  
  .sm\:hidden {
    display: none;
  }
}
</style>