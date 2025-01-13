<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'

const isSidebarOpen = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="layout">
    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="isMobile && isSidebarOpen" 
      class="sidebar-overlay"
      @click="toggleSidebar"
    ></div>
    
    <Sidebar 
      class="sidebar" 
      :class="{ 'sidebar-closed': !isSidebarOpen }" 
      :is-open="isSidebarOpen"
    />
    <div class="main-content">
      <Header @toggle-sidebar="toggleSidebar" :is-sidebar-open="isSidebarOpen" />
      <main class="content">
        <slot></slot>
      </main>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.sidebar-closed {
  width: 64px;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 50;
    height: 100vh;
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }
}
</style>