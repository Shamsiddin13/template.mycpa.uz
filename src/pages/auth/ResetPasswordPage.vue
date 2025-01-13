<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const success = ref(false)

const handleResetPassword = () => {
  success.value = true
  setTimeout(() => {
    router.push('/login')
  }, 3000)
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-logo">
        <span class="auth-logo-text">M</span>goods
      </div>
      <h2 class="auth-title">Reset Password</h2>
      
      <template v-if="!success">
        <p class="auth-description">Enter your email address and we'll send you instructions to reset your password.</p>
        
        <form @submit.prevent="handleResetPassword" class="auth-form">
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

          <button type="submit" class="auth-button">
            <i class="mdi mdi-lock-reset"></i>
            Reset Password
          </button>

          <p class="auth-link">
            Remember your password?
            <a href="/login" @click.prevent="router.push('/login')">Log in</a>
          </p>
        </form>
      </template>

      <template v-else>
        <div class="auth-success">
          <i class="mdi mdi-check-circle"></i>
          <p>Password reset instructions have been sent to your email.</p>
          <p class="auth-redirect">Redirecting to login page...</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.auth-description {
  color: var(--auth-text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.auth-redirect {
  color: var(--auth-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>