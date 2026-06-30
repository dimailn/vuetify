const frontmatter = require('front-matter')
const { md } = require('./markdown-it')

function loader (source) {
  const parsed = frontmatter(source)
  const body = parsed.body || ''
  const html = md.render(body)
  const attributes = parsed.attributes || {}
  const template = `<div class="markdown-body">${html}</div>`

  return `export default {attributes:${JSON.stringify(attributes)},body:${JSON.stringify(body)},html:${JSON.stringify(html)},vue:{component:{template:${JSON.stringify(template)}}}}`
}

module.exports = loader
