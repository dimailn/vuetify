// Directives
import Intersect from '../../directives/intersect'

// Utilities
import { consoleWarn } from '../../util/console'

// Types
import {defineComponent, getCurrentInstance} from 'vue'

export default function intersectable (options: { onVisible: string[] }) {
  return defineComponent({
    name: 'intersectable',

    data: () => ({
      isIntersecting: false,
    }),

    mounted () {
      const {vnode} = getCurrentInstance()
      Intersect.inserted(this.$el as HTMLElement, {
        name: 'intersect',
        value: this.onObserve,
      }, vnode)
    },

    destroyed () {
      const {vnode} = getCurrentInstance()

      Intersect.unbind(this.$el as HTMLElement, {
        name: 'intersect',
        value: this.onObserve,
      }, vnode)
    },

    methods: {
      onObserve (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) {
        this.isIntersecting = isIntersecting

        if (!isIntersecting) return

        for (let i = 0, length = options.onVisible.length; i < length; i++) {
          const callback = (this as any)[options.onVisible[i]]

          if (typeof callback === 'function') {
            callback()
            continue
          }

          consoleWarn(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options')
        }
      },
    },
  })
}
