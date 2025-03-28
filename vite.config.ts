import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    // https: {
    //   key: fs.readFileSync("localhost.key"), // Use .key file
    //   cert: fs.readFileSync("localhost.crt"), // Use .crt file
    // },
    port: 8080,
  },
  // build: {
  //   rollupOptions: {
  //     // Entry points
  //     input: {
  //       config: path.resolve(__dirname, "index.html"),
  //     },
  //     // Configure output filenames without the hash
  //     output: {
  //       entryFileNames: `[name].js`, // Keeps the entry file name as-is
  //       chunkFileNames: `[name].js`, // Keeps chunk files as-is
  //       assetFileNames: `[name].[ext]`, // Keeps asset filenames as-is (e.g., images, css)
  //       preserveModules: false, // Preserves module structure in the output directory
  //     },
  //   },
});
