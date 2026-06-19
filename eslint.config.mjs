import { defineConfig, globalIgnores } from "eslint/config";
import biome from "eslint-config-biome";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  biome,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
