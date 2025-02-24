import { defineConfig } from "vite";
import svg from "../src/index.mjs";

export default defineConfig({
  plugins: [svg()],
});
