<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
  if (!isAuthenticated.value && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
.page-content {
  padding: 1rem;
}
</style>