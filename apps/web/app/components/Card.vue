<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Vinyl } from '~/types/catalog'

const props = defineProps<{
  card: Vinyl
  query?: string
}>()

// Отметка «куплено» приходит из админки — на сайте она только отображается
const isPurchased = computed(() => props.card.purchased)

const imgSrc = computed(() => coverUrl(props.card.image, 600))

// Состояние загрузки обложки
const imgEl = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const errored = ref(false)

// Если картинка уже в кэше, событие @load могло сработать до навешивания
// обработчика — проверяем готовность вручную после монтирования.
onMounted(() => {
  const el = imgEl.value
  if (el && el.complete) {
    if (el.naturalWidth > 0) loaded.value = true
    else errored.value = true
  }
})

// Подсветка совпадений поиска (безопасно: экранируем html и regex)
const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
const escapeReg = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlight = (text: string): string => {
  const q = props.query?.trim()
  const safe = escapeHtml(text)
  if (!q) return safe
  const re = new RegExp(`(${escapeReg(escapeHtml(q))})`, 'gi')
  return safe.replace(re, '<mark class="hl">$1</mark>')
}
</script>

<template>
  <NuxtLink
      :to="`/vinyl/${card.id}`"
      class="vinyl-card"
      :class="{ 'is-purchased': isPurchased }"
  >
    <div class="vinyl-image">
      <img
          v-if="!errored"
          ref="imgEl"
          :src="imgSrc"
          :alt="card.name"
          loading="lazy"
          class="cover-img"
          :class="{ loaded }"
          @load="loaded = true"
          @error="errored = true"
      />
      <div v-else class="cover-fallback">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        <span>Нет обложки</span>
      </div>
      <span v-if="card.important" class="flag-important" title="В первую очередь">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.6l2.7 5.9 6.4.8-4.7 4.4 1.2 6.4L12 16.9 6.4 20.1l1.2-6.4L2.9 9.3l6.4-.8z" />
        </svg>
      </span>
      <div class="img-shade"></div>
      <Transition name="overlay">
        <div v-if="isPurchased" class="purchased-overlay">
          <span class="purchased-badge">✓ Куплен</span>
        </div>
      </Transition>
    </div>

    <div class="vinyl-info">
      <h3 class="vinyl-name" v-html="highlight(card.name)"></h3>
      <p class="vinyl-artist" v-html="highlight(card.artist)"></p>

      <div class="vinyl-tags">
        <span v-if="card.original" class="tag tag-original">Оригинал {{ card.original }}</span>
        <span v-if="card.repress" class="tag tag-repress">Переиздание {{ card.repress }}</span>
        <span v-if="card.sealed" class="tag tag-sealed">Запечатан</span>
      </div>

      <div class="card-footer">
        <span class="vinyl-price">{{ card.price }} ₽</span>
        <span v-if="isPurchased" class="buy-toggle is-done static">✓ Куплен</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.vinyl-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease),
    border-color 0.4s var(--ease), opacity 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-lg);
  }

  // Accent glow line on hover
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    padding: 1px;
    background: var(--accent-grad);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s var(--ease);
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.55;
  }

  &.is-purchased {
    opacity: 0.55;

    &:hover {
      opacity: 0.85;
    }
  }
}

.vinyl-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--bg-soft);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s var(--ease), opacity 0.5s var(--ease), filter 0.5s var(--ease);
  }

  .vinyl-card:hover & img {
    transform: scale(1.07);
  }
}

// Blur-up при загрузке обложки
.cover-img {
  opacity: 0;
  filter: blur(12px);

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
  gap: 8px;
  color: var(--text-muted);
  background:
    radial-gradient(circle at 50% 40%, var(--surface-2), var(--bg-soft));

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.6;
  }

  span {
    font-size: 12px;
    letter-spacing: 0.02em;
  }
}

.img-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 12, 0.55), transparent 45%);
  pointer-events: none;
}

.flag-important {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #1a1400;
  background: linear-gradient(135deg, #ffd966, #ffb300);
  box-shadow: 0 4px 12px -2px rgba(255, 180, 0, 0.6);

  // SVG вместо символа ★: у текстовой звезды свой baseline,
  // из-за которого она никогда не встаёт ровно по центру круга
  svg {
    width: 15px;
    height: 15px;
    display: block;
  }
}

.purchased-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(74, 222, 128, 0.18);
  backdrop-filter: blur(2px);
  z-index: 3;
}

.purchased-badge {
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: #052e16;
  background: var(--green);
  box-shadow: 0 6px 20px -4px rgba(74, 222, 128, 0.5);
}

.vinyl-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 6px;
  }
}

.vinyl-name {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 13px;
  }
}

.vinyl-artist {
  margin: 0;
  font-size: 13px;
  color: var(--text-soft);

  @media (max-width: 768px) {
    font-size: 11px;
  }
}

// Подсветка совпадений поиска (вставляется через v-html)
:deep(.hl) {
  background: rgba(124, 92, 255, 0.32);
  color: var(--text);
  border-radius: 3px;
  padding: 0 1px;
  box-shadow: 0 0 0 1px rgba(124, 92, 255, 0.35);
}

.vinyl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 2px;
}

.tag {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
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

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 2px 6px;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
}

.vinyl-price {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: var(--text);

  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.buy-toggle {
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  padding: 7px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s var(--ease);
  white-space: nowrap;

  &:hover {
    color: var(--text);
    background: var(--accent-soft);
    border-color: var(--accent);
    transform: translateY(-1px);
  }

  &.is-done {
    color: var(--green);
    background: rgba(74, 222, 128, 0.12);
    border-color: rgba(74, 222, 128, 0.35);
  }

  &.static {
    cursor: default;

    &:hover {
      transform: none;
      color: var(--green);
      background: rgba(74, 222, 128, 0.12);
      border-color: rgba(74, 222, 128, 0.35);
    }
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 6px 10px;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
