<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Option {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  minWidth?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const currentLabel = () =>
  props.options.find(o => o.value === props.modelValue)?.label ?? ''

const select = (value: string) => {
  emit('update:modelValue', value)
  open.value = false
}

const toggle = () => {
  open.value = !open.value
}

const onClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="dd" :style="{ minWidth: minWidth }">
    <button
        type="button"
        class="dd-trigger"
        :class="{ open }"
        @click="toggle"
    >
      <span class="dd-value">{{ currentLabel() }}</span>
      <svg class="dd-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dd-pop">
      <ul v-if="open" class="dd-menu" role="listbox">
        <li
            v-for="opt in options"
            :key="opt.value"
            class="dd-option"
            :class="{ selected: opt.value === modelValue }"
            role="option"
            :aria-selected="opt.value === modelValue"
            @click="select(opt.value)"
        >
          <span>{{ opt.label }}</span>
          <svg v-if="opt.value === modelValue" class="dd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dd {
  position: relative;
}

.dd-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 14px 10px 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s var(--ease);

  &:hover {
    border-color: var(--border-strong);
  }

  &.open {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }
}

.dd-caret {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.3s var(--ease);

  .open & {
    transform: rotate(180deg);
    color: var(--accent);
  }
}

.dd-menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
}

.dd-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 12px;
  border-radius: var(--radius-xs);
  font-size: 0.9rem;
  color: var(--text-soft);
  cursor: pointer;
  transition: background 0.18s var(--ease), color 0.18s var(--ease);

  &:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  &.selected {
    color: var(--text);
    background: var(--accent-soft);
  }
}

.dd-check {
  width: 15px;
  height: 15px;
  color: var(--accent);
  flex-shrink: 0;
}

// Pop animation
.dd-pop-enter-active,
.dd-pop-leave-active {
  transition: opacity 0.18s var(--ease), transform 0.18s var(--ease);
  transform-origin: top;
}
.dd-pop-enter-from,
.dd-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
