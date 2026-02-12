import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
  },
  // Production build optimizations
  build: {
    // Use Terser for minification with console removal in production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.* statements in production (except error and warn)
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        // Specifically remove these console methods
        pure_funcs: mode === 'production'
          ? ['console.log', 'console.info', 'console.debug', 'console.trace']
          : [],
      },
    },
    // Disable source maps in production for security
    sourcemap: mode !== 'production',
    // Split vendor bundle into cacheable chunks for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-antd': ['ant-design-vue'],
          'vendor-bootstrap': ['bootstrap', 'bootstrap-vue-3'],
          'vendor-charts': ['vue3-apexcharts'],
          'vendor-utils': ['sweetalert2', 'moment', 'dompurify', 'nprogress'],
        },
      },
    },
  },
  // Environment-aware flag for conditional logging
  define: {
    __DEV__: mode !== 'production',
  },
}))
