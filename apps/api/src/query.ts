/**
 * Разбор query-параметров каталога. Всё, что приходит из браузера, здесь
 * приводится к безопасному замкнутому набору значений — в SQL потом уходят
 * только плейсхолдеры и заранее известные куски текста, никакой конкатенации
 * пользовательского ввода.
 */

export const SORT_KEYS = ['default', 'price-asc', 'price-desc', 'year-asc', 'year-desc'] as const
export const TAB_KEYS = ['all', 'not-purchased', 'purchased'] as const
export const TAG_KEYS = ['important', 'original', 'repress', 'sealed'] as const

export type SortKey = (typeof SORT_KEYS)[number]
export type TabKey = (typeof TAB_KEYS)[number]
export type TagKey = (typeof TAG_KEYS)[number]

export interface CatalogQuery {
  page: number
  perPage: number
  q: string
  tab: TabKey
  sort: SortKey
  /** null — «все годы», иначе начало десятилетия: 1980, 1990, … */
  decade: number | null
  tags: TagKey[]
}

const MAX_PER_PAGE = 100

function one(value: unknown): string {
  // Fastify отдаёт массив, если параметр повторили в строке запроса
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

function int(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(one(value), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function parseCatalogQuery(raw: Record<string, unknown>): CatalogQuery {
  const sort = one(raw.sort) as SortKey
  const tab = one(raw.tab) as TabKey

  const decadeRaw = one(raw.decade)
  const decadeNum = Number.parseInt(decadeRaw, 10)
  const decade =
    decadeRaw && decadeRaw !== 'all' && Number.isFinite(decadeNum) && decadeNum >= 0
      ? Math.floor(decadeNum / 10) * 10
      : null

  const tags = one(raw.tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag): tag is TagKey => (TAG_KEYS as readonly string[]).includes(tag))

  return {
    page: Math.max(1, int(raw.page, 1)),
    perPage: Math.min(MAX_PER_PAGE, Math.max(1, int(raw.perPage, 20))),
    // Поиск уходит в SQL параметром, но длину всё равно ограничиваем
    q: one(raw.q).trim().slice(0, 100),
    tab: (TAB_KEYS as readonly string[]).includes(tab) ? tab : 'all',
    sort: (SORT_KEYS as readonly string[]).includes(sort) ? sort : 'default',
    decade,
    tags: [...new Set(tags)],
  }
}
