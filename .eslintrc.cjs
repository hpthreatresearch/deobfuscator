module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["react", "prettier", "@typescript-eslint"],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {},
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
    ],
  },
  overrides: [],
};
