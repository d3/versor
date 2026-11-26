import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
import {defineConfig} from "eslint/config";

export default defineConfig([
  {ignores: ["dist/"]},
  {files: ["**/*.{js,ts}"], extends: [js.configs.recommended, ts.configs.recommended]},
  {files: ["src/**/*.{js,ts}"], languageOptions: {globals: globals.browser}},
  {files: ["test/**/*.{js,ts}"], languageOptions: {globals: globals.node}},
  {rules: {"@typescript-eslint/no-unused-expressions": 0}},
  {files: ["rollup.config.js"], languageOptions: {ecmaVersion: 2026}}
]);
