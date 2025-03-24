import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Or use '0.0.0.0' to bind all network interfaces
    port: 5173, // Change if needed
  },
})
