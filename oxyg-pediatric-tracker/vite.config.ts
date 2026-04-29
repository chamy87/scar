import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ["VITE_", "SUPABASE_", "NEXT_PUBLIC_"],
  build: {
    chunkSizeWarningLimit: 1200,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
