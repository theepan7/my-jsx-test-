import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default Object.assign(defineConfig({
  plugins: [react()],
  base: './', // Using './' instead of '/repo-name/' makes it work ALMOST anywhere!
}))
