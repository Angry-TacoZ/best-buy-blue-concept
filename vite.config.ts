import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/best-buy-blue-concept/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    css: true,
  },
})
