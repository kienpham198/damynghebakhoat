
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.ADMIN_PASSWORD': JSON.stringify(process.env.ADMIN_PASSWORD || 'bakhoat123')
  },
  build: {
    outDir: 'dist'
  }
});
