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
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/flexform',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || 'your-email@gmail.com',
    smtpPass: process.env.SMTP_PASS || 'your-app-password',
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
