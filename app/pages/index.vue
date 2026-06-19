<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Card from '~/components/Card.vue'
import Dropdown from '~/components/Dropdown.vue'
import { VinylList } from '~/data/vinyl-list'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'
type TagKey = 'important' | 'original' | 'repress' | 'sealed'

const STORAGE_KEY = 'vinyl-purchased-items'
const PIN_KEY = 'vinyl-owner-pin'
const ITEMS_PER_PAGE = 20

const purchasedItems = ref<Set<number>>(new Set())
const currentPage = ref(1)
const showAllPages = ref(false)
const activeTab = ref<'all' | 'not-purchased' | 'purchased'>('all')
const sortBy = ref<SortKey>('default')
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// Фильтры
const tagFilters = ref<Set<TagKey>>(new Set())
const selectedDecade = ref('all')

// Кнопка «наверх»
const showScrollTop = ref(false)

// Синхронизация / режим владельца
const isOwner = ref(false)
const ownerPin = ref('')
const showPinInput = ref(false)
const pinDraft = ref('')
const pinError = ref(false)
const syncStatus = ref<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle')

const sortOptions = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'year-asc', label: 'Год: сначала старые' },
  { value: 'year-desc', label: 'Год: сначала новые' },
]

const tagDefs: { key: TagKey; label: string }[] = [
  { key: 'important', label: 'В первую очередь' },
  { key: 'original', label: 'Оригинал' },
  { key: 'repress', label: 'Переиздание' },
  { key: 'sealed', label: 'Запечатан' },
]

// --- Синхронизация состояния с URL (?q=&tab=&sort=&decade=&tags=&page=) ---
const route = useRoute()
const router = useRouter()

const initFromQuery = () => {
  const q = route.query
  if (typeof q.q === 'string') searchQuery.value = q.q
  if (q.tab === 'all' || q.tab === 'not-purchased' || q.tab === 'purchased') activeTab.value = q.tab
  if (typeof q.sort === 'string' && sortOptions.some(o => o.value === q.sort)) sortBy.value = q.sort as SortKey
  if (typeof q.decade === 'string') selectedDecade.value = q.decade
  if (typeof q.tags === 'string') {
    const valid = tagDefs.map(t => t.key)
    tagFilters.value = new Set(q.tags.split(',').filter(t => valid.includes(t as TagKey)) as TagKey[])
  }
  if (typeof q.page === 'string') {
    const p = parseInt(q.page)
    if (p > 0) currentPage.value = p
  }
}
initFromQuery()

const syncToQuery = () => {
  const query: Record<string, string> = {}
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
  if (activeTab.value !== 'all') query.tab = activeTab.value
  if (sortBy.value !== 'default') query.sort = sortBy.value
  if (selectedDecade.value !== 'all') query.decade = selectedDecade.value
  if (tagFilters.value.size) query.tags = [...tagFilters.value].join(',')
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.replace({ query })
}

// Извлечение года из названия (последние 4 цифры)
const extractYear = (name: string): number => {
  const yearMatch = name.match(/(\d{4})[^\d]*$/)
  return yearMatch?.[1] ? parseInt(yearMatch[1]) : 9999
}

const getYear = (item: typeof VinylList[number]): number =>
  item.original || item.repress || extractYear(item.name)

// Десятилетия для фильтра
const decadeOptions = computed(() => {
  const decades = new Set<number>()
  VinylList.forEach(it => {
    const y = getYear(it)
    if (y && y < 9999) decades.add(Math.floor(y / 10) * 10)
  })
  const sorted = [...decades].sort((a, b) => a - b)
  return [
    { value: 'all', label: 'Все годы' },
    ...sorted.map(d => ({ value: String(d), label: `${d}-е` })),
  ]
})

// Загрузка: сначала localStorage (мгновенно), затем сервер (источник правды)
onMounted(async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) purchasedItems.value = new Set(JSON.parse(stored) as number[])
    const pin = localStorage.getItem(PIN_KEY)
    if (pin) {
      ownerPin.value = pin
      isOwner.value = true
    }
  } catch (error) {
    console.error('Ошибка чтения localStorage:', error)
  }

  // Подтягиваем актуальный список с сервера
  try {
    const res = await $fetch<{ ids: number[]; configured: boolean }>('/api/purchased')
    if (res.configured) {
      purchasedItems.value = new Set(res.ids)
    }
  } catch {
    syncStatus.value = 'offline'
  }

  window.addEventListener('keydown', onGlobalKey)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
  window.removeEventListener('scroll', onScroll)
})

// Кэш в localStorage (мгновенный отклик + офлайн)
watch(purchasedItems, (newValue) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newValue)))
  } catch (error) {
    console.error('Ошибка сохранения в localStorage:', error)
  }
}, { deep: true })

// Отправка на сервер с дебаунсом (бережём лимиты Upstash)
let saveTimer: ReturnType<typeof setTimeout> | undefined
const saveToServer = async () => {
  try {
    const ids = Array.from(purchasedItems.value)
    await $fetch('/api/purchased', {
      method: 'POST',
      headers: { 'x-vinyl-pin': ownerPin.value },
      body: { ids },
    })
    syncStatus.value = 'saved'
    setTimeout(() => { if (syncStatus.value === 'saved') syncStatus.value = 'idle' }, 1500)
  } catch {
    syncStatus.value = 'error'
  }
}
const scheduleSave = () => {
  syncStatus.value = 'saving'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(saveToServer, 500)
}

const togglePurchased = (id: number) => {
  if (!isOwner.value) return
  const newSet = new Set(purchasedItems.value)
  newSet.has(id) ? newSet.delete(id) : newSet.add(id)
  purchasedItems.value = newSet
  scheduleSave()
}

// Вход/выход из режима владельца
const submitPin = async () => {
  const pin = pinDraft.value.trim()
  if (!pin) return
  try {
    await $fetch('/api/verify', { method: 'POST', body: { pin } })
    ownerPin.value = pin
    isOwner.value = true
    localStorage.setItem(PIN_KEY, pin)
    showPinInput.value = false
    pinDraft.value = ''
    pinError.value = false
  } catch {
    pinError.value = true
  }
}

const logoutOwner = () => {
  isOwner.value = false
  ownerPin.value = ''
  localStorage.removeItem(PIN_KEY)
}

const isPurchased = (id: number) => purchasedItems.value.has(id)

// Применение фильтров (теги + десятилетие)
const matchesFilters = (item: typeof VinylList[number]): boolean => {
  for (const t of tagFilters.value) {
    if (!item[t]) return false
  }
  if (selectedDecade.value !== 'all') {
    const y = getYear(item)
    if (String(Math.floor(y / 10) * 10) !== selectedDecade.value) return false
  }
  return true
}

// База: поиск + фильтры
const baseList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return VinylList.filter(item => {
    if (q && !(item.name.toLowerCase().includes(q) || item.artist.toLowerCase().includes(q))) {
      return false
    }
    return matchesFilters(item)
  })
})

// Сортировка + фильтр по табам
const filteredVinylList = computed(() => {
  const sorted = [...baseList.value].sort((a, b) => {
    const aP = isPurchased(a.id)
    const bP = isPurchased(b.id)
    if (aP && !bP) return 1
    if (!aP && bP) return -1

    if (a.important && !b.important) return -1
    if (!a.important && b.important) return 1

    switch (sortBy.value) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0) || a.artist.localeCompare(b.artist, 'ru')
      case 'price-desc':
        return (b.price || 0) - (a.price || 0) || a.artist.localeCompare(b.artist, 'ru')
      case 'year-asc':
        return getYear(a) - getYear(b)
      case 'year-desc':
        return getYear(b) - getYear(a)
      default: {
        const artistCompare = a.artist.localeCompare(b.artist, 'ru')
        return artistCompare !== 0 ? artistCompare : getYear(a) - getYear(b)
      }
    }
  })

  if (activeTab.value === 'not-purchased') return sorted.filter(i => !isPurchased(i.id))
  if (activeTab.value === 'purchased') return sorted.filter(i => isPurchased(i.id))
  return sorted
})

// Пагинация
const totalPages = computed(() => Math.ceil(filteredVinylList.value.length / ITEMS_PER_PAGE))
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredVinylList.value.slice(start, start + ITEMS_PER_PAGE)
})

const resetPage = () => {
  currentPage.value = 1
  showAllPages.value = false
}

const goToPage = (page: number) => {
  currentPage.value = page
  showAllPages.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeTab = (tab: 'all' | 'not-purchased' | 'purchased') => {
  activeTab.value = tab
  resetPage()
}

const toggleTag = (key: TagKey) => {
  const next = new Set(tagFilters.value)
  next.has(key) ? next.delete(key) : next.add(key)
  tagFilters.value = next
}

const clearSearch = () => { searchQuery.value = '' }

const hasActiveFilters = computed(() =>
  tagFilters.value.size > 0 || selectedDecade.value !== 'all' || searchQuery.value.trim() !== ''
)

const clearAll = () => {
  searchQuery.value = ''
  tagFilters.value = new Set()
  selectedDecade.value = 'all'
}

watch([searchQuery, sortBy, selectedDecade], resetPage)
watch(tagFilters, resetPage, { deep: true })

// Запись состояния в URL
watch([searchQuery, activeTab, sortBy, selectedDecade, currentPage, tagFilters], syncToQuery, { deep: true })

// Хоткеи: "/" — фокус поиска, Esc — очистить/снять фокус
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
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const visiblePages = computed(() => {
  if (showAllPages.value) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = []
  const current = currentPage.value
  const total = totalPages.value
  pages.push(1)
  const rangeStart = Math.max(2, current - 2)
  const rangeEnd = Math.min(total - 1, current + 2)
  if (rangeStart > 2) pages.push('...')
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
  if (rangeEnd < total - 1) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
})

// Счётчики табов (с учётом поиска и фильтров)
const notPurchasedCount = computed(() => baseList.value.filter(i => !isPurchased(i.id)).length)
const purchasedCount = computed(() => baseList.value.filter(i => isPurchased(i.id)).length)

// Статистика по всей коллекции
const fmt = (n: number) => n.toLocaleString('ru-RU')
const totalCount = VinylList.length
const purchasedTotal = computed(() => VinylList.filter(i => isPurchased(i.id)).length)
const totalSum = computed(() => VinylList.reduce((s, i) => s + (i.price || 0), 0))
const spentSum = computed(() => VinylList.filter(i => isPurchased(i.id)).reduce((s, i) => s + (i.price || 0), 0))
const remainingSum = computed(() => totalSum.value - spentSum.value)
const progressPct = computed(() => totalCount ? Math.round(purchasedTotal.value / totalCount * 100) : 0)
</script>

<template>
  <main class="catalog-container">
    <div class="catalog-head">
      <h2 class="catalog-title">Каталог</h2>
      <span class="catalog-sub">{{ filteredVinylList.length }} из {{ totalCount }}</span>

      <div class="owner-zone">
        <span v-if="isOwner" class="sync-state" :class="syncStatus">
          <template v-if="syncStatus === 'saving'">Сохранение…</template>
          <template v-else-if="syncStatus === 'saved'">Сохранено ✓</template>
          <template v-else-if="syncStatus === 'error'">Ошибка сети</template>
          <template v-else-if="syncStatus === 'offline'">Офлайн</template>
        </span>

        <template v-if="isOwner">
          <button class="owner-btn is-owner" @click="logoutOwner" title="Выйти из режима владельца">
            🔓 Владелец
          </button>
        </template>
        <template v-else>
          <button class="owner-btn" @click="showPinInput = !showPinInput">🔒 Режим владельца</button>
        </template>

        <Transition name="pin-pop">
          <form v-if="showPinInput && !isOwner" class="pin-form" @submit.prevent="submitPin">
            <input
                v-model="pinDraft"
                type="password"
                inputmode="numeric"
                class="pin-input"
                :class="{ err: pinError }"
                placeholder="PIN"
                autofocus
                @input="pinError = false"
            />
            <button type="submit" class="pin-submit">Войти</button>
          </form>
        </Transition>
      </div>
    </div>

    <!-- Статистика коллекции -->
    <section class="stats">
      <div class="stat-items">
        <div class="stat">
          <span class="stat-label">Куплено</span>
          <span class="stat-value">{{ purchasedTotal }} <small>/ {{ totalCount }}</small></span>
        </div>
        <div class="stat">
          <span class="stat-label">Потрачено</span>
          <span class="stat-value accent-spent">{{ fmt(spentSum) }} ₽</span>
        </div>
        <div class="stat">
          <span class="stat-label">Осталось купить</span>
          <span class="stat-value">{{ fmt(remainingSum) }} ₽</span>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-head">
          <span>Прогресс коллекции</span>
          <span class="progress-pct">{{ progressPct }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
      </div>
    </section>

    <!-- Поиск -->
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
            v-for="t in tagDefs"
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
          Все <span class="tab-count">{{ baseList.length }}</span>
        </button>
        <button :class="['tab', { active: activeTab === 'not-purchased' }]" @click="changeTab('not-purchased')">
          Не купленные <span class="tab-count">{{ notPurchasedCount }}</span>
        </button>
        <button :class="['tab', { active: activeTab === 'purchased' }]" @click="changeTab('purchased')">
          Купленные <span class="tab-count">{{ purchasedCount }}</span>
        </button>
      </div>

      <Dropdown v-model="sortBy" :options="sortOptions" min-width="218px" />
    </div>

    <div v-if="paginatedList.length" class="vinyl-list">
      <Card
          v-for="(card, i) in paginatedList"
          :key="card.id"
          :card="card"
          :is-purchased="isPurchased(card.id)"
          :query="searchQuery"
          :editable="isOwner"
          class="vinyl-item"
          :style="{ '--i': i }"
          @toggle-purchased="togglePurchased"
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

// Owner / sync zone
.owner-zone {
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sync-state {
  font-size: 0.78rem;
  color: var(--text-muted);

  &.saved { color: var(--green); }
  &.error { color: var(--danger); }
  &.offline { color: var(--gold); }
}

.owner-btn {
  padding: 8px 14px;
  border: 1px solid var(--border);
  background: var(--surface);
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

  &.is-owner {
    color: var(--accent-2);
    border-color: rgba(0, 212, 255, 0.35);
    background: rgba(0, 212, 255, 0.08);
  }
}

.pin-form {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  display: flex;
  gap: 6px;
  padding: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
}

.pin-input {
  width: 110px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  border-radius: var(--radius-xs);
  outline: none;

  &:focus { border-color: var(--accent); }
  &.err {
    border-color: var(--danger);
    animation: shake 0.3s var(--ease);
  }
}

.pin-submit {
  padding: 8px 14px;
  border: none;
  background: var(--accent-grad);
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-xs);
  cursor: pointer;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.pin-pop-enter-active,
.pin-pop-leave-active {
  transition: opacity 0.18s var(--ease), transform 0.18s var(--ease);
  transform-origin: top right;
}
.pin-pop-enter-from,
.pin-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

@media (max-width: 600px) {
  .owner-zone {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
    justify-content: flex-end;
  }
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
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.22s var(--ease);

  &:hover {
    color: var(--danger);
    background: rgba(255, 84, 112, 0.1);
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
