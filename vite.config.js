import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: the browser calls /api/..., Vite forwards to API Gateway.
// This removes the CORS errors (red requests in DevTools) while developing.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Design-config server (plain HTTP, port 8000)
      '/design-api': {
        target: 'http://3.110.222.67:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/design-api/, ''),
      },
      '/api': {
        target: 'https://txs6owet18.execute-api.ap-south-1.amazonaws.com/dev',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
