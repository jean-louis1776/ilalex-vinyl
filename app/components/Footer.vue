<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <span class="footer-brand">ILALEX<span class="accent">Vinyl</span></span>
      <p class="copyright">© {{ currentYear }} · Все права защищены</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--bg-soft);
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: center;
    text-align: center;
  }
}

.footer-brand {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);

  .accent {
    margin-left: 4px;
    background: var(--accent-grad);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.copyright {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
