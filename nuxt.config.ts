// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/supabase', '@nuxt/ui', "@nuxt/image", 'dayjs-nuxt'],
    colorMode: {
        preference: 'dark'
    },
    runtimeConfig: {
        jwtSecret: '',
    },
    devtools: {enabled: false}
})