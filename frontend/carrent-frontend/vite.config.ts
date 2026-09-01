import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,

    host: "0.0.0.0",
  },

  preview: {
    port: 4173,

    host: "0.0.0.0",
  },

  build: {
    sourcemap: false,

    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
          ],

          maps: [
            "leaflet",
            "react-leaflet",
          ],

          charts: [
            "recharts",
          ],

          motion: [
            "framer-motion",
          ],
        },
      },
    },
  },
});