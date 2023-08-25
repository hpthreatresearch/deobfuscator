// © Copyright 2023 HP Development Company, L.P.
import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.paths.json";

const jestConfig: JestConfigWithTsJest = {
  // verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    "@core/baker/baker-worker": "<rootDir>/tests/mocks/baker-worker-mock.ts",
    ...pathsToModuleNameMapper(compilerOptions.paths),
    "\\.md$": "<rootDir>/tests/mocks/file-mock.ts",
    "\\.css$": "<rootDir>/tests/mocks/style-mock.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/jest-setup.ts"],
  collectCoverageFrom: [
    "<rootDir>/src/**",
    "!**/__snapshots__/**",
    "!<rootDir>/src/core/config/templates/**",
    "!<rootDir>/src/core/config/scripts/**",
    "!**/index.ts",
    "!**/src/index.tsx"
  ]
};

export default jestConfig;
