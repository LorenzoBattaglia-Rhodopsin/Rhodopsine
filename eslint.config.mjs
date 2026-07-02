import { FlatCompat } from "@eslint/eslintrc";

/**
 * Configurazione ESLint (flat config).
 *
 * `next lint` è stato rimosso in Next.js 16: il lint gira direttamente con la
 * CLI di ESLint (`npm run lint`). `FlatCompat` fa da ponte verso i preset
 * `eslint-config-next`, che usano ancora il formato legacy.
 */
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
