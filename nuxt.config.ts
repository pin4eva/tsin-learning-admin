// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || "",
      JWT_TOKEN: process.env.JWT_TOKEN || "",
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui']
})
