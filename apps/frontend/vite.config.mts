// apps/frontend/vite.config.mts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@openchat/lib': path.resolve(__dirname, '../../packages/lib/src'),
      '@openchat/components': path.resolve(__dirname, '../../packages/components/src'),
    }
  },
  root: ".",
  server: {
    fs: {
      // allow serving files from the monorepo root
      allow: [path.resolve(__dirname, '../../')]
    }
  },
})
