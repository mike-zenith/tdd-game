module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "((?:tests|src)/.*\.spec\.ts)$",
  verbose: true,

  roots: ['<rootDir>/tests','<rootDir>/src'],
  transform: {
      '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover']
}
