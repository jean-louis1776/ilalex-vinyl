// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  css: ['~/styles/main.scss'],
  runtimeConfig: {
    public: {
      // Публичный read-only API каталога (apps/api). По умолчанию — прод на
      // Render, чтобы деплой работал без дополнительной настройки. Локальная
      // разработка перекрывает адрес через NUXT_PUBLIC_API_BASE в apps/web/.env
      // (см. .env.example).
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://ilalex-vinyl-api.onrender.com',
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
