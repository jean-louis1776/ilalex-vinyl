<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer-content"> 
      <div class="footer-info">
        <p class="copyright">
          © {{ currentYear }} ILALEX-Vinyl. Все права защищены.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, #e8eaf5 0%, #f0f2f8 50%, #f8f9fd 100%);
  color: #2d3748;
  padding: 2rem 0;
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-info {
    text-align: center;

    .copyright {
      margin: 0;
      font-size: 0.95rem;
      color: #4a5568;
      font-weight: 400;
      letter-spacing: 0.5px;
      transition: color 0.3s ease;

      &:hover {
        color: #1a202c;
      }
    }
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 0;

    .footer-content {
      padding: 0 1rem;
    }

    .footer-info .copyright {
      font-size: 0.85rem;
    }
  }
}
</style>