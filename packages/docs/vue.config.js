const path = require('path')
const fs = require('fs')
const Module = require('module')
const webpack = require('webpack')

/**
 * vuetify-loader при загрузке выполняет require('vuetify/es5/...') в Node — алиас webpack на
 * `vuetify` не применяется. В workspace пакет называется @dimailn/vuetify, поэтому резолвим
 * префикс `vuetify/` на packages/vuetify (до любого require('vuetify-loader/...')).
 */
const vuetifyMonorepoRoot = path.resolve(__dirname, '../vuetify')
const originalResolveFilename = Module._resolveFilename
Module._resolveFilename = function patchedVuetifyResolve (request, parent, isMain, options) {
  if (request !== 'vuetify' && !request.startsWith('vuetify/')) {
    return originalResolveFilename.call(this, request, parent, isMain, options)
  }
  const relPath = request === 'vuetify' ? 'package.json' : request.slice('vuetify/'.length)
  const candidate = path.join(vuetifyMonorepoRoot, relPath)
  const resolveExisting = abs => {
    if (!fs.existsSync(abs)) return null
    const st = fs.statSync(abs)
    if (st.isFile()) return abs
    if (st.isDirectory()) {
      const indexJs = path.join(abs, 'index.js')
      if (fs.existsSync(indexJs)) return indexJs
    }
    return null
  }
  let abs = resolveExisting(candidate) || resolveExisting(candidate + '.js')
  if (abs) {
    return originalResolveFilename.call(this, abs, parent, isMain, options)
  }
  return originalResolveFilename.call(this, request, parent, isMain, options)
}

/**
 * Vue CLI 4 для Vue 3 подключает `vue-loader-v16`; vuetify-loader не считает его vue-loader
 * → «No matching rule for vue-loader». Патчим до первого require plugin.
 */
const vuetifyLoaderGetVueRules = require('vuetify-loader/lib/getVueRules')
const originalIsVueLoader = vuetifyLoaderGetVueRules.isVueLoader.bind(vuetifyLoaderGetVueRules)
let vueLoaderV16Path
try {
  vueLoaderV16Path = require.resolve('vue-loader-v16')
} catch (e) {}

function isVueLoaderCli4Vue3 (use) {
  if (!use || !use.loader) return false
  const l = String(use.loader)
  return (
    originalIsVueLoader(use) ||
    (vueLoaderV16Path && l === vueLoaderV16Path) ||
    l.includes('vue-loader-v16')
  )
}

function getVueRulesCli4Vue3 (compiler) {
  const rules = compiler.options.module.rules
  const flat = rules
    .map((rule, index) =>
      rule.use && rule.use.find && rule.use.find(isVueLoaderCli4Vue3)
        ? { rule: { ...rule }, index }
        : null,
    )
    .filter(Boolean)

  if (flat.length) return flat

  const oneOfHits = []
  rules.forEach((rule, index) => {
    if (!rule.oneOf) return
    rule.oneOf.forEach(sub => {
      if (sub.use && sub.use.find && sub.use.find(isVueLoaderCli4Vue3)) {
        oneOfHits.push({ rule: { ...sub }, index })
      }
    })
  })
  return oneOfHits
}

vuetifyLoaderGetVueRules.isVueLoader = isVueLoaderCli4Vue3
vuetifyLoaderGetVueRules.getVueRules = getVueRulesCli4Vue3

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const { IS_SERVER } = require('./src/util/globals')

/** Webpack 4 (Vue CLI 4) не резолвит `exports` у `@unhead/vue` / `unhead` — явные пути к `.mjs`. */
function unheadVueDist (file) {
  return path.join(path.dirname(require.resolve('@unhead/vue')), file)
}
function unheadDist (file) {
  return path.join(path.dirname(require.resolve('unhead')), file)
}

module.exports = {
  css: {
    extract: !IS_SERVER && { ignoreOrder: true },
    sourceMap: !IS_SERVER,
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
      // Иначе теги v-app / v-btn не резолвятся (treeshaking через парсинг шаблонов).
      new VuetifyLoaderPlugin(),
    ],
    resolve: {
      alias: {
        // Совместимость импортов `vuetify/...` со скоуп-пакетом workspace
        vuetify: path.resolve(__dirname, '../vuetify'),
        vue: path.resolve(__dirname, 'node_modules/vue'),
        // Единая точка импорта pathify с Vue 3-совместимыми get/sync для Options API.
        'vuex-pathify': path.resolve(__dirname, 'src/plugins/vuex-pathify.js'),
        '@unhead/vue/client': unheadVueDist('client.mjs'),
        '@unhead/vue/server': unheadVueDist('server.mjs'),
        'unhead/client': unheadDist('client.mjs'),
        'unhead/server': unheadDist('server.mjs'),
        'unhead/plugins': unheadDist('plugins.mjs'),
        'unhead/utils': unheadDist('utils.mjs'),
        'unhead/types': unheadDist('types.mjs'),
        'unhead/scripts': unheadDist('scripts.mjs'),
      },
    },
  },
  chainWebpack: config => {
    const applyVueLoaderPatch = use => {
      use.tap(options => {
        options = options || {}
        options.compilerOptions = options.compilerOptions || {}
        // Vue 3 + legacy Vuetify render paths: avoid hoisting vnodes with refs/directives
        options.compilerOptions.hoistStatic = false
        return options
      })
    }

    const vueRule = config.module.rule('vue')
    if (vueRule && vueRule.uses.has('vue-loader')) {
      applyVueLoaderPatch(vueRule.use('vue-loader'))
    }

    // In CLI4 + Vue3 setup vue-loader-v16 may be registered under this key.
    if (vueRule && vueRule.uses.has('vue-loader-v16')) {
      applyVueLoaderPatch(vueRule.use('vue-loader-v16'))
    }
  },
  devServer: {
    publicPath: '/',
    disableHostCheck: true,
    historyApiFallback: {
      rewrites: [
        { from: /eo-UY\/.*/, to: '/_crowdin.html' },
        { from: /.*/, to: '/_fallback.html' },
      ],
    },
    serveIndex: true,
    quiet: true,
  },
  pwa: {
    name: 'Vuetify Documentation',
    themeColor: '#1867C0',
    msTileColor: '#1867C0',
    manifestOptions: {
      background_color: '#1867C0',
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    description: 'Vuetify UI Library Documentation',
    icons: [
      {
        src: 'img/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'img/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: './src/service-worker.js',
      additionalManifestEntries: [
        { url: '/_crowdin.html', revision: Date.now().toString(16) },
        { url: '/_fallback.html', revision: Date.now().toString(16) },
      ],
      exclude: [/\.map$/],
      dontCacheBustURLsMatching: /^\/(js|css).+[A-Za-z0-9]{8}\.(js|css)$/,
      maximumFileSizeToCacheInBytes: 5 * 1024 ** 2,
      // ...other Workbox options...
    },
  },
  // Webpack 4 не понимает optional chaining в «голых» .mjs из node_modules — прогоняем через Babel
  transpileDependencies: [
    '@dimailn/vuetify',
    'markdown-it-prism',
    '@unhead/vue',
    'unhead',
    'vuetify-loader',
    'vue-router',
    'birpc',
    'vee-validate',
    '@vue/devtools-kit',
  ],
  lintOnSave: false,
}
