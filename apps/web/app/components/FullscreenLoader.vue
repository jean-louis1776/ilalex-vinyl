<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  /** Бэкенд не ответил и мы его будим — подпись меняется, чтобы ожидание
      не выглядело зависанием */
  wakingUp?: boolean
}>()

const FADE_OUT_MS = 450

// Оверлей держится в DOM ещё немного после visible=false — чтобы доиграть
// затухание, а не исчезнуть рывком
const mounted = ref(props.visible)
let timer: ReturnType<typeof setTimeout> | undefined

// Объявлено до watch: тот срабатывает сразу (immediate) и уже вызывает
// lockScroll — переменная к этому моменту должна существовать
let previous: { html: string; body: string; padding: string } | null = null

watch(() => props.visible, (visible) => {
  clearTimeout(timer)
  if (visible) {
    mounted.value = true
    lockScroll()
  } else {
    timer = setTimeout(() => {
      mounted.value = false
      unlockScroll()
    }, FADE_OUT_MS)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  clearTimeout(timer)
  unlockScroll()
})

// Блокировка прокрутки без «прыжка» на ширину скроллбара
function lockScroll() {
  if (typeof document === 'undefined' || previous) return
  const { body, documentElement: html } = document
  const gap = window.innerWidth - html.clientWidth
  previous = { html: html.style.overflow, body: body.style.overflow, padding: body.style.paddingRight }
  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'
  if (gap > 0) body.style.paddingRight = `${gap}px`
}

function unlockScroll() {
  if (typeof document === 'undefined' || !previous) return
  const { body, documentElement: html } = document
  html.style.overflow = previous.html
  body.style.overflow = previous.body
  body.style.paddingRight = previous.padding
  previous = null
}
</script>

<template>
  <div v-if="mounted" class="loader-overlay" :class="{ hidden: !visible }" aria-hidden="true">
    <div class="loader-inner">
      <p class="eyebrow">ILALEX VINYL / КОЛЛЕКЦИЯ</p>

      <div class="turntable">
        <svg class="record" viewBox="0 0 200 200" role="presentation">
          <defs>
            <linearGradient id="labelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7c5cff" />
              <stop offset="100%" stop-color="#00d4ff" />
            </linearGradient>
            <linearGradient id="sheenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.22" />
              <stop offset="45%" stop-color="#fff" stop-opacity="0" />
              <stop offset="100%" stop-color="#fff" stop-opacity="0.07" />
            </linearGradient>
          </defs>

          <!-- Тело пластинки -->
          <circle cx="100" cy="100" r="96" fill="#111116" />
          <circle cx="100" cy="100" r="96" fill="url(#sheenGrad)" />

          <!-- Борозды -->
          <g class="grooves" fill="none" stroke="#ffffff">
            <circle cx="100" cy="100" r="88" stroke-opacity="0.07" />
            <circle cx="100" cy="100" r="80" stroke-opacity="0.05" />
            <circle cx="100" cy="100" r="72" stroke-opacity="0.07" />
            <circle cx="100" cy="100" r="64" stroke-opacity="0.05" />
            <circle cx="100" cy="100" r="56" stroke-opacity="0.07" />
            <circle cx="100" cy="100" r="48" stroke-opacity="0.05" />
          </g>

          <!-- Лейбл -->
          <circle cx="100" cy="100" r="34" fill="url(#labelGrad)" />
          <circle cx="100" cy="100" r="34" fill="#000" fill-opacity="0.12" />
          <!-- Метка, чтобы вращение было заметно -->
          <rect x="97" y="70" width="6" height="12" rx="3" fill="#0a0a0c" fill-opacity="0.35" />
          <circle cx="100" cy="100" r="6" fill="#0a0a0c" />
        </svg>

        <!-- Тонарм: опускается на пластинку и мягко дрожит -->
        <svg class="tonearm" viewBox="0 0 120 120" role="presentation">
          <circle cx="102" cy="18" r="9" fill="#1c1c24" stroke="rgba(255,255,255,0.14)" />
          <line x1="102" y1="18" x2="54" y2="74" stroke="#b4b4c0" stroke-width="4" stroke-linecap="round" />
          <rect x="44" y="70" width="16" height="10" rx="3" transform="rotate(-40 52 75)" fill="#7c5cff" />
        </svg>
      </div>

      <p class="caption">
        {{ wakingUp ? 'Раскручиваем вертушку' : 'Ставим пластинку' }}<span class="dots"><span>.</span><span>.</span><span>.</span></span>
      </p>
      <p class="hint">{{ wakingUp ? 'СЕРВЕР ПРОСЫПАЕТСЯ, ЭТО ЗАЙМЁТ ДО МИНУТЫ' : 'СОБИРАЕМ КАТАЛОГ' }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: var(--bg);
  background-image:
    radial-gradient(900px 500px at 15% -10%, rgba(124, 92, 255, 0.16), transparent 60%),
    radial-gradient(800px 500px at 95% -5%, rgba(0, 212, 255, 0.1), transparent 55%);
  opacity: 1;
  transition: opacity 0.45s var(--ease);
  // Небольшая задержка появления: мгновенные загрузки не мигают оверлеем
  animation: loaderIn 0.3s var(--ease) 0.12s backwards;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

@keyframes loaderIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loader-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 24px;
  text-align: center;
}

.eyebrow {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: var(--text-muted);
}

.turntable {
  position: relative;
  width: 208px;
  height: 208px;
}

.record {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow:
    0 24px 60px -20px rgba(0, 0, 0, 0.9),
    0 0 60px -18px rgba(124, 92, 255, 0.55);
  animation: spin 2.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tonearm {
  position: absolute;
  top: -12px;
  right: -26px;
  width: 118px;
  height: 118px;
  transform-origin: 85% 15%;
  animation: armDrop 2.4s var(--ease) both, armWobble 3.4s ease-in-out 2.4s infinite;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6));
}

@keyframes armDrop {
  from { transform: rotate(-24deg); }
  to { transform: rotate(0deg); }
}

@keyframes armWobble {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2.2deg); }
}

.caption {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text);
}

.dots span {
  animation: dotPulse 1.4s infinite;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0.15; }
  40% { opacity: 1; }
}

.hint {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  opacity: 0.75;
}

// Уважаем системную настройку «меньше движения»
@media (prefers-reduced-motion: reduce) {
  .record { animation-duration: 8s; }
  .tonearm { animation: none; }
  .dots span { animation: none; opacity: 0.6; }
}

@media (max-width: 480px) {
  .turntable { width: 168px; height: 168px; }
  .tonearm { width: 96px; height: 96px; right: -18px; }
  .caption { font-size: 1.2rem; }
}
</style>
