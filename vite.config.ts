/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite' // Import loadEnv here, usage depends on type

// https://vite.dev/config/
// TODO - Criar alias para referenciar diretórios de componentes e páginas
export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }
})
