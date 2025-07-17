import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // Indica ao Jest como transformar arquivos TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Padrões para encontrar AMBOS os tipos de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.ts',      // Seus testes de API
    '**/features/**/*.steps.ts'   // Testes BDD do outro projeto
  ],

  // Ambiente de teste para backend
  testEnvironment: "node",
};

export default config;