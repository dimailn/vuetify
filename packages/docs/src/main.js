// Packages
import { createApp as _createApp, h } from 'vue'
import Vuetify from 'vuetify/lib'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'
import InstantSearch from 'vue-instantsearch/vue3/es'

// Bootstrap
import { registerPlugins } from './plugins'
import { createVuetify } from '@/vuetify'
import { createStore } from '@/store'
import { createRouter } from '@/router'
import { createI18n } from '@/i18n'
import { sync } from 'vuex-router-sync'
import { preferredLocale } from '@/util/routes'

// Service Worker
import './registerServiceWorker'

// Application
import App from './App.vue'

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export async function createApp ({
  start = () => {},
} = {}, ssrContext) {
  const store = createStore()
  const i18n = createI18n()
  const vuetify = createVuetify(store)
  const router = createRouter(vuetify, store, i18n)

  store.state.app.version = Vuetify.version

  sync(store, router)

  // Корень должен быть именно App.vue (не anonymous extends), иначе ломаются
  // vuetify-loader и опция vuetify для install.ts (нет v-app / $vuetify).
  App.vuetify = vuetify

  const app = _createApp(App)

  app.use(Vuetify, { components, directives })
  app.use(InstantSearch)
  app.config.globalProperties.$createElement = h

  app.use(store)
  app.use(router)
  app.use(i18n)

  app.mixin({
    methods: {
      /** Именованный маршрут с обязательным param locale (Vue Router 4) */
      withLocaleRoute (name, params = {}, extra = {}) {
        const locale = this.$route.params.locale || preferredLocale()
        return {
          name,
          params: { locale, ...params },
          ...extra,
        }
      },
    },
  })

  const head = registerPlugins(app)

  const entry = { app, router, store, head }

  await start(entry)

  return entry
}
