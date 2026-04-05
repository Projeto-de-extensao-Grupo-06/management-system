/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
// TODO - Criar alias para referenciar diretórios de componentes e páginas
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_BACKEND_BASE_URL || "http://localhost:8080/api";
  const apiTarget = new URL(apiBaseUrl).origin;

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
