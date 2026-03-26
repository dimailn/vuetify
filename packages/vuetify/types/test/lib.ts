import { createApp, defineComponent, h } from 'vue'

import Vuetify, {
  VBtn,
  VCard,
  VCardText,
} from 'vuetify/lib'

import * as directives from 'vuetify/lib/directives'

const vuetify = new Vuetify()

const app = createApp({
  vuetify,
  render: () => h('div'),
})

app.use(Vuetify)
app.use(Vuetify, {})
app.use(Vuetify, {
  components: {
    VBtn,
    VCard,
    VCardText,
  },
  directives,
})

defineComponent({
  extends: VBtn as any,
})
