<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const offer = ref(null)
const isLoading = ref(true)
const error = ref(null)

const fetchOfferDetails = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const token = localStorage.getItem('token')
    const response = await fetch(`https://api.mgoods.uz/api/store/offers/offer/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.status) {
      offer.value = data.data
    } else {
      error.value = 'Failed to fetch offer details'
    }
  } catch (err) {
    console.error('Error fetching offer details:', err)
    error.value = 'An error occurred while fetching offer details'
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

onMounted(() => {
  fetchOfferDetails()
})
</script>

<template>
  <div class="offer-details">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading offer details...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Offer Content -->
    <template v-else-if="offer">
      <!-- Offer Header -->
      <div class="offer-header">
        <div class="offer-image-container">
          <img 
            :src="offer.image" 
            :alt="offer.name"
            class="offer-image"
          >
        </div>
        
        <div class="offer-info">
          <h1 class="offer-title">{{ offer.name }}</h1>
          
          <div class="offer-meta">
            <div class="category-badge">
              <i class="mdi mdi-tag"></i>
              {{ offer.category_name }}
            </div>
            
            <p class="offer-description">{{ offer.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="section products-section">
        <h2 class="section-title">
          <i class="mdi mdi-package-variant"></i>
          Products
        </h2>
        
        <div class="products-grid">
          <div 
            v-for="product in offer.offerProducts" 
            :key="product.id"
            class="product-card"
          >
            <div class="product-image-container">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="product-image"
                loading="lazy"
              >
            </div>
            
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-article">
                <i class="mdi mdi-barcode"></i>
                Article: {{ product.article }}
              </div>
              
              <div class="product-prices">
                <div class="price sell-price">
                  <span class="price-label">Sell Price</span>
                  <span class="price-value">{{ formatPrice(product.sell_price) }}</span>
                </div>
                <div class="price buy-price">
                  <span class="price-label">Buy Price</span>
                  <span class="price-value">{{ formatPrice(product.buy_price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details Section -->
      <div class="section payment-section">
        <h2 class="section-title">
          <i class="mdi mdi-cash-multiple"></i>
          Payment Details
        </h2>
        
        <div class="table-container">
          <table class="details-table">
            <thead>
              <tr>
                <th>Sell Price</th>
                <th>Web Payment</th>
                <th>2+1 Option</th>
                <th>PVZ</th>
                <th>Free Option 1</th>
                <th>Free Option 2</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pay, index) in offer.offerPays" :key="index">
                <td>{{ formatPrice(pay.sell_price) }}</td>
                <td>{{ formatPrice(pay.pay_web) }}</td>
                <td>
                  <span class="status-badge" :class="pay.two_plus_one === 'Bor' ? 'available' : 'unavailable'">
                    {{ pay.two_plus_one }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="pay.pvz === 'Bor' ? 'available' : 'unavailable'">
                    {{ pay.pvz }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="pay.free1 === 'Bor' ? 'available' : 'unavailable'">
                    {{ pay.free1 }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="pay.free2 === 'Bor' ? 'available' : 'unavailable'">
                    {{ pay.free2 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="mdi mdi-alert"></i>
      <p>No offer details found</p>
    </div>
  </div>
</template>

<style scoped>
.offer-details {
  padding: 1.5rem;
}

.offer-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  background-color: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.offer-image-container {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-secondary);
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.offer-image:hover {
  transform: scale(1.05);
}

.offer-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.offer-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.offer-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: 9999px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  width: fit-content;
}

.offer-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  flex-grow: 1;
}

.section {
  margin-top: 2rem;
  background-color: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-image-container {
  height: 240px;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.product-article {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background-color: var(--bg-primary);
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.product-prices {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
}

.price-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.price-value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.details-table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.details-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.details-table td {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.details-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.available {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.unavailable {
  background-color: #fee2e2;
  color: #dc2626;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  gap: 0.5rem;
  font-size: 1.125rem;
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
  .offer-details {
    padding: 1rem;
  }

  .offer-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .offer-image-container {
    width: 100%;
    height: 240px;
  }

  .offer-title {
    font-size: 1.5rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    max-width: 100%;
  }

  .table-container {
    margin: 0 -1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .details-table {
    font-size: 0.75rem;
  }

  .details-table th,
  .details-table td {
    padding: 0.75rem;
  }
}
</style>