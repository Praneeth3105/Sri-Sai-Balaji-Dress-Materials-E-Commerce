import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import babel from '@rolldown/plugin-babel'
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
       "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
