import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { //
    include: ['@mui/material/Unstable_Grid2'],
  },
  resolve: {
    alias: {
      '@images': '/src/assets/images',
    },
  },
  define:{
    global:'window'
  },
  server: {
    proxy: {
      "/ws": {
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true,
      },
    },
  },

})
