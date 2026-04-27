import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import tanstackQuery from "@tanstack/eslint-plugin-query"
import perfectionist from "eslint-plugin-perfectionist"
import unusedImports from "eslint-plugin-unused-imports"
import prettier from "eslint-config-prettier"

const eslintConfig = defineConfig([
  // ─── Base ─────────────────────────────────────────────────────────────
  ...nextVitals,
  ...nextTs,
  ...tanstackQuery.configs["flat/recommended"],

  // ─── Perfectionist: 정렬 강제 ─────────────────────────────────────────
  {
    plugins: { perfectionist },
    rules: {
      // import 정렬: builtin → external → internal(@/) → parent → sibling
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "side-effect",
            "unknown",
          ],
          internalPattern: ["^@/"],
          newlinesBetween: 1,
        },
      ],
      // named import 내부 알파벳 정렬
      "perfectionist/sort-named-imports": ["error", { type: "alphabetical", order: "asc" }],
      // JSX props 알파벳 정렬 (shorthand-prop 먼저, multiline 마지막)
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          groups: ["shorthand-prop", "prop", "multiline-prop"],
        },
      ],
      // 객체 키 알파벳 정렬
      "perfectionist/sort-objects": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          // 구조 분해, 타입 정의에도 적용
          partitionByComment: true,
        },
      ],
      // named export 알파벳 정렬
      "perfectionist/sort-named-exports": ["error", { type: "alphabetical", order: "asc" }],
    },
  },

  // ─── Unused imports / variables ───────────────────────────────────────
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      // @typescript-eslint/no-unused-vars 대신 unused-imports 사용 (auto-fix 지원)
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // ─── TypeScript 품질 규칙 ──────────────────────────────────────────────
  {
    rules: {
      // any 금지 (CLAUDE.md 원칙)
      "@typescript-eslint/no-explicit-any": "error",
      // as 타입 단언 금지 — angle-bracket 형식도 금지, satisfies는 허용
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
      // type import 강제: import { type Foo } 형태
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // non-null assertion(!) 경고
      "@typescript-eslint/no-non-null-assertion": "warn",
      // 빈 인터페이스 금지
      "@typescript-eslint/no-empty-object-type": "error",
    },
  },

  // ─── 일반 코드 품질 ────────────────────────────────────────────────────
  {
    rules: {
      // console은 경고 (warn) — 프로덕션 코드에 console 남기지 않도록
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // arrow function만 허용 (CLAUDE.md 원칙)
      "func-style": ["error", "expression"],
      // 사용하지 않는 표현식 금지
      "no-unused-expressions": "error",
      // === 강제 (== 금지)
      eqeqeq: ["error", "always"],
      // 중복 import 금지
      "no-duplicate-imports": "error",
      // var 사용 금지
      "no-var": "error",
      // const 우선
      "prefer-const": "error",
    },
  },

  // ─── React 관련 ────────────────────────────────────────────────────────
  {
    rules: {
      // key로 index 사용 금지 (CLAUDE.md 원칙)
      "react/no-array-index-key": "error",
      // self-closing 태그 강제
      "react/self-closing-comp": ["error", { component: true, html: true }],
    },
  },

  // ─── Prettier: 포맷 규칙 충돌 비활성화 (반드시 마지막) ─────────────────
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig
