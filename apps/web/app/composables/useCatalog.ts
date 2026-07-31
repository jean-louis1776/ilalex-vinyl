import { computed, ref, watch } from 'vue'
import type { CatalogResponse, SortKey, TabKey, TagKey } from '~/types/catalog'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'year-asc', label: 'Год: сначала старые' },
  { value: 'year-desc', label: 'Год: сначала новые' },
]

export const TAG_DEFS: { key: TagKey; label: string }[] = [
  { key: 'available', label: 'Ещё в продаже' },
  { key: 'important', label: 'В первую очередь' },
  { key: 'original', label: 'Оригинал' },
  { key: 'repress', label: 'Переиздание' },
  { key: 'sealed', label: 'Запечатан' },
]

const ITEMS_PER_PAGE = 20
const SEARCH_DEBOUNCE_MS = 350

// На бесплатном тарифе Render сервис засыпает и просыпается до минуты.
// Первую загрузку поэтому не бросаем при первой же ошибке, а повторяем —
// всё это время висит полноэкранный лоадер с пластинкой.
const WAKE_UP_ATTEMPTS = 12
const WAKE_UP_DELAY_MS = 5_000

/**
 * Каталог целиком живёт на бэкенде: поиск, фильтры, сортировка и пагинация
 * считаются в SQL, а сюда приходит ровно одна страница. Состояние
 * дублируется в URL, чтобы ссылкой можно было поделиться.
 */
export function useCatalog() {
  const route = useRoute()
  const router = useRouter()
  const { public: { apiBase } } = useRuntimeConfig()

  const searchQuery = ref('')
  const activeTab = ref<TabKey>('all')
  const sortBy = ref<SortKey>('default')
  const selectedDecade = ref('all')
  const tagFilters = ref<Set<TagKey>>(new Set())
  const currentPage = ref(1)

  // --- Начальное состояние из ?q=&tab=&sort=&decade=&tags=&page= ---
  const q = route.query
  if (typeof q.q === 'string') searchQuery.value = q.q
  if (q.tab === 'all' || q.tab === 'not-purchased' || q.tab === 'purchased') activeTab.value = q.tab
  if (typeof q.sort === 'string' && SORT_OPTIONS.some(o => o.value === q.sort)) sortBy.value = q.sort as SortKey
  if (typeof q.decade === 'string') selectedDecade.value = q.decade
  if (typeof q.tags === 'string') {
    const valid = TAG_DEFS.map(t => t.key)
    tagFilters.value = new Set(q.tags.split(',').filter(t => valid.includes(t as TagKey)) as TagKey[])
  }
  if (typeof q.page === 'string') {
    const page = Number.parseInt(q.page, 10)
    if (page > 0) currentPage.value = page
  }

  // Поиск с задержкой: в API уходит уже «устоявшийся» запрос,
  // а не каждый введённый символ
  const debouncedSearch = ref(searchQuery.value)
  let searchTimer: ReturnType<typeof setTimeout> | undefined
  watch(searchQuery, (value) => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { debouncedSearch.value = value.trim() }, SEARCH_DEBOUNCE_MS)
  })

  const apiQuery = computed(() => ({
    page: currentPage.value,
    perPage: ITEMS_PER_PAGE,
    q: debouncedSearch.value || undefined,
    tab: activeTab.value !== 'all' ? activeTab.value : undefined,
    sort: sortBy.value !== 'default' ? sortBy.value : undefined,
    decade: selectedDecade.value !== 'all' ? selectedDecade.value : undefined,
    tags: tagFilters.value.size ? [...tagFilters.value].join(',') : undefined,
  }))

  // Сколько попыток разбудить бэкенд осталось; пока их больше нуля,
  // ошибка наружу не показывается — держим лоадер
  const wakeUpAttemptsLeft = ref(WAKE_UP_ATTEMPTS)
  const isWakingUp = ref(false)

  const { data, status, error, refresh } = useFetch<CatalogResponse>(`${apiBase}/api/vinyls`, {
    query: apiQuery,
    // Данные тянем только в браузере: пока идёт запрос, показывается
    // полноэкранный лоадер
    server: false,
    retry: false,
    onResponse() {
      // Достучались — сбрасываем счётчик на случай следующего засыпания
      wakeUpAttemptsLeft.value = WAKE_UP_ATTEMPTS
      isWakingUp.value = false
    },
  })

  // Бэкенд не ответил: ждём и пробуем снова, пока не кончатся попытки
  let wakeUpTimer: ReturnType<typeof setTimeout> | undefined
  watch(error, (value) => {
    clearTimeout(wakeUpTimer)
    if (!value) return

    if (wakeUpAttemptsLeft.value > 0) {
      wakeUpAttemptsLeft.value -= 1
      isWakingUp.value = true
      wakeUpTimer = setTimeout(() => refresh(), WAKE_UP_DELAY_MS)
    } else {
      isWakingUp.value = false
    }
  })

  const retry = () => {
    wakeUpAttemptsLeft.value = WAKE_UP_ATTEMPTS
    isWakingUp.value = true
    return refresh()
  }

  /** Каталога ещё нет: либо первый запрос, либо будим уснувший бэкенд. */
  const isFirstLoad = computed(() => !data.value && (!error.value || isWakingUp.value))
  const isRefreshing = computed(() => status.value === 'pending' && !!data.value)
  /** Показывать экран ошибки можно только когда попытки исчерпаны. */
  const hasFailed = computed(() => !!error.value && !data.value && !isWakingUp.value)

  const items = computed(() => data.value?.items ?? [])
  const meta = computed(() => data.value?.meta)

  const decadeOptions = computed(() => [
    { value: 'all', label: 'Все годы' },
    ...(meta.value?.decades ?? []).map(decade => ({ value: String(decade), label: `${decade}-е` })),
  ])

  // --- Запись состояния обратно в URL ---
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

  const resetPage = () => { currentPage.value = 1 }

  // Смена условий отбора всегда возвращает на первую страницу
  watch([debouncedSearch, sortBy, selectedDecade, activeTab], resetPage)
  watch(tagFilters, resetPage, { deep: true })
  watch([searchQuery, activeTab, sortBy, selectedDecade, currentPage, tagFilters], syncToQuery, { deep: true })

  const hasActiveFilters = computed(() =>
    tagFilters.value.size > 0 || selectedDecade.value !== 'all' || searchQuery.value.trim() !== '',
  )

  const clearAll = () => {
    searchQuery.value = ''
    debouncedSearch.value = ''
    tagFilters.value = new Set()
    selectedDecade.value = 'all'
  }

  const toggleTag = (key: TagKey) => {
    const next = new Set(tagFilters.value)
    next.has(key) ? next.delete(key) : next.add(key)
    tagFilters.value = next
  }

  return {
    searchQuery,
    activeTab,
    sortBy,
    selectedDecade,
    tagFilters,
    currentPage,
    items,
    meta,
    decadeOptions,
    status,
    error,
    retry,
    isFirstLoad,
    isRefreshing,
    isWakingUp,
    hasFailed,
    hasActiveFilters,
    clearAll,
    toggleTag,
  }
}
