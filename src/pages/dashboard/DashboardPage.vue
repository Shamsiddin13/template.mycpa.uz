<script setup>
import { ref } from 'vue'

const stats = ref([
  { title: 'Total Orders', value: '1,234', icon: 'mdi-cart', color: '#4f46e5' },
  { title: 'Revenue', value: '$12,345', icon: 'mdi-currency-usd', color: '#10b981' },
  { title: 'Active Offers', value: '25', icon: 'mdi-gift-outline', color: '#f59e0b' },
  { title: 'Conversion Rate', value: '3.2%', icon: 'mdi-trending-up', color: '#ef4444' }
])
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Dashboard</h1>
    
    <div class="stats-grid">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <div class="stat-icon" :style="{ backgroundColor: stat.color + '15', color: stat.color }">
          <i :class="'mdi ' + stat.icon"></i>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-title">{{ stat.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 24px;
}

.stat-info {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>