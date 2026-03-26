module.exports = {
  globals: {
    __VUETIFY_VERSION__: true,
    __REQUIRED_VUE__: true,
  },
  env: {
    'jest/globals': true,
  },
  plugins: [
    'jest',
    'eslint-plugin-local-rules',
  ],
  extends: ['plugin:jest/recommended'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: {
        max: 1,
      },
    }],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'local-rules/no-render-string-reference': 'error',
    'jest/no-disabled-tests': 'off',
    'jest/no-large-snapshots': 'warn',
    'jest/prefer-spy-on': 'warn',
    'jest/prefer-to-contain': 'warn',
    'jest/prefer-to-have-length': 'warn',
    'jest/no-standalone-expect': 'off',
    'jest/no-conditional-expect': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-explicit-emits': 'off',
    '@typescript-eslint/member-ordering': 'off',
    'jest/expect-expect': 'off',

    'import/no-duplicates': 'off',
    'vue/no-deprecated-dollar-listeners-api': 'off',
    'vue/no-deprecated-events-api': 'off',
    'vue/require-slots-as-functions': 'off',
    'vue/custom-event-name-casing': 'off',
  },
  overrides: [
    {
      files: 'dev/Playground.vue',
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: '**/*.spec.ts',
      rules: {
        'no-console': 'off',
        'vue/component-definition-name-casing': 'off',
        'max-statements': 'off',
      },
    },
  ],
}
