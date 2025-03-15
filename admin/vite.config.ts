import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000, // Your Vite dev server port
    proxy: {
      "/api": {
        target: "https://stylish-skb8.onrender.com", // Your backend URL
        changeOrigin: true,
        secure: true, // Ensures SSL/TLS is used (since your backend is HTTPS)
      },
    },
  },
})

