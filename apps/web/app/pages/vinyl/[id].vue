<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from '~/components/Card.vue'
import FullscreenLoader from '~/components/FullscreenLoader.vue'
import { coverUrl } from '~/utils/cover'
import type { Vinyl } from '~/types/catalog'

interface VinylDetail extends Vinyl {
  description: string | null
  label: string | null
  country: string | null
  genre: string | null
  /** Винил / конверт по шкале Goldmine, например «EX+ / NM». */
  condition: string | null
}

const route = useRoute()
const { public: { apiBase } } = useRuntimeConfig()

const { data, status, error, refresh } = useFetch<{ vinyl: VinylDetail; related: Vinyl[] }>(
  () => `${apiBase}/api/vinyls/${route.params.id}`,
  { server: false, retry: false },
)

const vinyl = computed(() => data.value?.vinyl)
const related = computed(() => data.value?.related ?? [])

const isLoading = computed(() => !data.value && !error.value)
// 404 отличаем от «сервер лёг»: в первом случае повторять бессмысленно
const isNotFound = computed(() => (error.value as { statusCode?: number } | null)?.statusCode === 404)

const imgSrc = computed(() => coverUrl(vinyl.value?.image, 900))
const coverLoaded = ref(false)
const coverErrored = ref(false)

const year = computed(() => vinyl.value?.original ?? vinyl.value?.repress ?? null)
const fmt = (n: number) => n.toLocaleString('ru-RU')

const priceLabel = computed(() => {
  const v = vinyl.value
  if (!v) return 'Цена'
  if (v.purchased) return 'Цена покупки'
  // Лот выкупили — цена осталась только как память о нём
  return v.soldOut ? 'Последняя цена' : 'Цена'
})

useHead(() => ({
  title: vinyl.value ? `${vinyl.value.artist} — ${vinyl.value.name} | ILALEX Vinyl` : 'ILALEX Vinyl',
  meta: [{ name: 'description', content: vinyl.value?.description ?? '' }],
}))

/**
 * Когда описание в админке не заполнено, собираем короткую сводку из того,
 * что точно известно — лучше, чем пустое место.
 */
const fallbackDescription = computed(() => {
  const v = vinyl.value
  if (!v) return ''

  const parts: string[] = []
  if (v.original) parts.push(`Оригинальное издание ${v.original} года`)
  else if (v.repress) parts.push(`Переиздание ${v.repress} года`)

  if (v.country) parts.push(`страна издания — ${v.country}`)
  if (v.label) parts.push(`лейбл ${v.label}`)
  if (v.sealed) parts.push('пластинка запечатана')

  const first = parts.length
    ? `${parts.join(', ')}.`
    : 'Подробное описание этой пластинки пока не заполнено.'

  return `${v.artist} — «${v.name}». ${first}`
})

const descriptionParagraphs = computed(() => {
  const text = vinyl.value?.description?.trim() || fallbackDescription.value
  return text.split(/\n{2,}|\n/).map(p => p.trim()).filter(Boolean)
})
</script>

<template>
  <main class="vinyl-page">
    <FullscreenLoader :visible="isLoading" />

    <div v-if="isNotFound" class="page-message">
      <div class="message-icon">🕳️</div>
      <h1 class="message-title">Пластинка не найдена</h1>
      <p class="message-sub">Возможно, её убрали из каталога.</p>
      <NuxtLink to="/" class="btn-secondary">Вернуться в каталог</NuxtLink>
    </div>

    <div v-else-if="error" class="page-message">
      <div class="message-icon">📡</div>
      <h1 class="message-title">Не удалось загрузить</h1>
      <p class="message-sub">Сервер не отвечает — возможно, он ещё просыпается.</p>
      <button class="btn-secondary" @click="refresh()">Повторить</button>
    </div>

    <template v-else-if="vinyl">
      <NuxtLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Каталог
      </NuxtLink>

      <div class="hero">
        <!-- Обложка: пластинка выезжает из конверта при наведении -->
        <div class="cover-side">
          <div class="cover-stage">
            <div class="disc-behind" aria-hidden="true">
              <span class="disc-label"></span>
            </div>
            <div class="cover-frame">
              <img
                  v-if="!coverErrored"
                  :src="imgSrc"
                  :alt="`${vinyl.artist} — ${vinyl.name}`"
                  class="cover-img"
                  :class="{ loaded: coverLoaded }"
                  @load="coverLoaded = true"
                  @error="coverErrored = true"
              />
              <div v-else class="cover-fallback">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
                <span>Нет обложки</span>
              </div>
              <span v-if="vinyl.important" class="flag-important" title="В первую очередь">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.6l2.7 5.9 6.4.8-4.7 4.4 1.2 6.4L12 16.9 6.4 20.1l1.2-6.4L2.9 9.3l6.4-.8z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="info-side">
          <p class="artist">{{ vinyl.artist }}</p>
          <h1 class="title">{{ vinyl.name }}</h1>

          <div class="tags">
            <span v-if="vinyl.original" class="tag tag-original">Оригинал {{ vinyl.original }}</span>
            <span v-if="vinyl.repress" class="tag tag-repress">Переиздание {{ vinyl.repress }}</span>
            <span v-if="vinyl.sealed" class="tag tag-sealed">Запечатан</span>
            <span v-if="vinyl.important" class="tag tag-important">В первую очередь</span>
            <span v-if="vinyl.purchased" class="tag tag-purchased">✓ Куплен</span>
            <span v-else-if="vinyl.soldOut" class="tag tag-sold">Нет в продаже</span>
          </div>

          <!--
            Три разных случая, и путать их нельзя:
            1. пластинка уже в коллекции — покупать нечего, это победа;
            2. лот выкупили в магазине (кто-то другой) — купить негде;
            3. лот в продаже — зовём покупать.
          -->
          <div class="buy-block" :class="{ 'is-sold': vinyl.soldOut && !vinyl.purchased }">
            <div class="price-wrap">
              <span class="price-label">{{ priceLabel }}</span>
              <span class="price" :class="{ 'is-stale': vinyl.soldOut && !vinyl.purchased }">
                {{ fmt(vinyl.price) }} ₽
              </span>
            </div>

            <div v-if="vinyl.purchased" class="status-note">
              <span class="owned-badge">✓ Уже в коллекции</span>
              <a :href="vinyl.link" target="_blank" rel="noopener noreferrer" class="quiet-link">
                Страница в магазине
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M7 17L17 7M17 7H9M17 7v8" />
                </svg>
              </a>
            </div>

            <div v-else-if="vinyl.soldOut" class="status-note">
              <span class="sold-badge">Лот выкуплен</span>
              <a :href="vinyl.link" target="_blank" rel="noopener noreferrer" class="quiet-link">
                Посмотреть в магазине
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M7 17L17 7M17 7H9M17 7v8" />
                </svg>
              </a>
            </div>

            <a v-else :href="vinyl.link" target="_blank" rel="noopener noreferrer" class="btn-buy">
              Купить в магазине
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M7 17L17 7M17 7H9M17 7v8" />
              </svg>
            </a>
          </div>

          <!-- Характеристики: показываем только заполненные -->
          <dl v-if="year || vinyl.label || vinyl.country || vinyl.genre || vinyl.condition" class="specs">
            <div v-if="year" class="spec">
              <dt>Год</dt>
              <dd>{{ year }}</dd>
            </div>
            <div v-if="vinyl.genre" class="spec">
              <dt>Жанр</dt>
              <dd>{{ vinyl.genre }}</dd>
            </div>
            <div v-if="vinyl.label" class="spec">
              <dt>Лейбл</dt>
              <dd>{{ vinyl.label }}</dd>
            </div>
            <div v-if="vinyl.country" class="spec">
              <dt>Страна</dt>
              <dd>{{ vinyl.country }}</dd>
            </div>
            <div v-if="vinyl.condition" class="spec">
              <dt title="Оценка по шкале Goldmine">Состояние</dt>
              <dd>
                {{ vinyl.condition }}
                <span class="spec-hint">винил / конверт</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section class="about">
        <h2 class="section-title">Об альбоме</h2>
        <div class="about-text">
          <p v-for="(p, i) in descriptionParagraphs" :key="i">{{ p }}</p>
        </div>
      </section>

      <section v-if="related.length" class="related">
        <h2 class="section-title">Ещё из коллекции</h2>
        <div class="related-grid">
          <Card v-for="item in related" :key="item.id" :card="item" />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
.vinyl-page {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 24px 64px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 20px 16px 48px;
  }
}

// Сообщения (404 / ошибка сети)
.page-message {
  text-align: center;
  padding: 100px 20px;
}

.message-icon {
  font-size: 3.4rem;
  margin-bottom: 14px;
  opacity: 0.85;
}

.message-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  margin: 0 0 8px;
}

.message-sub {
  color: var(--text-muted);
  margin: 0 0 22px;
}

.btn-secondary {
  display: inline-block;
  padding: 11px 24px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s var(--ease);

  &:hover {
    background: var(--accent);
    color: #fff;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 26px;
  color: var(--text-muted);
  font-size: 0.92rem;
  text-decoration: none;
  transition: color 0.22s var(--ease), transform 0.22s var(--ease);

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover {
    color: var(--text);
    transform: translateX(-3px);
  }
}

// --- Герой ---
.hero {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.cover-stage {
  position: relative;
  perspective: 1200px;
}

// Диск выглядывает из-за конверта
.disc-behind {
  position: absolute;
  top: 50%;
  right: 4%;
  width: 82%;
  aspect-ratio: 1;
  transform: translate(0, -50%);
  border-radius: 50%;
  background:
    repeating-radial-gradient(circle at 50% 50%, #16161c 0 2px, #0e0e12 2px 4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: var(--shadow-lg);
  display: grid;
  place-items: center;
  transition: transform 0.6s var(--ease);
  z-index: 0;

  .cover-stage:hover & {
    transform: translate(34%, -50%) rotate(22deg);
  }
}

.disc-label {
  width: 34%;
  height: 34%;
  border-radius: 50%;
  background: var(--accent-grad);
  box-shadow: inset 0 0 0 6px rgba(10, 10, 12, 0.25);
}

.cover-frame {
  position: relative;
  z-index: 1;
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  filter: blur(14px);
  transition: opacity 0.5s var(--ease), filter 0.5s var(--ease);

  &.loaded {
    opacity: 1;
    filter: blur(0);
  }
}

.cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
  background: radial-gradient(circle at 50% 40%, var(--surface-2), var(--bg-soft));

  svg {
    width: 54px;
    height: 54px;
    opacity: 0.6;
  }
}

.flag-important {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #1a1400;
  background: linear-gradient(135deg, #ffd966, #ffb300);
  box-shadow: 0 4px 14px -2px rgba(255, 180, 0, 0.6);

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }
}

// --- Информация ---
.artist {
  margin: 0 0 6px;
  font-size: 1.05rem;
  color: var(--accent-2);
  letter-spacing: 0.01em;
}

.title {
  margin: 0 0 18px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.7rem, 4vw, 2.7rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 26px;
}

.tag {
  font-size: 0.76rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;

  &-original {
    color: var(--gold);
    background: rgba(255, 207, 74, 0.1);
    border-color: rgba(255, 207, 74, 0.25);
  }

  &-repress {
    color: var(--accent-2);
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.22);
  }

  &-sealed {
    color: var(--mint);
    background: rgba(52, 224, 192, 0.1);
    border-color: rgba(52, 224, 192, 0.22);
  }

  &-important {
    color: var(--gold);
    background: rgba(255, 180, 0, 0.12);
    border-color: rgba(255, 180, 0, 0.3);
  }

  &-purchased {
    color: var(--green);
    background: rgba(74, 222, 128, 0.12);
    border-color: rgba(74, 222, 128, 0.35);
  }

  &-sold {
    color: var(--danger);
    background: rgba(255, 84, 112, 0.1);
    border-color: rgba(255, 84, 112, 0.3);
  }
}

.buy-block {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px 24px;
  margin-bottom: 26px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  @media (max-width: 480px) {
    padding: 16px 18px;
    gap: 14px;
  }
}

.price-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-label {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.price {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;

  // Цена выкупленного лота — историческая, а не та, что можно заплатить
  &.is-stale {
    color: var(--text-muted);
    text-decoration: line-through;
    text-decoration-color: rgba(255, 84, 112, 0.55);
  }

  @media (max-width: 480px) {
    font-size: 1.55rem;
  }
}

.btn-buy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding: 14px 28px;
  border-radius: 999px;
  background: var(--accent-grad);
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 28px -10px rgba(124, 92, 255, 0.85);
  transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px -10px rgba(124, 92, 255, 0.95);
  }

  @media (max-width: 480px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}

// Блок вместо кнопки покупки: пластинка уже куплена или лот выкупили
.status-note {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-left: auto;

  @media (max-width: 480px) {
    margin-left: 0;
    align-items: flex-start;
  }
}

.sold-badge {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--danger);
  background: rgba(255, 84, 112, 0.1);
  border: 1px solid rgba(255, 84, 112, 0.32);
}

.owned-badge {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--green);
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.35);
}

.quiet-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.22s var(--ease);

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    color: var(--text-soft);
  }
}

.specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px 20px;
  margin: 0;
  padding: 18px 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.spec {
  display: flex;
  flex-direction: column;
  gap: 4px;

  dt {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  dd {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.02rem;
    font-weight: 600;
  }
}

.spec-hint {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--text-muted);
}

// --- Секции ---
.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
}

.about {
  margin-top: 52px;
}

.about-text {
  max-width: 78ch;
  color: var(--text-soft);
  font-size: 1.02rem;
  line-height: 1.75;

  p {
    margin: 0 0 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.related {
  margin-top: 56px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
