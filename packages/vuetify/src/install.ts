import { createApp, reactive } from 'vue'
import { VuetifyUseOptions } from 'vuetify/types'
import { consoleError } from './util/console'
import { legacyEventsMixin } from './util/legacyEventsMixin'

export function install (Vue: ReturnType<typeof createApp>, args: VuetifyUseOptions = {}) {
  // if ((install as any).installed) return
  // (install as any).installed = true

  //   if (OurVue !== Vue) {
  //     consoleError(`Multiple instances of Vue detected
  // See https://github.com/vuetifyjs/vuetify/issues/4068

  // If you're seeing "$attrs is readonly", it's caused by this`)
  //   }

  const components = args.components || {}
  const directives = args.directives || {}

  for (const name in directives) {
    const directive = directives[name]

    Vue.directive(name, directive)
  }

  (function registerComponents (components: any) {
    if (components) {
      for (const key in components) {
        const component = components[key]
        if (component && !registerComponents(component.$_vuetify_subcomponents)) {
          Vue.component(key, component as typeof Vue)
        }
      }
      return true
    }
    return false
  })(components)

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$_vuetify_installed) return
  Vue.$_vuetify_installed = true

  Vue.mixin({
    computed: {
      ...legacyEventsMixin.computed,
    },
    beforeCreate () {
      const options = this.$options as any

      if (options.vuetify) {
        options.vuetify.init(this, this.$ssrContext)
        Vue.config.globalProperties.$vuetify = reactive(options.vuetify.framework)
      }
    },
    beforeMount () {
      // @ts-ignore
      if (this.$options.vuetify && this.$el && this.$el.hasAttribute('data-server-rendered')) {
        // @ts-ignore
        this.$vuetify.isHydrating = true
        // @ts-ignore
        this.$vuetify.breakpoint.update(true)
      }
    },
    mounted () {
      // @ts-ignore
      if (this.$options.vuetify && this.$vuetify.isHydrating) {
        // @ts-ignore
        this.$vuetify.isHydrating = false
        // @ts-ignore
        this.$vuetify.breakpoint.update()
      }
    },
    methods: {
      ...legacyEventsMixin.methods,
    },
  })
}
