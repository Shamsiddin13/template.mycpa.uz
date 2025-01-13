<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const isStatsOpen = ref(false)
const isSettingsOpen = ref(false)

const toggleStats = () => {
  isStatsOpen.value = !isStatsOpen.value
}

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="logo-container">
      <h1 class="logo" :class="{ 'logo-collapsed': !isOpen }">
        <template v-if="isOpen">Mgoods</template>
        <template v-else>M</template>
      </h1>
    </div>
    <nav class="nav">
      <ul class="nav-list">
        <!-- Asosiy -->
        <li class="nav-item">
          <a href="#" class="nav-link active">
            <div class="nav-link-content">
              <i class="mdi mdi-view-dashboard"></i>
              <span v-if="isOpen">Asosiy</span>
            </div>
          </a>
        </li>

        <!-- Buyurtmalar -->
        <li class="nav-item">
          <a href="#" class="nav-link">
            <div class="nav-link-content">
              <i class="mdi mdi-cart"></i>
              <span v-if="isOpen">Buyurtmalar</span>
            </div>
            <span v-if="isOpen" class="nav-badge">5</span>
          </a>
        </li>

        <!-- Offerlar -->
        <li class="nav-item">
          <a href="#" class="nav-link">
            <div class="nav-link-content">
              <i class="mdi mdi-gift-outline"></i>
              <span v-if="isOpen">Offerlar</span>
            </div>
          </a>
        </li>

        <!-- Oqim -->
        <li class="nav-item">
          <a href="#" class="nav-link">
            <div class="nav-link-content">
              <i class="mdi mdi-trending-up"></i>
              <span v-if="isOpen">Oqim</span>
            </div>
          </a>
        </li>

        <!-- Moliya -->
        <li class="nav-item">
          <a href="#" class="nav-link">
            <div class="nav-link-content">
              <i class="mdi mdi-currency-usd"></i>
              <span v-if="isOpen">Moliya</span>
            </div>
          </a>
        </li>

        <!-- Statistika with submenu -->
        <li class="nav-item">
          <div class="nav-link with-submenu" @click="toggleStats" :class="{ active: isStatsOpen }">
            <div class="nav-link-content">
              <i class="mdi mdi-chart-bar"></i>
              <span v-if="isOpen">Statistika</span>
            </div>
            <span v-if="isOpen" class="arrow" :class="{ 'arrow-down': isStatsOpen }">
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
          <ul v-show="isStatsOpen && isOpen" class="submenu">
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-gift"></i>
                <span v-if="isOpen">Offer</span>
              </a>
            </li>
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-chart-line"></i>
                <span v-if="isOpen">Oqim</span>
              </a>
            </li>
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-calendar-today"></i>
                <span v-if="isOpen">Kunlik</span>
              </a>
            </li>
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-scale-balance"></i>
                <span v-if="isOpen">Foyda & Zarar</span>
              </a>
            </li>
          </ul>
        </li>

        <!-- Settings with submenu -->
        <li class="nav-item">
          <div class="nav-link with-submenu" @click="toggleSettings" :class="{ active: isSettingsOpen }">
            <div class="nav-link-content">
              <i class="mdi mdi-cog"></i>
              <span v-if="isOpen">Settings</span>
            </div>
            <span v-if="isOpen" class="arrow" :class="{ 'arrow-down': isSettingsOpen }">
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
          <ul v-show="isSettingsOpen && isOpen" class="submenu">
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-api"></i>
                <span v-if="isOpen">API</span>
              </a>
            </li>
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-frequently-asked-questions"></i>
                <span v-if="isOpen">FAQ</span>
              </a>
            </li>
            <li class="submenu-item">
              <a href="#" class="submenu-link">
                <i class="mdi mdi-telegram"></i>
                <span v-if="isOpen">Connect to Telegram</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow-x: hidden;
  width: 64px;
}

.sidebar-open {
  width: 250px;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  padding: 0 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff3b3b;
  white-space: nowrap;
}

.logo-collapsed {
  font-size: 1.75rem;
}

.nav {
  padding: 1rem 0.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  gap: 0.5rem;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
  justify-content: center;
}

.sidebar-open .nav-link-content {
  justify-content: flex-start;
}

.nav-link-content i {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
}

.nav-badge {
  background-color: #ff3b3b;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  min-width: 18px;
  text-align: center;
}

.with-submenu {
  cursor: pointer;
}

.arrow {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.arrow i {
  font-size: 1.25rem;
}

.arrow-down {
  transform: rotate(90deg);
}

.submenu {
  list-style: none;
  padding-left: 2.5rem;
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  white-space: nowrap;
}

.submenu-link i {
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

.submenu-link:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 50;
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }
}
</style>