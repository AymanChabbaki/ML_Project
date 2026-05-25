import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Catch any request starting with /api
      '/api': {
        target: 'http://localhost:8000', // Your local FastAPI server
        changeOrigin: true,
        // Strip the '/api' prefix before sending to FastAPI
        // (e.g., /api/predict becomes /predict)
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})