import { defineConfig, globalIgnores } from "eslint/config";
import biome from "eslint-config-biome";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  biome,
  {
    files: ["components/ui/dotted-map.tsx"],
    rules: { "react-hooks/preserve-manual-memoization": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "content/**/.obsidian/**"]),
]);
