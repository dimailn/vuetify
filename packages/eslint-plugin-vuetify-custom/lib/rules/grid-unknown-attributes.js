'use strict'

const loadModule = require('../util/load-module')
const { hyphenate, classify, getAttributes } = require('../util/helpers')
const { isGridAttribute } = require('../util/grid-attributes')
const { addClass, removeAttr } = require('../util/fixers')
const { knownGridTagsStatic } = require('../data/grid-known-props')

const GRID_ROOTS = ['@dimailn/vuetify', 'vuetify']

function safeLoadDefault (id) {
  try {
    const m = loadModule(id)
    return m && m.default ? m.default : m
  } catch (e) {
    return null
  }
}

function buildTagsFromInstalledPackage () {
  for (const root of GRID_ROOTS) {
    const VContainer = safeLoadDefault(`${root}/es5/components/VGrid/VContainer`)
    const VRow = safeLoadDefault(`${root}/es5/components/VGrid/VRow`)
    const VCol = safeLoadDefault(`${root}/es5/components/VGrid/VCol`)
    const grid = { VContainer, VRow, VCol }
    const ok = Object.values(grid).every(c => c && c.options && c.options.props)
    if (!ok) continue

    return Object.keys(grid).reduce((t, k) => {
      t[classify(k)] = Object.keys(grid[k].options.props).map(p => hyphenate(p)).sort()
      return t
    }, {})
  }

  return null
}

const tags = buildTagsFromInstalledPackage() || knownGridTagsStatic

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Неизвестные атрибуты на v-container / v-row / v-col не превращаются в классы (Vue 3 @dimailn/vuetify)',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)
        if (!Object.prototype.hasOwnProperty.call(tags, tag)) return

        const attributes = getAttributes(element).filter(({ name }) => {
          return !tags[tag].includes(name) && !isGridAttribute(tag, name)
        })

        if (attributes.length) {
          context.report({
            node: element.startTag,
            loc: {
              start: attributes[0].node.loc.start,
              end: attributes[attributes.length - 1].node.loc.end,
            },
            message: 'Attributes are no longer converted into classes',
            fix (fixer) {
              const fixableAttrs = attributes.map(({ node }) => node)
                .filter(attr => !attr.directive)

              if (!fixableAttrs.length) return

              const className = fixableAttrs.map(node => node.key.rawName).join(' ')
              return [
                addClass(context, fixer, element, className),
                ...fixableAttrs.map(removeAttr.bind(this, context, fixer)),
              ]
            },
          })
        }
      },
    })
  },
}
