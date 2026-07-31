import pg from 'pg'

import { config } from './config.js'
import type { CatalogQuery, SortKey } from './query.js'

// Подключаемся под ролью api_reader: она умеет только SELECT, поэтому даже
// баг в этом сервисе физически не может изменить данные.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

// bigint/numeric из pg приходят строками — каталог заведомо помещается
// в number, поэтому приводим сразу, чтобы в JSON не текли "12" вместо 12
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number.parseFloat(value))

export interface VinylRow {
  id: number
  artist: string
  name: string
  price: number
  link: string
  image: string
  important: boolean
  original: number | null
  repress: number | null
  sealed: boolean
  purchased: boolean
}

/** Карточка пластинки — то же плюс поля, нужные только на её странице. */
export interface VinylDetailRow extends VinylRow {
  description: string | null
  label: string | null
  country: string | null
  genre: string | null
  /** Состояние винила и конверта по шкале Goldmine, например «EX+ / NM». */
  condition: string | null
}

export interface CatalogCounts {
  all: number
  purchased: number
  notPurchased: number
}

export interface CatalogStats {
  total: number
  purchased: number
  totalSum: number
  spentSum: number
  remainingSum: number
  progressPct: number
}

export interface CatalogPage {
  items: VinylRow[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
    counts: CatalogCounts
    stats: CatalogStats
    decades: number[]
  }
}

/** Год пластинки: оригинал, иначе переиздание. */
const YEAR_EXPR = 'COALESCE(original_year, repress_year)'

/**
 * Условия поиска/фильтров — без учёта таба «куплено/не куплено»: по этому же
 * набору считаются счётчики табов, поэтому таб добавляется отдельно.
 */
function buildFilters(query: CatalogQuery): { sql: string; params: unknown[] } {
  const conditions = ['is_published']
  const params: unknown[] = []

  if (query.q) {
    params.push(`%${query.q}%`)
    // ILIKE с параметром: символы % и _ внутри запроса просто расширят поиск,
    // подставить SQL через него нельзя
    conditions.push(`(name ILIKE $${params.length} OR artist ILIKE $${params.length})`)
  }

  for (const tag of query.tags) {
    if (tag === 'important') conditions.push('important')
    if (tag === 'sealed') conditions.push('sealed')
    if (tag === 'original') conditions.push('original_year IS NOT NULL')
    if (tag === 'repress') conditions.push('repress_year IS NOT NULL')
  }

  if (query.decade !== null) {
    params.push(query.decade)
    conditions.push(`(${YEAR_EXPR} / 10) * 10 = $${params.length}`)
  }

  return { sql: conditions.join(' AND '), params }
}

/**
 * Порядок повторяет сайт: сначала не купленные, внутри них — «в первую
 * очередь», и только потом выбранная сортировка. id в конце делает порядок
 * стабильным между страницами.
 */
function buildOrderBy(sort: SortKey): string {
  const tail: Record<SortKey, string> = {
    'default': `lower(artist), ${YEAR_EXPR} ASC NULLS LAST`,
    'price-asc': 'price ASC, lower(artist)',
    'price-desc': 'price DESC, lower(artist)',
    'year-asc': `${YEAR_EXPR} ASC NULLS LAST`,
    'year-desc': `${YEAR_EXPR} DESC NULLS LAST`,
  }

  return `purchased ASC, important DESC, ${tail[sort]}, id`
}

export async function fetchCatalog(query: CatalogQuery): Promise<CatalogPage> {
  const { sql: where, params } = buildFilters(query)

  // Счётчики табов — по поиску и фильтрам, но до применения самого таба
  const countsResult = await pool.query<{ all: number; purchased: number }>(
    `SELECT COUNT(*) AS all, COUNT(*) FILTER (WHERE purchased) AS purchased
     FROM vinyls WHERE ${where}`,
    params,
  )
  const allCount = countsResult.rows[0]?.all ?? 0
  const purchasedCount = countsResult.rows[0]?.purchased ?? 0
  const counts: CatalogCounts = {
    all: allCount,
    purchased: purchasedCount,
    notPurchased: allCount - purchasedCount,
  }

  const total =
    query.tab === 'purchased'
      ? counts.purchased
      : query.tab === 'not-purchased'
        ? counts.notPurchased
        : counts.all

  const tabCondition =
    query.tab === 'purchased' ? ' AND purchased' : query.tab === 'not-purchased' ? ' AND NOT purchased' : ''

  const pageParams = [...params, query.perPage, (query.page - 1) * query.perPage]
  const itemsResult = await pool.query<VinylRow>(
    `SELECT id, artist, name, price, link, image, important, sealed, purchased,
            original_year AS original, repress_year AS repress
     FROM vinyls
     WHERE ${where}${tabCondition}
     ORDER BY ${buildOrderBy(query.sort)}
     LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`,
    pageParams,
  )

  const [stats, decades] = await Promise.all([fetchStats(), fetchDecades()])

  return {
    items: itemsResult.rows,
    meta: {
      page: query.page,
      perPage: query.perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.perPage)),
      counts,
      stats,
      decades,
    },
  }
}

/** Одна пластинка со всеми полями плюс несколько соседних по исполнителю. */
export async function fetchVinyl(
  id: number,
): Promise<{ vinyl: VinylDetailRow; related: VinylRow[] } | null> {
  const { rows } = await pool.query<VinylDetailRow>(
    `SELECT id, artist, name, price, link, image, important, sealed, purchased,
            original_year AS original, repress_year AS repress,
            description, label, country, genre, condition
     FROM vinyls
     WHERE id = $1 AND is_published`,
    [id],
  )

  const vinyl = rows[0]
  if (!vinyl) return null

  // Сначала другие пластинки того же исполнителя, потом — того же
  // десятилетия, чтобы блок «Ещё из коллекции» не пустовал
  const { rows: related } = await pool.query<VinylRow>(
    `SELECT id, artist, name, price, link, image, important, sealed, purchased,
            original_year AS original, repress_year AS repress
     FROM vinyls
     WHERE is_published AND id <> $1
     ORDER BY (artist = $2) DESC,
              (${YEAR_EXPR} / 10 = $3::int / 10) DESC,
              random()
     LIMIT 4`,
    [vinyl.id, vinyl.artist, vinyl.original ?? vinyl.repress ?? 0],
  )

  return { vinyl, related }
}

/** Статистика по всей коллекции — она не зависит от поиска и фильтров. */
async function fetchStats(): Promise<CatalogStats> {
  const { rows } = await pool.query<{
    total: number
    purchased: number
    total_sum: number
    spent_sum: number
  }>(
    `SELECT COUNT(*) AS total,
            COUNT(*) FILTER (WHERE purchased) AS purchased,
            COALESCE(SUM(price), 0) AS total_sum,
            COALESCE(SUM(price) FILTER (WHERE purchased), 0) AS spent_sum
     FROM vinyls WHERE is_published`,
  )

  const row = rows[0] ?? { total: 0, purchased: 0, total_sum: 0, spent_sum: 0 }

  return {
    total: row.total,
    purchased: row.purchased,
    totalSum: row.total_sum,
    spentSum: row.spent_sum,
    remainingSum: row.total_sum - row.spent_sum,
    progressPct: row.total > 0 ? Math.round((row.purchased / row.total) * 100) : 0,
  }
}

/** Десятилетия, которые вообще есть в коллекции — для выпадающего фильтра. */
async function fetchDecades(): Promise<number[]> {
  const { rows } = await pool.query<{ decade: number }>(
    `SELECT DISTINCT (${YEAR_EXPR} / 10) * 10 AS decade
     FROM vinyls
     WHERE is_published AND ${YEAR_EXPR} IS NOT NULL
     ORDER BY decade`,
  )
  return rows.map((row) => row.decade)
}
