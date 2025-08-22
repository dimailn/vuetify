const base = require('../../jest.config')

module.exports = {
  ...base,
  name: 'Vuetify',
  displayName: 'Vuetify',
  setupFiles: [
    'jest-canvas-mock'
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node']
      }
    }
  }
}
