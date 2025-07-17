/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Mantém o foco nos seus testes de API
  testMatch: ['**/tests/**/*.test.ts'],
  // Ignora os arquivos de BDD para o comando 'npm test'
  testPathIgnorePatterns: [
    "/node_modules/",
    "/features/"
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/infra/**',
    '!src/swagger.ts'
  ],
  clearMocks: true,
};