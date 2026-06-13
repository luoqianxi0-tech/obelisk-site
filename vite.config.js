import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm()],
  server: { port: 5173, host: true },
  build: { outDir: 'dist', sourcemap: true },
  base: '/',
  optimizeDeps: { exclude: ['@obelisk/wasm'] }
})
