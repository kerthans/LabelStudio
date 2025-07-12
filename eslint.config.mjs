import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 未使用变量 - 严格处理
      "no-unused-vars": "off", // 关闭基础规则，使用 TS 版本
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ],

      // TypeScript 严格规则
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // 代码风格 - 自动修复
      "quotes": ["error", "double", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "no-trailing-spaces": "error",
      "eol-last": "error",

      // 基础代码质量
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "eqeqeq": "error",

      // React/Next.js
      "react/no-unescaped-entities": "error",
      "react/jsx-key": "error",
      "@next/next/no-img-element": "warn",

      // 导入相关
      "sort-imports": [
        "error",
        {
          "ignoreCase": false,
          "ignoreDeclarationSort": true,
          "ignoreMemberSort": false,
          "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }
      ],
    },
  },
];

export default eslintConfig;
