import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // ── Temel JS kuralları ──────────────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript dosyaları ─────────────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────────────────
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],

      // ── React Hooks ─────────────────────────────────────────────────────
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",

      // ── React ───────────────────────────────────────────────────────────
      "react/react-in-jsx-scope": "off",  // React 17+ — import gerekmez
      "react/prop-types": "off",           // TypeScript zaten tip güvencesi sağlıyor

      // ── React Native ────────────────────────────────────────────────────
      "react-native/no-unused-styles": "warn",
      "react-native/no-inline-styles": "off",   // satır içi stiller tolere

      // ── Prettier ────────────────────────────────────────────────────────
      "prettier/prettier": "warn",

      // ── Genel ───────────────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // ── Prettier kural çakışmalarını kapat ──────────────────────────────────
  prettierConfig,

  // ── İgnore listesi ──────────────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "mock-server/node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
  },
];
