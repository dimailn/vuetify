import * as components from './components'
import * as directives from './directives'
import Vuetify from './framework'

const install = Vuetify.install

Vuetify.install = (Vue, args) => {
  install.call(Vuetify, Vue, {
    components,
    directives,
    ...args,
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuetify)
}

export { Vuetify }
