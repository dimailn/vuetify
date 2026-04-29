#!/usr/bin/env node
/**
 * vuetify-loader (matcher/generator) при require резолвит `vuetify/es5/components`.
 * В монорепо `vuetify` — это packages/vuetify; каталог es5 появляется только после
 * `yarn build:lib` в этом пакете. Без него документация и vue-cli-service падают.
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const vuetifyRoot = path.resolve(__dirname, '../../vuetify')
const marker = path.join(vuetifyRoot, 'es5', 'components')

if (fs.existsSync(marker)) {
  process.exit(0)
}

console.warn(
  '[docs] Нет packages/vuetify/es5 (нужно для vuetify-loader). Запускаем yarn build:lib…',
)

execSync('yarn build:lib', { cwd: vuetifyRoot, stdio: 'inherit' })
