module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'public/**/*.js',
    'server.js',
    '!public/app-updates.js',
    '!**/node_modules/**'
  ],
  verbose: true
};
