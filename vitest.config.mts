import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: [
        "index.mjs"
      ],
    },
  },
});
