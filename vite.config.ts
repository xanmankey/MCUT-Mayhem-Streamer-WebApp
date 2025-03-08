import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync("cert.key"), // Use .key file
      cert: fs.readFileSync("cert.crt"), // Use .crt file
    },
    port: 8080,
  },
  build: {
    rollupOptions: {
      // Entry points
      input: {
        config: path.resolve(__dirname, "config.html"),
        streamer: path.resolve(__dirname, "streamer.html"),
        viewer: path.resolve(__dirname, "viewer.html"),
      },
      // Configure output filenames without the hash
      output: {
        entryFileNames: `[name].js`, // Keeps the entry file name as-is
        chunkFileNames: `[name].js`, // Keeps chunk files as-is
        assetFileNames: `[name].[ext]`, // Keeps asset filenames as-is (e.g., images, css)
        preserveModules: false, // Preserves module structure in the output directory
      },
    },
  },
});
