import { createApp, defineComponent } from 'vue'

import { install } from 'vuetify/es5/install'
import VBtn from 'vuetify/es5/components/VBtn'
import * as VCard from 'vuetify/es5/components/VCard'
import { Ripple } from 'vuetify/es5/directives'
import * as directives from 'vuetify/es5/directives'

const app = createApp({})

install(app, {
  components: {
    VBtn,
    ...VCard
  },
  directives: {
    ...directives
  }
})

defineComponent({
  components: {
    VBtn,
    ...VCard
  },
  directives: {
    Ripple
  }
})

defineComponent({
  extends: VBtn as any,
})
