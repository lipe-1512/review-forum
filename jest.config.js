/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Indica ao Jest para usar o preset do ts-jest. Isso configura automaticamente
  // o transformer para compilar arquivos TypeScript.
  preset: 'ts-jest',

  // Define o ambiente de teste. 'node' é essencial para testes de backend/API.
  testEnvironment: 'node',

  // Padrão para encontrar arquivos de teste.
  testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.ts'],

  // Onde salvar os relatórios de cobertura de código.
  coverageDirectory: 'coverage',

  // Coletar cobertura apenas dos arquivos da pasta 'src', excluindo arquivos de configuração.
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/infra/**',
    '!src/swagger.ts'
  ],

  // Limpa os mocks entre cada teste para garantir isolamento.
  clearMocks: true,
};