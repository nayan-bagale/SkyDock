import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// Dynamically import ESM-only plugin to avoid `require`-loading error
export default defineConfig(async () => {
  const { default: tsconfigPaths } = await import("vite-tsconfig-paths");
  return {
    envDir: path.resolve(__dirname, "../../"),
    plugins: [react(), tsconfigPaths()],
  };
});
