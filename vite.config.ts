import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/crm/',
  plugins: [react()],
  preview: {
    allowedHosts: ['safarwanderlust.com'],
    port: 4173, // optional, default preview port
  },
})