import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "react/no-unescaped-entities": "off", // ✅ Disable warning for unescaped ' / "
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ], // ✅ Ignore unused vars starting with _
      "@typescript-eslint/no-explicit-any": "off", // ✅ Allow use of any
    },
  },
];

export default eslintConfig;
