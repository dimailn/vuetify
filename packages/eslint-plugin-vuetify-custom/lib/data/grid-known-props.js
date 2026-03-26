'use strict'

/**
 * Статические списки пропов v-container / v-row / v-col под @dimailn/vuetify (Vue 3, VGrid).
 * Синхронизировать с packages/vuetify/src/components/VGrid/*.ts при изменении API.
 * Имена в kebab-case, как в шаблонах и в hyphenate() из helpers.
 */

const { hyphenate } = require('../util/helpers')

const BP = ['sm', 'md', 'lg', 'xl']

function upperFirst (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function buildKnownGridTags () {
  const vContainer = ['id', 'tag', 'fluid'].map(p => hyphenate(p))

  const vRow = new Set([
    hyphenate('tag'),
    hyphenate('dense'),
    hyphenate('noGutters'),
    hyphenate('align'),
    hyphenate('justify'),
    hyphenate('alignContent'),
  ])
  for (const bp of BP) {
    vRow.add(hyphenate('align' + upperFirst(bp)))
    vRow.add(hyphenate('justify' + upperFirst(bp)))
    vRow.add(hyphenate('alignContent' + upperFirst(bp)))
  }

  const vCol = new Set([
    hyphenate('cols'),
    hyphenate('offset'),
    hyphenate('order'),
    hyphenate('alignSelf'),
    hyphenate('tag'),
  ])
  for (const bp of BP) {
    vCol.add(bp)
    vCol.add(hyphenate('offset' + upperFirst(bp)))
    vCol.add(hyphenate('order' + upperFirst(bp)))
  }

  const sort = (arr) => [...arr].sort()

  return {
    VContainer: sort(vContainer),
    VRow: sort(vRow),
    VCol: sort(vCol),
  }
}

const knownGridTagsStatic = buildKnownGridTags()

module.exports = {
  knownGridTagsStatic,
  buildKnownGridTags,
}
