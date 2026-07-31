<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Card from '~/components/Card.vue'
import Dropdown from '~/components/Dropdown.vue'
import FullscreenLoader from '~/components/FullscreenLoader.vue'
import { SORT_OPTIONS, TAG_DEFS, useCatalog } from '~/composables/useCatalog'
import type { TabKey } from '~/types/catalog'

const {
  searchQuery,
  activeTab,
  sortBy,
  selectedDecade,
  tagFilters,
  currentPage,
  items,
  meta,
  decadeOptions,
  retry,
  isFirstLoad,
  isRefreshing,
  isWakingUp,
  hasFailed,
  hasActiveFilters,
  clearAll,
  toggleTag,
} = useCatalog()

const searchInput = ref<HTMLInputElement | null>(null)
const showScrollTop = ref(false)
const showAllPages = ref(false)

const fmt = (n: number) => n.toLocaleString('ru-RU')

// Хоткеи: "/" — фокус поиска, Esc — очистить и снять фокус
const onGlobalKey = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== searchInput.value) {
    e.preventDefault()
    searchInput.value?.focus()
  } else if (e.key === 'Escape' && document.activeElement === searchInput.value) {
    searchQuery.value = ''
    searchInput.value?.blur()
  }
}

const onScroll = () => { showScrollTop.value = window.scrollY > 600 }

onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
  window.removeEventListener('scroll', onScroll)
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const goToPage = (page: number) => {
  currentPage.value = page
  showAllPages.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeTab = (tab: TabKey) => {
  activeTab.value = tab
  showAllPages.value = false
}

const clearSearch = () => { searchQuery.value = '' }

const totalPages = computed(() => meta.value?.totalPages ?? 1)

const visiblePages = computed(() => {
  const total = totalPages.value
  if (showAllPages.value) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | string)[] = []
  const current = currentPage.value
  pages.push(1)
  const rangeStart = Math.max(2, current - 2)
  const rangeEnd = Math.min(total - 1, current + 2)
  if (rangeStart > 2) pages.push('...')
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
  if (rangeEnd < total - 1) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
})
</script>

<template>
  <main class="catalog-container">
    <FullscreenLoader :visible="isFirstLoad" :waking-up="isWakingUp" />

    <!-- Попытки разбудить бэкенд закончились: каталог живёт только там,
         показывать нечего -->
    <div v-if="hasFailed" class="api-error">
      <div class="empty-icon">📡</div>
      <p class="empty-title">Каталог не загрузился</p>
      <p class="empty-sub">Сервер не отвечает. Попробуйте ещё раз чуть позже.</p>
      <button class="empty-reset" @click="retry()">Повторить</button>
    </div>

    <template v-else-if="meta">
      <div class="catalog-head">
        <h2 class="catalog-title">Каталог</h2>
        <span class="catalog-sub">{{ meta.total }} из {{ meta.stats.total }}</span>
      </div>

      <!-- Статистика коллекции -->
      <section class="stats">
        <div class="stat-items">
          <div class="stat">
            <span class="stat-label">Куплено</span>
            <span class="stat-value">{{ meta.stats.purchased }} <small>/ {{ meta.stats.total }}</small></span>
          </div>
          <div class="stat">
            <span class="stat-label">Потрачено</span>
            <span class="stat-value accent-spent">{{ fmt(meta.stats.spentSum) }} ₽</span>
          </div>
          <div class="stat">
            <span class="stat-label">Осталось</span>
            <span class="stat-value">{{ fmt(meta.stats.remainingSum) }} ₽</span>
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-head">
            <span>Прогресс коллекции</span>
            <span class="progress-pct">{{ meta.stats.progressPct }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: meta.stats.progressPct + '%' }"></div>
          </div>
        </div>
      </section>

      <!-- Поиск: уходит на бэкенд с задержкой в 350 мс -->
      <div class="search-bar" :class="{ 'has-value': searchQuery }">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Поиск по альбому или исполнителю…"
        />
        <kbd v-if="!searchQuery" class="search-kbd">/</kbd>
        <button v-if="searchQuery" class="search-clear" @click="clearSearch" aria-label="Очистить">✕</button>
      </div>

      <!-- Фильтры -->
      <div class="filter-row">
        <div class="chips">
          <button
              v-for="t in TAG_DEFS"
              :key="t.key"
              class="chip"
              :class="{ active: tagFilters.has(t.key) }"
              @click="toggleTag(t.key)"
          >
            {{ t.label }}
          </button>
        </div>
        <div class="filter-right">
          <Dropdown v-model="selectedDecade" :options="decadeOptions" min-width="148px" />
          <button v-if="hasActiveFilters" class="clear-all" @click="clearAll">Сбросить всё</button>
        </div>
      </div>

      <!-- Табы + сортировка -->
      <div class="controls-row">
        <div class="tabs">
          <button :class="['tab', { active: activeTab === 'all' }]" @click="changeTab('all')">
            Все <span class="tab-count">{{ meta.counts.all }}</span>
          </button>
          <button :class="['tab', { active: activeTab === 'not-purchased' }]" @click="changeTab('not-purchased')">
            Не купленные <span class="tab-count">{{ meta.counts.notPurchased }}</span>
          </button>
          <button :class="['tab', { active: activeTab === 'purchased' }]" @click="changeTab('purchased')">
            Купленные <span class="tab-count">{{ meta.counts.purchased }}</span>
          </button>
        </div>

        <Dropdown v-model="sortBy" :options="SORT_OPTIONS" min-width="218px" />
      </div>

      <!-- is-refreshing: страница уже показана, подгружается следующая -->
      <div v-if="items.length" class="vinyl-list" :class="{ 'is-refreshing': isRefreshing }">
        <Card
            v-for="(card, i) in items"
            :key="card.id"
            :card="card"
            :query="searchQuery"
            class="vinyl-item"
            :style="{ '--i': i }"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-title">Ничего не найдено</p>
        <p class="empty-sub">Попробуйте изменить запрос или фильтры</p>
        <button v-if="hasActiveFilters" class="empty-reset" @click="clearAll">Сбросить всё</button>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <div class="pagination-pages">
          <button
              v-for="(page, index) in visiblePages"
              :key="index"
              :class="['page-button', { active: page === currentPage, dots: page === '...' }]"
              @click="page === '...' ? showAllPages = true : goToPage(page as number)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </template>

    <!-- Кнопка «наверх» -->
    <Transition name="scrolltop">
      <button v-if="showScrollTop" class="scroll-top" @click="scrollToTop" aria-label="Наверх">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </Transition>
  </main>
</template>

<style scoped lang="scss">
.catalog-container {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 48px;
  flex: 1;

  @media (max-width: 1024px) {
    padding: 28px 16px 40px;
  }

  @media (max-width: 480px) {
    padding: 20px 12px 32px;
  }
}

.catalog-head {
  display: flex;
  align-items: baseline;
  gap: 10px 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.catalog-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
}

.catalog-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
}

// Ошибка загрузки каталога
.api-error {
  text-align: center;
  padding: 80px 20px;
}

// Stats
.stats {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 20px 24px;
  margin-bottom: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    padding: 18px;
  }
}

.stat-items {
  display: flex;
  gap: 28px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 16px;
    justify-content: space-between;
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);

  small {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  &.accent-spent {
    color: var(--green);
  }

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
}

.progress-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--text-soft);
}

.progress-pct {
  font-weight: 700;
  color: var(--text);
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: var(--surface-2);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent-grad);
  box-shadow: 0 0 12px -2px rgba(124, 92, 255, 0.7);
  transition: width 0.6s var(--ease);
}

// Search
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);

  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color 0.3s var(--ease);

  .search-bar:focus-within & {
    color: var(--accent);
  }
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  padding: 15px 14px;

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 480px) {
    font-size: 0.92rem;
    padding: 13px 10px;
  }
}

.search-kbd {
  flex-shrink: 0;
  margin-right: 14px;
  padding: 2px 9px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;

  @media (max-width: 480px) {
    display: none;
  }
}

.search-clear {
  flex-shrink: 0;
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s var(--ease);

  &:hover {
    background: var(--surface-hover);
    color: var(--text);
  }
}

// Filters
.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-soft);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.22s var(--ease);

  &:hover {
    color: var(--text);
    border-color: var(--border-strong);
  }

  &.active {
    color: var(--text);
    background: var(--accent-soft);
    border-color: var(--accent);
  }
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.clear-all {
  padding: 8px 14px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.22s var(--ease);

  &:hover {
    color: var(--danger);
    background: rgba(255, 84, 112, 0.1);
  }
}

// --- Мобильная раскладка фильтров ---
@media (max-width: 640px) {
  .filter-row,
  .controls-row {
    margin-bottom: 14px;
  }

  // Чипы тегов — одной строкой с горизонтальным скроллом
  .chips {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    // лёгкий отступ, чтобы тени/ховеры не обрезались
    padding: 2px;
    margin: -2px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .chip {
    flex: 0 0 auto;
  }

  // Табы — в столбик на всю ширину
  .tabs {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .tab {
    width: 100%;
    justify-content: space-between;
  }

  // Дропдауны (год и сортировка) — на всю ширину, аккуратными блоками
  .filter-right {
    width: 100%;
  }

  .filter-right .dd {
    flex: 1;
    min-width: 0;
  }

  .controls-row .dd {
    width: 100%;
  }
}

// Controls
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s var(--ease);

  &:hover:not(.active) {
    color: var(--text);
    border-color: var(--border-strong);
    transform: translateY(-1px);
  }

  &.active {
    color: #fff;
    background: var(--accent-grad);
    border-color: transparent;
    box-shadow: 0 8px 22px -8px rgba(124, 92, 255, 0.7);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.82rem;
  }
}

.tab-count {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);

  .active & {
    background: rgba(255, 255, 255, 0.22);
  }
}

// Grid
.vinyl-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 22px;
  transition: opacity 0.2s var(--ease);

  // Подгружается следующая страница — список слегка гаснет
  &.is-refreshing {
    opacity: 0.45;
    pointer-events: none;
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.vinyl-item {
  animation: cardIn 0.5s var(--ease) both;
  animation-delay: calc(var(--i) * 35ms);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Empty
.empty-state {
  text-align: center;
  padding: 80px 20px;
  animation: cardIn 0.4s var(--ease) both;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.8;
}

.empty-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 6px;
}

.empty-sub {
  color: var(--text-muted);
  margin: 0 0 20px;
}

.empty-reset {
  padding: 10px 22px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
  color: var(--text);
  font-family: inherit;
  font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s var(--ease);

  &:hover {
    background: var(--accent);
    color: #fff;
  }
}

// Pagination
.pagination {
  display: flex;
  justify-content: center;
  padding: 40px 0 8px;
}

.pagination-pages {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-button {
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.25s var(--ease);

  &:hover:not(.active):not(.dots) {
    color: var(--text);
    border-color: var(--border-strong);
    transform: translateY(-2px);
  }

  &.active {
    color: #fff;
    background: var(--accent-grad);
    border-color: transparent;
    cursor: default;
  }

  &.dots {
    border: none;
    background: transparent;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    min-width: 38px;
    height: 38px;
    font-size: 0.85rem;
  }
}

// Scroll top
.scroll-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 60;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.25s var(--ease);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--accent);
    border-color: transparent;
    color: #fff;
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    right: 16px;
    bottom: 16px;
    width: 44px;
    height: 44px;
  }
}

.scrolltop-enter-active,
.scrolltop-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}
.scrolltop-enter-from,
.scrolltop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
</style>
