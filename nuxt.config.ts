// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/supabase', '@nuxt/ui', "@nuxt/image", 'dayjs-nuxt', '@vite-pwa/nuxt'],
    colorMode: {
        preference: 'dark'
    },
    runtimeConfig: {
        jwtSecret: '',
    },
    // supabase: {
    //     redirectOptions: {
    //         login: '/login',
    //         callback: '/confirm',
    //         exclude: ['/manifest.webmanifest'],
    //     }
    // },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Dny štěstí',
            short_name: 'Dny štěstí',
            theme_color: '#0f172a',
            icons: [
                {
                    src: 'favicon.icon',
                    sizes: '250x250',
                    type: 'image/ico',
                },
                {
                    src: 'pwa192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
            installPrompt: true,
            // you don't need to include this: only for testing purposes
            // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
            periodicSyncForUpdates: 3600,
        },
    },
    devtools: {enabled: false}
})
