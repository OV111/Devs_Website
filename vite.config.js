
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // or "./" if no src
    },
  },
  // gsap ships CJS/ESM interop that breaks when Node loads it externally;
  // bundling it keeps the build-time prerender working.
  ssr: { noExternal: ["gsap"] },
  build: {
    cssMinify: true,
    rollupOptions: {
      // Vendor splitting is client-only; the SSR prerender build keeps deps external.
      output: isSsrBuild ? {} : {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-mui": ["@mui/material", "@mui/icons-material"],
          "vendor-gsap": ["gsap"],
          "vendor-icons": ["react-icons"],
          "vendor-toast": ["react-hot-toast"],
          "vendor-forms": ["react-hook-form"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
