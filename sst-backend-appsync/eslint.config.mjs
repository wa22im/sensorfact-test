// @ts-check

import globals from "globals";
import { configs, parser, config } from "typescript-eslint";
import eslint from "@eslint/js";
import prettierPluginConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

/**
 * @typedef {import('eslint').Linter.Config} ESLintConfig
 */
export default config(
  {
    ignores: [
      "**/node_modules",
      "**/cdk.out",
      "**/.sst",
      "**/package-lock.json",
      "**/package.json",
      "**/.vscode/",
      "**/.idea/",
      "**/coverage",
    ],
  },
  eslint.configs.recommended,
  ...configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettierPluginConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: parser,
      ecmaVersion: 6,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: {
          extensions: [".js", ".ts", ".mjs", ".cjs"],
        },
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Allow less strict types in unit tests
    files: ["**/*.test.ts", "**/vitest.setup.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
