module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'netlify/functions/**/*.js',
    'server.js',
    '!node_modules/**'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  verbose: true
};