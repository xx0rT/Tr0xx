import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // repo subpath on GitHub Pages (xx0rt.github.io/Tr0xx/)
  base: '/Tr0xx/',
  plugins: [react()],
})
