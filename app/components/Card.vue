<script setup lang="ts">
import type { VinylListArray } from '~/data/vinyl-list';

const props = defineProps<{
  card: VinylListArray
  isPurchased: boolean
}>()

const emit = defineEmits<{
  togglePurchased: [id: number]
}>()

const handleTogglePurchased = () => { 
  emit('togglePurchased', props.card.id)
}
</script>

<template>
  <a
      :href="card.link"
      target="_blank"
      class="vinyl-card"
      :class="{ 'is-purchased': isPurchased }"
  >
    <div class="vinyl-image">
      <img :src="card.image" :alt="card.name" />
      <div v-if="isPurchased" class="purchased-overlay">
        <span class="purchased-badge">✓ Куплен</span>
      </div>
    </div>

    <div class="vinyl-info">
      <h3 class="vinyl-name">{{ card.name }}</h3>
      <p class="vinyl-artist">{{ card.artist }}</p>

      <div class="price-container">
        <p class="vinyl-price">
          <span class="current-price">{{ card.price }}₽</span>
        </p>
      </div>

      <div class="purchase-controls">
        <Transition name="fade" mode="out-in">
          <label
              v-if="!isPurchased"
              class="checkbox-label"
              @click.prevent="handleTogglePurchased"
          >
            <input
                type="checkbox"
                :checked="false"
                class="custom-checkbox"
            />
            <span class="checkbox-text">Уже купил</span>
          </label>
          <span v-else class="purchased-text">Куплен</span>
        </Transition>
      </div>

      <div class="vinyl-tags">
        <span v-if="card.important" class="tag tag-important">В ПЕРВУЮ ОЧЕРЕДЬ!!!</span>
        <span v-if="card.original" class="tag tag-original">ОРИГИНАЛ {{ card.original }}</span>
        <span v-if="card.repress" class="tag tag-repress">ПЕРЕИЗДАНИЕ {{ card.repress }}</span>
        <span v-if="card.sealed" class="tag tag-sealed">ЗАПЕЧАТАН</span>
      </div>
    </div>
  </a>
</template>

<style scoped lang="scss">
$color-primary: #4CAF50;
$color-danger: #e63946;
$color-info: #ffd93a;
$color-success: #00000012;
$color-warning: #96e47a;
$color-text-primary: #333;
$color-text-secondary: #666;
$color-text-muted: #999;
$color-white: white;
$color-black: #000;

$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);

$transition-base: 0.2s;
$transition-fade: 0.3s;

$border-radius-sm: 2px;
$border-radius-base: 4px;
$border-radius-lg: 20px;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card-hover {
  transform: translateY(-4px);
  box-shadow: $shadow-md;
}

.vinyl-card {
  background: $color-white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: transform $transition-base, box-shadow $transition-base, opacity $transition-fade;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  position: relative;

  &:hover {
    @include card-hover;
  }

  &.is-purchased {
    opacity: 0.6;
  }
}

.vinyl-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.purchased-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color-primary, 0.5);
  @include flex-center;
  animation: fadeIn $transition-fade ease;
}

.purchased-badge {
  background: $color-white;
  color: $color-primary;
  padding: 10px 20px;
  border-radius: $border-radius-lg;
  font-weight: bold;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.vinyl-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    gap: 6px;
  }
}

.vinyl-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: $color-text-primary;

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    line-height: 1.2;
  }
}

.vinyl-artist {
  font-size: 14px;
  color: $color-text-secondary;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
}

.price-container {
  margin: 4px 0;

  @media (max-width: 480px) {
    margin: 2px 0;
  }
}

.vinyl-price {
  font-size: 20px;
  font-weight: bold;
  color: $color-black;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    font-size: 18px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
}

.old-price {
  font-size: 16px;
  color: $color-text-muted;
  text-decoration: line-through;

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
}

.current-price {
  color: $color-danger;
}

.purchase-controls {
  min-height: 26px;
  display: flex;
  align-items: center;
  margin: 4px 0;

  @media (max-width: 768px) {
    min-height: 24px;
  }

  @media (max-width: 480px) {
    min-height: 20px;
    margin: 2px 0;
  }
}

.checkbox-label {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding-block: 5px;

  @media (max-width: 480px) {
    gap: 4px;
  }
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: $color-primary;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
}

.checkbox-text {
  font-size: 13px;
  color: $color-text-secondary;

  @media (max-width: 480px) {
    font-size: 10px;
  }
}

.purchased-text {
  font-size: 13px;
  color: $color-primary;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 10px;
  }
}

.vinyl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;

  @media (max-width: 480px) {
    gap: 3px;
    margin-top: 2px;
  }
}

.tag {
  font-size: 10px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: $border-radius-base;
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 8px;
    padding: 2px 4px;
  }

  &-important {
    background: $color-danger;
    color: $color-white;
  }

  &-original {
    background: $color-info;
    color: $color-black;
  }

  &-repress {
    background: $color-success;
    color: $color-black;
  }

  &-sealed {
    background: $color-warning;
    color: $color-black;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-fade ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>