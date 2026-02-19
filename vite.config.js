import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@signal': '/home/r2/Signal/companies',
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5176',
        changeOrigin: true,
      },
    },
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '/home/r2/Signal',
      ],
    },
  },
})
