import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Short git SHA on Vercel builds — surfaced in the hero bar so you can confirm production updated. */
const buildRef =
  (typeof process !== 'undefined' && process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)) || ''

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_REF__: JSON.stringify(buildRef),
  },
})
