module.exports = {
  preset: 'ts-jest/presets/default',
  testEnvironment: 'jsdom',
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
  
  // Transform configuration
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        isolatedModules: true,
      },
    ],
  },
  
  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  
  // Module path aliases
  moduleDirectories: ['node_modules', 'client/src'],
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Test environment
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
