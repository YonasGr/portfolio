import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // `old/` holds the previous Astro site, kept for reference only.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "old/**"]),
]);
