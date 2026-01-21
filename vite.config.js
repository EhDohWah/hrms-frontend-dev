import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      moment: 'moment/moment.js'
    },
  },
  server: {
    port: 8080, // Development server port
  },
  base: '/',
  optimizeDeps: {
    include: ['vue-draggable-next']
  }
})
