import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed under /disco-elysium-css-formatter/ on GitHub Pages (project site).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
});
