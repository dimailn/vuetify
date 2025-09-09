module.exports = {
  verbose: !process.env.CI, // Подробный вывод локально, краткий в CI
  silent: process.env.CI === 'true',
  testFailureExitCode: 1,
  bail: false,
  errorOnDeprecated: false,
  testEnvironment: 'jest-environment-jsdom-fourteen',
  roots: [
    '<rootDir>/src',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/index.ts',
  ],
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  moduleDirectories: [
    'node_modules',
  ],
  moduleNameMapper: {
    '^@/test$': '<rootDir>/test/index.js',
    '^@/test/(.*)$': '<rootDir>/test/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.(styl)$': 'jest-css-modules',
    '\\.(sass|scss)$': 'jest-css-modules',
    '.*\\.(j|t)s$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!.*)',
  ],
  snapshotSerializers: [
    'jest-serializer-html',
  ],
  reporters: process.env.CI ? [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
      suiteName: 'Vuetify Jest Tests'
    }]
  ] : ['default'],
  testMatch: [
    // Default
    '**/test/**/*.js',
    '**/__tests__/**/*.spec.js',
    '**/__tests__/**/*.spec.ts',
  ],
}
