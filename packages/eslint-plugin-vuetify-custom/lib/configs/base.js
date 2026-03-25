'use strict'

module.exports = {
  plugins: [
    'vuetify-custom',
  ],
  rules: {
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],

    // Карты из eslint-plugin-vuetify 1.x; под форк не всегда точны — warn
    'vuetify-custom/no-deprecated-components': 'warn',
    'vuetify-custom/no-deprecated-props': 'warn',
    'vuetify-custom/no-deprecated-classes': 'warn',
  },
}
