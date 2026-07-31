// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  css: ['~/styles/main.scss'],
  runtimeConfig: {
    public: {
      // Публичный read-only API каталога (apps/api). Переопределяется
      // переменной NUXT_PUBLIC_API_BASE при сборке/деплое.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
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
