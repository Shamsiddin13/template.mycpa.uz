<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('user', JSON.stringify({
    name: name.value,
    username: username.value,
    email: email.value,
    avatar: null,
    role: 'User'
  }))
  router.push('/')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-logo">
        <span class="auth-logo-text">M</span>goods
      </div>
      <h2 class="auth-title">Create your account</h2>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="auth-group">
          <label class="auth-label">Full Name</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-account auth-input-icon"></i>
            <input 
              type="text" 
              v-model="name"
              placeholder="Enter your full name"
              required
              class="auth-input"
            >
          </div>
        </div>

        <div class="auth-group">
          <label class="auth-label">Email</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-email auth-input-icon"></i>
            <input 
              type="email" 
              v-model="email"
              placeholder="Enter your email"
              required
              class="auth-input"
            >
          </div>
        </div>

        <div class="auth-group">
          <label class="auth-label">Username</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-account-circle auth-input-icon"></i>
            <input 
              type="text" 
              v-model="username"
              placeholder="Choose a username"
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
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="auth-group">
          <label class="auth-label">Confirm Password</label>
          <div class="auth-input-wrapper">
            <i class="mdi mdi-lock-check auth-input-icon"></i>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm password"
              required
              class="auth-input"
            >
            <button 
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button type="submit" class="auth-button">
          <i class="mdi mdi-account-plus"></i>
          Create Account
        </button>

        <p class="auth-link">
          Already have an account?
          <a href="/login" @click.prevent="router.push('/login')">Log in</a>
        </p>
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
</style>