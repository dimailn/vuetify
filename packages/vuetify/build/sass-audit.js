'use strict'

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const sass = require('sass')

const sourceRoot = path.resolve(__dirname, '../src')
const stylesEntry = path.join(sourceRoot, 'styles/styles.sass')
const customVariablesEntry = path.resolve(__dirname, 'sass-audit-variables.scss')
const forbidden = ['import', 'legacy-js-api', 'slash-div', 'global-builtin', 'if-function', 'color-functions']

function walk (directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(target)
    return /\.s[ac]ss$/.test(entry.name) ? [target] : []
  })
}

function resolveImport (from, request) {
  if (/^(?:url\(|https?:|sass:)/.test(request) || request.endsWith('.css')) return null
  const base = path.resolve(path.dirname(from), request)
  const extension = path.extname(base)
  const directory = path.dirname(base)
  const name = path.basename(base)
  const candidates = extension
    ? [base, path.join(directory, `_${name}`)]
    : [
        `${base}.sass`, `${base}.scss`,
        path.join(directory, `_${name}.sass`), path.join(directory, `_${name}.scss`),
        path.join(base, 'index.sass'), path.join(base, 'index.scss'),
        path.join(base, '_index.sass'), path.join(base, '_index.scss'),
      ]
  return candidates.find(candidate => fs.existsSync(candidate)) || null
}

function dependencies (file) {
  const contents = fs.readFileSync(file, 'utf8')
  return [...contents.matchAll(/@(?:import|use|forward)\s+(?:url\()?['"]([^'"]+)['"]/g)]
    .map(match => resolveImport(file, match[1]))
    .filter(Boolean)
}

function reachableFrom (entries) {
  const reached = new Set()
  const pending = [...entries]
  while (pending.length) {
    const file = pending.pop()
    if (reached.has(file)) continue
    reached.add(file)
    pending.push(...dependencies(file))
  }
  return reached
}

async function main () {
  const files = walk(sourceRoot).sort()
  const entries = files.filter(file => !path.basename(file).startsWith('_'))
  const reached = reachableFrom(entries)
  const unreachable = files.filter(file => !reached.has(file))
  const targets = [
    ...entries.map(file => ({ file, source: null })),
    ...unreachable.map(file => ({
      file,
      source: `@use '${stylesEntry.replace(/\\/g, '/')}';\n@use '${file.replace(/\\/g, '/')}';\n`,
    })),
  ]
  const warnings = new Map()
  const locations = new Map()
  const errors = []

  for (const target of targets) {
    const logger = {
      warn: (message, options) => {
        const id = options.deprecationType && options.deprecationType.id
          ? options.deprecationType.id
          : 'unknown'
        const location = options.span && options.span.url
          ? `${path.relative(sourceRoot, options.span.url.pathname)}:${options.span.start.line + 1}`
          : path.relative(sourceRoot, target.file)
        warnings.set(id, (warnings.get(id) || 0) + 1)
        locations.set(`${id}\t${location}`, (locations.get(`${id}\t${location}`) || 0) + 1)
      },
      debug: () => {},
    }
    const options = {
      loadPaths: [sourceRoot],
      verbose: true,
      quietDeps: false,
      silenceDeprecations: [],
      fatalDeprecations: forbidden,
      logger,
    }

    try {
      if (target.source) {
        await sass.compileStringAsync(target.source, {
          ...options,
          syntax: 'scss',
          url: pathToFileURL(`${target.file}.audit.scss`),
        })
      } else {
        await sass.compileAsync(target.file, options)
      }
    } catch (error) {
      errors.push(`${path.relative(sourceRoot, target.file)}: ${error.message}`)
    }
  }

  // Vuetify's public Sass contract allows a consumer variables file to be
  // imported before individual component entries. Keep this separate from the
  // per-file audit so an accidental top-level `@use` fails explicitly.
  try {
    const toolbarEntry = path.join(sourceRoot, 'components/VToolbar/VToolbar.sass')
    const inputEntry = path.join(sourceRoot, 'components/VInput/VInput.sass')
    const legacyGridEntry = path.join(sourceRoot, 'components/VGrid/_grid.sass')
    const result = await sass.compileStringAsync(`
      @use '${customVariablesEntry.replace(/\\/g, '/')}' as config;
      @use '${stylesEntry.replace(/\\/g, '/')}' with (
        $body-font-family: config.$body-font-family,
        $font-size-root: config.$font-size-root
      );
      @use '${toolbarEntry.replace(/\\/g, '/').replace('/VToolbar.sass', '/_variables.scss')}' as toolbarVariables with (
        $toolbar-title-padding: config.$toolbar-title-padding
      );
      @use '${inputEntry.replace(/\\/g, '/').replace('/VInput.sass', '/_variables.scss')}' as inputVariables with (
        $input-font-size: config.$input-font-size
      );
      @use '${toolbarEntry.replace(/\\/g, '/')}';
      @use '${inputEntry.replace(/\\/g, '/')}';
      @use '${legacyGridEntry.replace(/\\/g, '/')}';

      .vuetify-sass-contract-audit {
        font-family: styles.$body-font-family;
        font-size: styles.$font-size-root;
      }
    `, {
      loadPaths: [sourceRoot],
      quietDeps: false,
      fatalDeprecations: forbidden,
      logger: { warn: () => {}, debug: () => {} },
    })

    if (!result.css.includes('font-family: "Vuetify Sass contract audit"') ||
        !result.css.includes('font-size: 13px')) {
      errors.push('custom variables contract: component entries ignored consumer variables')
    }
  } catch (error) {
    errors.push(`custom variables contract: ${error.message}`)
  }

  console.log(`Sass files: ${files.length}; entries: ${entries.length}; reachable: ${reached.size}; wrappers: ${unreachable.length}`)
  console.log('Deprecations:')
  ;[...warnings].sort().forEach(([id, count]) => console.log(`  ${id}: ${count}`))
  console.log('Top locations:')
  ;[...locations].sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([location, count]) => console.log(`  ${count}\t${location}`))
  if (errors.length) {
    console.error('Compilation failures:')
    errors.forEach(error => console.error(`  ${error}`))
  }

  const disallowed = [...warnings].filter(([, count]) => count)
  if (errors.length || disallowed.length) process.exitCode = 1
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
