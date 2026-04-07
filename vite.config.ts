/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite' // Import loadEnv to access environment variables

// https://vite.dev/config/
// TODO - Criar alias para referenciar diretórios de componentes e páginas
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }
})
