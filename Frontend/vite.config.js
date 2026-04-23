import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://hkca.onrender.com',
        changeOrigin: true,
      }
    }
  },
  build: {
    modulePreload: {
      polyfill: false
    }
  }
})
