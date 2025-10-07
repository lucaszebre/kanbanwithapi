import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 3000,
  },
});
