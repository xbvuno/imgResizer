import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "bvuno's imgResizer",
        "short_name": "imgResizer",
        "start_url": "/imgResizer/",
        "display": "standalone",
        "background_color": "#14161a",
        "theme_color": "#14161a",
        "icons": [
          {
            "src": "media/icons/48x48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "media/icons/144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "media/icons/196x196.png",
            "sizes": "196x196",
            "type": "image/png"
          },
          {
            "src": "media/icons/512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ],
  base: '/imgResizer/'
})
