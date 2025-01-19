<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const offers = ref([])
const categories = ref([])
const statuses = ref([])
const isLoading = ref(true)
const error = ref(null)

// Filter states
const selectedCategories = ref([])
const selectedStatuses = ref([])

// Pagination
const currentPage = ref(1)
const perPage = ref(20)
const totalPages = ref(1)
const totalItems = ref(0)

const fetchOffers = async (page = 1) => {
  try {
    isLoading.value = true
    error.value = null
    
    let url = `https://api.mgoods.uz/api/store/offers/get?page=${page}&per_page=${perPage.value}`
    const params = new URLSearchParams()
    
    if (selectedCategories.value.length > 0) {
      params.append('categories', selectedCategories.value.join(','))
    }
    
    if (selectedStatuses.value.length > 0) {
      params.append('statuses', selectedStatuses.value.join(','))
    }
    
    if (params.toString()) {
      url += `&${params.toString()}`
    }

    const token = localStorage.getItem('token')
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.status) {
      offers.value = data.data
      categories.value = data.filters.categories
      statuses.value = data.filters.statuses
      
      // Update pagination
      currentPage.value = data.meta.current_page
      totalPages.value = data.meta.last_page
      totalItems.value = data.meta.total
    } else {
      error.value = 'Failed to fetch offers'
    }
  } catch (err) {
    console.error('Error fetching offers:', err)
    error.value = 'An error occurred while fetching offers'
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOffers(page)
}

const paginationRange = computed(() => {
  const range = []
  const maxButtons = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxButtons / 2))
  const end = Math.min(totalPages.value, start + maxButtons - 1)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
})

const handleCategoryChange = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId)
  if (index === -1) {
    selectedCategories.value.push(categoryId)
  } else {
    selectedCategories.value.splice(index, 1)
  }
  currentPage.value = 1
  fetchOffers(1)
}

const handleStatusChange = (status) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index === -1) {
    selectedStatuses.value.push(status)
  } else {
    selectedStatuses.value.splice(index, 1)
  }
  currentPage.value = 1
  fetchOffers(1)
}

const viewOfferDetails = (offerId) => {
  router.push(`/offers/${offerId}`)
}

onMounted(() => {
  fetchOffers()
})
</script>

<template>
  <div class="offers-page">
    <div class="page-header">
      <h1 class="page-title">Offers</h1>
      
      <div class="filters">
        <!-- Categories Filter -->
        <div class="filter-group">
          <label class="filter-label">Categories</label>
          <div class="filter-options">
            <label 
              v-for="category in categories" 
              :key="category.id"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="category.id"
                :checked="selectedCategories.includes(category.id)"
                @change="handleCategoryChange(category.id)"
              >
              <span>{{ category.name }}</span>
            </label>
          </div>
        </div>

        <!-- Statuses Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <div class="filter-options">
            <label 
              v-for="{ status } in statuses" 
              :key="status"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="status"
                :checked="selectedStatuses.includes(status)"
                @change="handleStatusChange(status)"
              >
              <span>{{ status }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading offers...
    </div>

    <!-- Offers Table -->
    <div v-else-if="offers.length > 0" class="table-container">
      <table class="offers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rasmi</th>
            <th>Nomi</th>
            <th>Kategoriya</th>
            <th>Holati</th>
            <th>Tavsif</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="offer in offers" 
            :key="offer.id"
            @click="viewOfferDetails(offer.id)"
            class="offer-row"
          >
            <td class="id-cell">{{ offer.id }}</td>
            <td class="image-cell">
              <div class="image-wrapper">
                <img 
                  :src="offer.img" 
                  :alt="offer.name"
                  class="offer-image"
                  loading="lazy"
                >
              </div>
            </td>
            <td class="name-cell">{{ offer.name }}</td>
            <td class="category-cell">{{ offer.category_name }}</td>
            <td class="status-cell">
              <span class="status-badge" :class="offer.status">
                {{ offer.status }}
              </span>
            </td>
            <td class="desc-cell">{{ offer.desc }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, totalItems) }} of {{ totalItems }} entries
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="handlePageChange(1)"
          >
            <i class="mdi mdi-chevron-double-left"></i>
          </button>
          <button 
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <i class="mdi mdi-chevron-left"></i>
          </button>
          
          <button 
            v-for="page in paginationRange"
            :key="page"
            class="pagination-button"
            :class="{ active: page === currentPage }"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
          
          <button 
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            <i class="mdi mdi-chevron-right"></i>
          </button>
          <button 
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(totalPages)"
          >
            <i class="mdi mdi-chevron-double-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="mdi mdi-package-variant"></i>
      <p>No offers found</p>
    </div>
  </div>
</template>

<style scoped>
.offers-page {
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
  gap: 1.5rem;
  flex-wrap: wrap;
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

.offers-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.offers-table th {
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

.offers-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.offer-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.offer-row:hover {
  background-color: var(--bg-secondary);
  transform: translateY(-1px);
}

.image-cell {
  width: 80px;
}

.image-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.offer-row:hover .offer-image {
  transform: scale(1.05);
}

.name-cell {
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
}

.status-badge.active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.new {
  background-color: #dbeafe;
  color: #2563eb;
}

.desc-cell {
  color: var(--text-secondary);
  font-size: 0.875rem;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  .offers-table {
    font-size: 0.875rem;
  }

  .image-wrapper {
    width: 48px;
    height: 48px;
  }

  .desc-cell {
    max-width: 200px;
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