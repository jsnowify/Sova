import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      plugins: [typography],
    }),
  ],
  server: {
    // Add this server configuration
    hmr: {
      host: "localhost", // This can sometimes help with HMR issues behind proxies
      protocol: "ws",
    },
    host: true, // This allows Vite to be accessible externally, useful for ngrok
    watch: {
      usePolling: true, // Add this if hot reload doesn't work
    },
    allowedHosts: [
      "9f24-143-44-185-202.ngrok-free.app", // This is your FRONTEND's ngrok URL
      // You can also add 'localhost' or other specific hosts if needed
    ],
  },
});
