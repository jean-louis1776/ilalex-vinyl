export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'
export type TabKey = 'all' | 'not-purchased' | 'purchased'
export type TagKey = 'important' | 'original' | 'repress' | 'sealed'

/** Одна пластинка в том виде, в каком её отдаёт API. */
export interface Vinyl {
  id: number
  name: string
  artist: string
  price: number
  link: string
  image: string
  important: boolean
  original: number | null
  repress: number | null
  sealed: boolean
  purchased: boolean
}

export interface CatalogMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  /** Счётчики табов — с учётом поиска и фильтров, но без самого таба */
  counts: {
    all: number
    purchased: number
    notPurchased: number
  }
  /** Статистика по всей коллекции — от поиска и фильтров не зависит */
  stats: {
    total: number
    purchased: number
    totalSum: number
    spentSum: number
    remainingSum: number
    progressPct: number
  }
  /** Десятилетия, которые вообще есть в коллекции */
  decades: number[]
}

export interface CatalogResponse {
  items: Vinyl[]
  meta: CatalogMeta
}
