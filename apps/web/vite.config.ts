import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Dynamically import ESM-only plugin to avoid `require`-loading error
export default defineConfig(async () => {
  const { default: tsconfigPaths } = await import("vite-tsconfig-paths");
  return {
    plugins: [react(), tsconfigPaths()],
  };
});
