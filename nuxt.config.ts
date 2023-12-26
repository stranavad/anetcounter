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
            name: 'Dny stesti',
            short_name: 'Dny stesti',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'favicon.icon',
                    sizes: '250x250',
                    type: 'image/ico',
                },
            ],
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
            installPrompt: true,
            // you don't need to include this: only for testing purposes
            // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
            periodicSyncForUpdates: 20,
        },
    },
    devtools: {enabled: false}
})
