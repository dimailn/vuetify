declare module 'vuetify/es5/install' {
  import type { App } from 'vue'
  import type { VuetifyUseOptions } from 'vuetify'

  const install: (app: App, args?: VuetifyUseOptions) => void

  export { install }
}
declare module 'vuetify/es5/components/Vuetify' {
  import Vuetify from 'vuetify'

  export default Vuetify
}

declare module 'vuetify/es5/components/*' {
  import { ComponentOrPack } from 'vuetify'
  import { Component } from 'vue'

  const VuetifyComponent: {
    default: ComponentOrPack & Component
    [key: string]: ComponentOrPack & Component
  }

  export = VuetifyComponent
}

declare module 'vuetify/es5/directives' {
  import { Directive } from 'vue'

  const ClickOutside: Directive
  const Intersect: Directive
  const Mutate: Directive
  const Resize: Directive
  const Ripple: Directive
  const Scroll: Directive
  const Touch: Directive

  export {
    ClickOutside,
    Intersect,
    Mutate,
    Ripple,
    Resize,
    Scroll,
    Touch
  }
}
