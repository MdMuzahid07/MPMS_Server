// @ts-check
import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ======= Global Ignores =======
  {
    ignores: ["node_modules/", "dist/", "**/*.js"],
  },

  // ======= Base JS Recommended =======
  pluginJs.configs.recommended,

  // ======= TypeScript Recommended =======
  ...tseslint.configs.recommended,

  // ======= Custom Overrides =======
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ======= Disabled - TS Version Handles This =======
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // ======= Disabled - TypeScript Compiler Handles This =======
      "no-undef": "off",

      // ======= General Rules =======
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-console": "warn",

      // ======= TypeScript Specific =======
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  }
);
