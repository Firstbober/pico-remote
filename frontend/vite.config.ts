import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            includeAssets: ['apple-touch-icon.png', 'pico-remote.svg', 'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png'],
            manifest: {
                name: 'Pico Remote',
                short_name: 'Pico Remote',
                description: 'Web remote for pico remote server',
                theme_color: '#121212',
                icons: [
                    {
                        src: 'web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
})