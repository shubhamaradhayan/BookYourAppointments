import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    port: 5173,
    proxy: {
      "/bookflow-api": {
        // target: "https://palegoldenrod-capybara-882921.hostingersite.com/bookflow/api",
        target: "http://localhost/bookflow/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bookflow-api/, ""),
      },
    },
  },
});

