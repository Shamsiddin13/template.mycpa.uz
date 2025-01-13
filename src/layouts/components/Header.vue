<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-sidebar'])
const showProfileMenu = ref(false)
const profileMenuRef = ref(null)
const showNotifications = ref(false)
const notificationsRef = ref(null)
const isDark = ref(localStorage.getItem('theme') === 'dark')

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// Sample notifications data
const notifications = ref([
  {
    id: 1,
    title: 'New Order',
    message: 'You have received a new order #12345',
    time: '5 minutes ago',
    type: 'order',
    read: false
  },
  {
    id: 2,
    title: 'Payment Success',
    message: 'Payment for order #12344 was successful',
    time: '1 hour ago',
    type: 'payment',
    read: false
  },
  {
    id: 3,
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    time: '2 hours ago',
    type: 'system',
    read: true
  }
])

const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false
  }
  if (notificationsRef.value && !notificationsRef.value.contains(event.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Set initial theme from localStorage
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  router.push('/login')
}

  
const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return 'mdi-cart'
    case 'payment':
      return 'mdi-cash'
    case 'system':
      return 'mdi-cog'
    default:
      return 'mdi-bell'
  }
}

const markAsRead = (notification) => {
  notification.read = true
}

const getUnreadCount = () => {
  return notifications.value.filter(n => !n.read).length
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button 
          class="toggle-sidebar-btn"
          @click="$emit('toggle-sidebar')"
          :aria-label="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
        >
          <i class="mdi mdi-menu"></i>
        </button>
      </div>

      <div class="header-actions">
        <div class="action-buttons">
          <button @click="toggleTheme" class="action-btn" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <i :class="isDark ? 'mdi mdi-white-balance-sunny' : 'mdi mdi-moon-waning-crescent'"></i>
          </button>
          
          <div class="notifications-wrapper" ref="notificationsRef">
            <button 
              class="action-btn" 
              @click="showNotifications = !showNotifications"
              :class="{ 'active': showNotifications }"
            >
              <i class="mdi mdi-bell-outline"></i>
              <span v-if="getUnreadCount() > 0" class="notification-badge">{{ getUnreadCount() }}</span>
            </button>

            <!-- Notifications Slideover -->
            <div v-if="showNotifications" class="notifications-panel">
              <div class="notifications-header">
                <h3>Notifications</h3>
                <button class="close-btn" @click="showNotifications = false">
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              
              <div class="notifications-list">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                  @click="markAsRead(notification)"
                >
                  <div class="notification-icon">
                    <i :class="'mdi ' + getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile" ref="profileMenuRef">
          <button class="profile-trigger" @click="showProfileMenu = !showProfileMenu">
            
            <div class="profile-avatar" :class="{ 'has-avatar': user.avatar }">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.name">
              <i v-else class="mdi mdi-account"></i>
            </div>
          </button>
          
          <div v-if="showProfileMenu" class="profile-menu">
            <div class="menu-header">
              <div class="menu-user-info">
                <div class="menu-avatar" :class="{ 'has-avatar': user.avatar }">
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.name">
                  <i v-else class="mdi mdi-account"></i>
                </div>
                <div class="menu-user-details">
                  <span class="menu-title">{{ user.name }}</span>
                </div>
              </div>
            </div>
            <div class="menu-items">
              <a href="#" class="menu-item">
                <i class="mdi mdi-account-circle"></i>
                <span>Profile</span>
              </a>
              <button @click="handleLogout" class="menu-item logout-button">
                <i class="mdi mdi-logout"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 0 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.toggle-sidebar-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.toggle-sidebar-btn i {
  font-size: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover, .action-btn.active {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.action-btn i {
  font-size: 20px;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ff3b3b;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  min-width: 18px;
  text-align: center;
}

.notifications-wrapper {
  position: relative;
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 320px;
  background-color: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-color);
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

.notifications-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.notifications-list {
  overflow-y: auto;
  padding: 0.5rem;
}

.notification-item {
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background-color: var(--bg-secondary);
}

.notification-item.unread {
  background-color: var(--bg-secondary);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  flex-shrink: 0;
}

.notification-content {
  flex-grow: 1;
}

.notification-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.notification-message {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.profile {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.profile-trigger:hover {
  background-color: var(--bg-secondary);
}

.profile-info {
  text-align: right;
}

.profile-name {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  background-color: #ff3b3b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-avatar.has-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.profile-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background-color: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  z-index: 50;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.menu-header {
  border-bottom: 1px solid var(--border-color);
}

.menu-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.menu-avatar {
  width: 40px;
  height: 40px;
  background-color: #ff3b3b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.menu-user-details {
  flex-grow: 1;
}

.menu-title {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}

.menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.menu-item i {
  font-size: 1.25rem;
}

.logout-button {
  color: #dc2626;
}

.logout-button:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .header {
    padding: 0 1rem;
  }

  .profile-info {
    display: none;
  }

  .notifications-panel {
    position: fixed;
    top: 64px;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    border-radius: 0;
    max-height: calc(100vh - 64px);
  }
}
</style>