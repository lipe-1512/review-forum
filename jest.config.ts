import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  
  testPathIgnorePatterns: [
    "/node_modules/",
    "/features/"
  ],
 

  testEnvironment: "node",
};

export default config;