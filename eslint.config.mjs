import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
  languageOptions: {
    globals: {
      ...globals.commonjs,
      ...globals.node,
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
    },

    ecmaVersion: 2020,
    sourceType: "module",
  },

  rules: {
    "no-unused-vars": "warn",
    "no-undef": "off",
  },

},
{
  ignores: ["dist/"]
}];
