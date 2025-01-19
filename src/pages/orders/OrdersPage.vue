<script setup>
import { ref, onMounted, computed, watch } from 'vue'

// State management
const state = ref({
  orders: [],
  offers: [],
  statuses: [],
  isLoading: true,
  error: null,
  filters: {
    statuses: [],
    offer_ids: [],
    search: ''
  },
  pagination: {
    currentPage: 1,
    perPage: 20,
    totalPages: 1,
    totalItems: 0,
    filteredTotal: 0
  }
})

// Debounce search
let searchTimeout = null

// Computed properties
const paginationRange = computed(() => {
  const { currentPage, totalPages } = state.value.pagination
  const range = []
  const maxButtons = 5
  const start = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  const end = Math.min(totalPages, start + maxButtons - 1)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
})

// Format date
const formatDate = (dateString) => {
  return new Date(dateString.replace(' ', 'T')).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// API call
const fetchOrders = async (page = 1) => {
  try {
    state.value.isLoading = true
    state.value.error = null
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: state.value.pagination.perPage.toString()
    })
    
    // Add filters
    const { statuses, offer_ids, search } = state.value.filters
    
    if (statuses.length) {
      params.append('statuses', statuses.join(','))
    }
    
    if (offer_ids.length) {
      params.append('offer_ids', offer_ids.join(','))
    }

    if (search) {
      params.append('search', search.trim())
    }
    
    const url = `https://api.mgoods.uz/api/store/orders/get?${params.toString()}`
    const token = localStorage.getItem('token')
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.status) {
      state.value.orders = data.data
      state.value.offers = data.filters.offers
      state.value.statuses = data.filters.statuses
      
      // Update pagination
      state.value.pagination = {
        ...state.value.pagination,
        currentPage: data.meta.current_page,
        totalPages: data.meta.last_page,
        totalItems: data.meta.total,
        filteredTotal: data.meta.filtered_total
      }
    } else {
      state.value.error = 'Failed to fetch orders'
    }
  } catch (err) {
    console.error('Error fetching orders:', err)
    state.value.error = 'An error occurred while fetching orders'
  } finally {
    state.value.isLoading = false
  }
}

// Event handlers
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    state.value.pagination.currentPage = 1
    fetchOrders(1)
  }, 300)
}

const handlePageChange = (page) => {
  state.value.pagination.currentPage = page
  fetchOrders(page)
}

const handleFilterChange = (type, value) => {
  const filters = state.value.filters
  const index = filters[type].indexOf(value)
  
  if (index === -1) {
    filters[type].push(value)
  } else {
    filters[type].splice(index, 1)
  }
  
  state.value.pagination.currentPage = 1
  fetchOrders(1)
}

// Get status color
const getStatusColor = (status) => {
  const colors = {
    new: { bg: '#dbeafe', text: '#2563eb' },
    accept: { bg: '#dcfce7', text: '#16a34a' },
    call_late: { bg: '#fef9c3', text: '#ca8a04' },
    cancel: { bg: '#fee2e2', text: '#dc2626' },
    delivered: { bg: '#dcfce7', text: '#16a34a' },
    office: { bg: '#f3e8ff', text: '#9333ea' },
    recall: { bg: '#fef9c3', text: '#ca8a04' },
    returned: { bg: '#fee2e2', text: '#dc2626' },
    send: { bg: '#dbeafe', text: '#2563eb' },
    sold: { bg: '#dcfce7', text: '#16a34a' },
    updated: { bg: '#f3e8ff', text: '#9333ea' },
    brak: { bg: '#fee2e2', text: '#dc2626' }
  }
  
  return colors[status] || { bg: '#f3f4f6', text: '#6b7280' }
}

// Watchers
watch(() => state.value.filters.search, (newValue) => {
  if (newValue !== undefined) {
    handleSearch()
  }
})

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">Orders</h1>
      
      <div class="filters">
        <!-- Search Input -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="mdi mdi-magnify search-icon"></i>
            <input
              type="text"
              v-model="state.filters.search"
              placeholder="Search orders..."
              class="search-input"
            >
            <button 
              v-if="state.filters.search"
              class="clear-search"
              @click="state.filters.search = ''"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
        </div>

        <!-- Offers Filter -->
        <div class="filter-group">
          <label class="filter-label">Offers</label>
          <div class="filter-options">
            <label 
              v-for="offer in state.offers" 
              :key="offer.id"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="offer.id"
                :checked="state.filters.offer_ids.includes(offer.id)"
                @change="handleFilterChange('offer_ids', offer.id)"
              >
              <span>{{ offer.name }}</span>
            </label>
          </div>
        </div>

        <!-- Statuses Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <div class="filter-options">
            <label 
              v-for="{ status, uzbTitle } in state.statuses" 
              :key="status"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="status"
                :checked="state.filters.statuses.includes(status)"
                @change="handleFilterChange('statuses', status)"
              >
              <span class="status-badge" :style="{
                backgroundColor: getStatusColor(status).bg,
                color: getStatusColor(status).text
              }">
                {{ uzbTitle }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="state.error" class="error-message">
      {{ state.error }}
    </div>

    <!-- Loading State -->
    <div v-if="state.isLoading" class="loading-state">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading orders...
    </div>

    <!-- Orders Table -->
    <div v-else-if="state.orders.length > 0" class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Status</th>
            <th>Offer</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="order in state.orders" 
            :key="order.order_no"
            class="order-row"
          >
            <td class="order-no">{{ order.order_no }}</td>
            <td class="status-cell">
              <span 
                class="status-badge" 
                :style="{
                  backgroundColor: getStatusColor(order.status).bg,
                  color: getStatusColor(order.status).text
                }"
              >
                {{ state.statuses.find(s => s.status === order.status)?.uzbTitle || order.status }}
              </span>
            </td>
            <td class="offer-cell">{{ order.offer_name }}</td>
            <td class="comment-cell">{{ order.comment || '-' }}</td>
            <td class="date-cell">{{ formatDate(order.created_at) }}</td>
            <td class="date-cell">{{ formatDate(order.edited_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Showing {{ (state.pagination.currentPage - 1) * state.pagination.perPage + 1 }} 
          to {{ Math.min(state.pagination.currentPage * state.pagination.perPage, state.pagination.filteredTotal) }} 
          of {{ state.pagination.filteredTotal }} entries
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button"
            :disabled="state.pagination.currentPage === 1"
            @click="handlePageChange(1)"
          >
            <i class="mdi mdi-chevron-double-left"></i>
          </button>
          <button 
            class="pagination-button"
            :disabled="state.pagination.currentPage === 1"
            @click="handlePageChange(state.pagination.currentPage - 1)"
          >
            <i class="mdi mdi-chevron-left"></i>
          </button>
          
          <button 
            v-for="page in paginationRange"
            :key="page"
            class="pagination-button"
            :class="{ active: page === state.pagination.currentPage }"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
          
          <button 
            class="pagination-button"
            :disabled="state.pagination.currentPage === state.pagination.totalPages"
            @click="handlePageChange(state.pagination.currentPage + 1)"
          >
            <i class="mdi mdi-chevron-right"></i>
          </button>
          <button 
            class="pagination-button"
            :disabled="state.pagination.currentPage === state.pagination.totalPages"
            @click="handlePageChange(state.pagination.totalPages)"
          >
            <i class="mdi mdi-chevron-double-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="mdi mdi-cart-off"></i>
      <p>No orders found</p>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  background-color: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Search Styles */
.search-container {
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--auth-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.filter-option:hover {
  background-color: var(--border-color);
}

.table-container {
  overflow-x: auto;
  margin: 1rem;
}

.orders-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.orders-table th {
  background-color: var(--bg-secondary);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.order-row {
  transition: all 0.2s ease;
}

.order-row:hover {
  background-color: var(--bg-secondary);
}

.order-no {
  font-family: monospace;
  font-weight: 500;
  color: var(--text-primary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}

.offer-cell {
  font-weight: 500;
  color: var(--text-primary);
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment-cell {
  color: var(--text-secondary);
  font-size: 0.875rem;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-cell {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

.pagination-button.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--text-secondary);
  font-weight: 600;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.error-message {
  margin: 1rem;
  padding: 1rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .filter-group {
    min-width: 100%;
  }

  .orders-table {
    font-size: 0.875rem;
  }

  .offer-cell {
    max-width: 200px;
  }

  .comment-cell {
    max-width: 150px;
  }

  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }
}
</style>