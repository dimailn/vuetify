module.exports = {
  overrides: [
    {
      files: [
        'src/examples/**/*.vue',
      ],
      rules: {
        'max-len': 'off', // lorem ipsum is long
        'vue/html-self-closing': ['error', {
          html: {
            void: 'never',
            normal: 'never',
            component: 'never',
          },
          svg: 'always',
          math: 'always',
        }],
        'vue/v-slot-style': ['warn', {
          default: 'longform',
          named: 'longform',
        }],
        'vuetify-custom/no-deprecated-classes': 'error',
        'vuetify-custom/grid-unknown-attributes': 'error',
        'vuetify-custom/no-legacy-grid': 'error',
      },
    },
    {
      files: [
        'src/examples/**/usage.vue',
      ],
      rules: {
        'vue/html-self-closing': 'warn',
      },
    },
  ],
}
