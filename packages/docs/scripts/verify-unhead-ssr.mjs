/**
 * Быстрая проверка без dev-сервера: SSR mount с useHead(computed(...)),
 * аналогично App.vue — не должно быть «too much recursion».
 */
import { computed, createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createHead } from '@unhead/vue/server'
import { useHead } from '@unhead/vue'

const App = {
  setup () {
    const routeName = computed(() => 'Home')
    useHead(computed(() => ({
      title: 'Vuetify',
      titleTemplate: routeName.value !== 'Home' ? `%s — X` : '%s',
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      meta: [{ name: 'description', content: 'test' }],
    })))
    return () => h('div')
  },
}

const app = createSSRApp(App)
app.use(createHead())
const html = await renderToString(app)
if (typeof html !== 'string' || !html.includes('div')) {
  process.exit(1)
}
console.log('verify-unhead-ssr: ok, length', html.length)
