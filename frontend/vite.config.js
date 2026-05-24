import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict': 'http://localhost:8000',
      '/structure': 'http://localhost:8000',
      '/structure3d': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})
