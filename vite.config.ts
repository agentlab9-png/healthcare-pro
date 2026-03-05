import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HealthCare Pro',
        short_name: 'HealthCare',
        description: 'منصة الرعاية الصحية الذكية',
        theme_color: '#2E7D6B',
        background_color: '#EEF4FB',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          {
            src: 'vite.svg',
            sizes: '48x48',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
