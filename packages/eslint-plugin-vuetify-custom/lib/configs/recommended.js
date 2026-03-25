'use strict'

module.exports = {
  extends: require.resolve('./base'),
  rules: {
    'vuetify-custom/no-legacy-grid': 'error',
    'vuetify-custom/grid-unknown-attributes': 'error',
  },
}
