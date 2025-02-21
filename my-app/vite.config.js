import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "0b3ef14f-009e-4888-b1f1-65db8c9f754b-00-1henwoak6enzc.janeway.replit.dev",
    ],
  },
});
