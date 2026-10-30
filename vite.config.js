import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo las llamadas a /api se envían al backend Express
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      include: ['src/**/*.{js,jsx}', 'server/**/*.js'],
      exclude: ['**/*.test.{js,jsx}', 'src/main.jsx', 'server/index.js', 'server/db/**'],
    },
  },
});
