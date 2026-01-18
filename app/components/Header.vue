<template>
  <header class="header">
    <h1 class="header_title">ILALEX Vinyl</h1>
  </header>
</template> 

<style scoped lang="scss">
.header {
  background: linear-gradient(155deg, #A4CFDA 0%, #57ADE3 15%, #005EE9 35%, #005EE9 65%, #00ACFC 125%);
  border-radius: 0 0 calc(12px * 1.5) calc(12px * 1.5);
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 2rem);
  box-shadow: 0 4px 20px rgba(0, 94, 233, 0.15);

  &_title {
    color: white;
    font-size: clamp(1.75rem, 5vw, 3rem);
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.02em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
}

// Адаптивность для разных экранов
@media (max-width: 768px) {
  .header {
    border-radius: 0 0 calc(12px * 1) calc(12px * 1);
  }
}

@media (max-width: 480px) {
  .header {
    border-radius: 0 0 calc(12px * 0.75) calc(12px * 0.75);

    &__title {
      letter-spacing: 0.01em;
    }
  }
}
</style>

