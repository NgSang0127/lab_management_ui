import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/material/Slider',
      '@mui/material/utils',
      '@mui/material/Unstable_Grid2',
      '@mui/x-data-grid',
    ],
    exclude: [], // Có thể thêm các module không cần tối ưu hóa nếu cần
  },
  resolve: {
    alias: {
      '@images': '/src/assets/images',
    },
  },
  define: {
    global: 'window',
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
});