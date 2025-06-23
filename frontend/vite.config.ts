import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    // Skip TypeScript checking during build - rely on IDE/CI for that
    // This prevents test files from breaking production builds
    target: 'es2020',
    sourcemap: true,
  },
  esbuild: {
    // Ignore TypeScript errors during transformation
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
