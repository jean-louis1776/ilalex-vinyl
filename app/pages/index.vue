<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Card from '~/components/Card.vue'
import { VinylList } from '~/data/vinyl-list'

const STORAGE_KEY = 'vinyl-purchased-items'
const ITEMS_PER_PAGE = 20

const purchasedItems = ref<Set<number>>(new Set())
const currentPage = ref(1) 
const showAllPages = ref(false)
const activeTab = ref<'all' | 'not-purchased' | 'purchased'>('all')
const sortBy = ref<'default' | 'price-asc'>('default')

// Загрузка из localStorage при монтировании
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedArray = JSON.parse(stored) as number[]
        purchasedItems.value = new Set(parsedArray)
      }
    } catch (error) {
      console.error('Ошибка загрузки купленных винилов из localStorage:', error)
    }
  }
})

// Сохранение в localStorage при изменении
watch(purchasedItems, (newValue) => {
  if (typeof window !== 'undefined') {
    try {
      const arrayToStore = Array.from(newValue)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayToStore))
    } catch (error) {
      console.error('Ошибка сохранения купленных винилов в localStorage:', error)
    }
  }
}, { deep: true })

const togglePurchased = (id: number) => {
  const newSet = new Set(purchasedItems.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  purchasedItems.value = newSet
}

const isPurchased = (id: number) => {
  return purchasedItems.value.has(id)
}

// Извлечение года из названия (последние 4 цифры)
const extractYear = (name: string): number => {
  const yearMatch = name.match(/(\d{4})[^\d]*$/)
  return yearMatch?.[1] ? parseInt(yearMatch[1]) : 9999
}

// Фильтрованный и отсортированный список
const filteredVinylList = computed(() => {
  const sorted = [...VinylList].sort((a, b) => {
    const aIsPurchased = isPurchased(a.id)
    const bIsPurchased = isPurchased(b.id)

    // 1. Купленные в конец (всегда)
    if (aIsPurchased && !bIsPurchased) return 1
    if (!aIsPurchased && bIsPurchased) return -1

    // 2. Important в начало (всегда, независимо от сортировки)
    if (a.important && !b.important) return -1
    if (!a.important && b.important) return 1

    // 3. Применяем выбранную сортировку
    if (sortBy.value === 'price-asc') {
      // Сортировка по цене (возрастание)
      const priceA = a.price || 0
      const priceB = b.price || 0
      if (priceA !== priceB) return priceA - priceB
      
      // Если цены равны - по артистам
      return a.artist.localeCompare(b.artist, 'ru')
    } else {
      // Сортировка по умолчанию (как было)
      const artistCompare = a.artist.localeCompare(b.artist, 'ru')
      if (artistCompare !== 0) return artistCompare

      // У одного артиста - сортировка по году
      const yearA = extractYear(a.name)
      const yearB = extractYear(b.name)
      return yearA - yearB
    }
  })

  // Применяем фильтр по табам
  if (activeTab.value === 'not-purchased') {
    return sorted.filter(item => !isPurchased(item.id))
  } else if (activeTab.value === 'purchased') {
    return sorted.filter(item => isPurchased(item.id))
  }
  
  return sorted
})

// Пагинация
const totalPages = computed(() => Math.ceil(filteredVinylList.value.length / ITEMS_PER_PAGE))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredVinylList.value.slice(start, end)
})

const goToPage = (page: number) => {
  currentPage.value = page
  showAllPages.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeTab = (tab: 'all' | 'not-purchased' | 'purchased') => {
  activeTab.value = tab
  currentPage.value = 1
  showAllPages.value = false
}

const changeSorting = (sort: 'default' | 'price-asc') => {
  sortBy.value = sort
  currentPage.value = 1
}

const visiblePages = computed(() => {
  if (showAllPages.value) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  const current = currentPage.value
  const total = totalPages.value

  // Всегда показываем первую страницу
  pages.push(1)

  // Определяем диапазон видимых страниц (2 до и 2 после текущей)
  const rangeStart = Math.max(2, current - 2)
  const rangeEnd = Math.min(total - 1, current + 2)

  // Добавляем троеточие после первой страницы, если есть разрыв
  if (rangeStart > 2) {
    pages.push('...')
  }

  // Добавляем страницы в диапазоне
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Добавляем троеточие перед последней страницей, если есть разрыв
  if (rangeEnd < total - 1) {
    pages.push('...')
  }

  // Всегда показываем последнюю страницу (если она не первая)
  if (total > 1) {
    pages.push(total)
  }

  return pages
})

// Подсчет количества для табов
const notPurchasedCount = computed(() => {
  return VinylList.filter(item => !isPurchased(item.id)).length
})

const purchasedCount = computed(() => {
  return VinylList.filter(item => isPurchased(item.id)).length
})
</script>

<template>
  <div class="catalog-container">
    <h2 class="catalog-title">Каталог</h2>

    <div class="controls-row">
      <div class="tabs">
        <button
            :class="['tab', { active: activeTab === 'all' }]"
            @click="changeTab('all')"
        >
          Все <span class="tab-count">{{ VinylList.length }}</span>
        </button>
        <button
            :class="['tab', { active: activeTab === 'not-purchased' }]"
            @click="changeTab('not-purchased')"
        >
          Не купленные <span class="tab-count">{{ notPurchasedCount }}</span>
        </button>
        <button
            :class="['tab', { active: activeTab === 'purchased' }]"
            @click="changeTab('purchased')"
        >
          Купленные <span class="tab-count">{{ purchasedCount }}</span>
        </button>
      </div>

      <div class="sort-dropdown">
        <select 
          v-model="sortBy" 
          class="sort-select"
          @change="changeSorting(sortBy)"
        >
          <option value="default">По умолчанию</option>
          <option value="price-asc">По возрастанию цены</option>
        </select>
      </div>
    </div>

    <div class="vinyl-list">
      <Card
          v-for="card in paginatedList"
          :key="card.id"
          :card="card"
          :is-purchased="isPurchased(card.id)"
          @toggle-purchased="togglePurchased"
      />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <span class="pagination-label">Страницы:</span>
      <div class="pagination-pages">
        <button
            v-for="(page, index) in visiblePages"
            :key="index"
            :class="['page-button', {
              active: page === currentPage,
              dots: page === '...'
            }]"
            @click="page === '...' ? showAllPages = true : goToPage(page as number)"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog-container {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 1024px) {
    padding: 0 16px;
  }

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px;
  }
}

.catalog-title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 32px 0 24px;
  color: inherit;

  @media (max-width: 768px) {
    margin: 24px 0 16px;
  }
}

.vinyl-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  padding-bottom: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
}

.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 32px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    padding: 24px 0;
  }
}

.pagination-label {
  font-size: 1rem;
  font-weight: 500;
  color: inherit;
}

.pagination-pages {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.page-button {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.active):not(.dots) {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.25);
    font-weight: 700;
    cursor: default;
  }

  &.dots {
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
}

.tabs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;

  @media (max-width: 768px) {
    gap: 12px;
  }
}

.tab {
  padding: 10px 20px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
    gap: 6px;
  }
}

.tab-count {
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  min-width: 28px;
  text-align: center;

  .active & {
    background: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 2px 8px;
    min-width: 24px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 1px 6px;
  }
}

.sort-dropdown {
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid rgba(255, 255, 255, 0.7);
    pointer-events: none;
    transition: border-top-color 0.2s ease;
  }

  &:hover::after {
    border-top-color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    &::after {
      right: 12px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 480px) {
    &::after {
      right: 10px;
    }
  }
}

.sort-select {
  padding: 10px 40px 10px 16px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  min-width: 220px;

  &::-ms-expand {
    display: none;
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 8px 36px 8px 12px;
    font-size: 0.9rem;
    min-width: 180px;
    background-position: right 12px center;
  }

  @media (max-width: 480px) {
    padding: 6px 32px 6px 10px;
    font-size: 0.85rem;
    min-width: 100%;
    background-position: right 10px center;
  }
}

</style>