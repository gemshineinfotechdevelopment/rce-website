import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const currentDir = import.meta.dirname || process.cwd()

  // Load environment variables from src folder (where src/.env lives) and root folder
  const srcEnv = loadEnv(mode, path.resolve(currentDir, 'src'), '')
  const rootEnv = loadEnv(mode, process.cwd(), '')
  const env = { ...rootEnv, ...srcEnv }

  // Frontend port (default: 5173)
  const port = Number(env.VITE_PORT || 5173)
  // Backend API port (default: http://localhost:5024)
  const apiTarget = env.VITE_API_BACKEND_PORT || env.BACKEND_URL || 'http://localhost:5024'

  return {
    plugins: [react()],
    // Direct Vite to read .env from src folder
    envDir: path.resolve(currentDir, 'src'),
    server: {
      port,
      strictPort: false,
      open: true,
      proxy: {
        // Transparently proxy all API and upload requests to backend so frontend & backend act as the SAME port (5173)
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
