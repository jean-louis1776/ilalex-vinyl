<template>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="brand">
        <span class="brand-mark" aria-hidden="true">
          <span class="disc"></span>
        </span>
        <span class="brand-text">ILALEX<span class="brand-accent">Vinyl</span></span>
      </a>
      <span class="brand-tag">коллекция пластинок</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(18px);
  background: rgba(10, 10, 12, 0.7);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent-grad);
  box-shadow: 0 6px 20px -6px rgba(124, 92, 255, 0.6);
  transition: transform 0.6s var(--ease);

  .brand:hover & {
    transform: rotate(180deg);
  }
}

.disc {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg);
  box-shadow: 0 0 0 4px rgba(10, 10, 12, 0.25);
}

.brand-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
}

.brand-accent {
  margin-left: 6px;
  background: var(--accent-grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tag {
  margin-left: auto;
  font-size: 0.82rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;

  @media (max-width: 600px) {
    display: none;
  }
}
</style>
