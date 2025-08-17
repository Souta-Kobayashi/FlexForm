// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  imports: {
    autoImport: true
  },
  runtimeConfig: {
    // サーバーサイドの環境変数
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    public: {
      // クライアントサイドでも利用可能
      appName: 'FlexForm',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
