import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5181,
    open: false,
    // en desarrollo, los formularios van al servidor PHP local (npm run dev:api)
    proxy: { '/api': { target: 'http://127.0.0.1:8091', changeOrigin: false } },
  },
});
