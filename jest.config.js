module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true, // Enables coverage collection
  coverageDirectory: 'coverage', // Directory where coverage reports will be saved
  coverageThreshold: {
    global: {
      branches: 80, // Minimum threshold for branch coverage
      functions: 65, // Minimum threshold for function coverage
      lines: 80, // Minimum threshold for line coverage
      statements: 80, // Minimum threshold for statement coverage
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Types of coverage reports to generate
};
