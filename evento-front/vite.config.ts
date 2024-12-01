import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
