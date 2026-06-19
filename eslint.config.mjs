import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import biome from 'eslint-config-biome';

export default defineConfig([
  ...nextVitals,
  biome,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
