import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  test: {
    environment: "node",

    env: {
      DATABASE_URL: "file:./test.db",
    },

    globalSetup: ["./tests/setup/vitest.global.ts"],
  },
});