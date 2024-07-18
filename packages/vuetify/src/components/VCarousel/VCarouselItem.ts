// Extensions
import VWindowItem from '../VWindow/VWindowItem'

// Components
import { VImg } from '../VImg'

// Utilities
import mixins, { ExtractVue } from '../../util/mixins'
import { getSlot } from '../../util/helpers'
import Routable from '../../mixins/routable'
import { vShow, withDirectives } from 'vue'

// Types
const baseMixins = mixins(
  VWindowItem,
  Routable
)

interface options extends ExtractVue<typeof baseMixins> {
  parentTheme: {
    isDark: boolean
  }
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-carousel-item',

  inject: {
    parentTheme: {
      default: {
        isDark: false,
      },
    },
  },

  // pass down the parent's theme
  provide (): object {
    return {
      theme: this.parentTheme,
    }
  },

  inheritAttrs: false,

  methods: {
    genDefaultSlot () {
      return [
        this.$createElement(VImg, {
          class: 'v-carousel__item',
          ...this.$attrs,
          height: this.windowGroup.internalHeight,
          ...this.$listeners,
        }, { default: getSlot(this), placeholder: this.$slots.placeholder }),
      ]
    },
    genWindowItem () {
      const { tag, data, directives } = this.generateRouteLink()

      data.class['v-window-item'] = true

      directives!.push([
        vShow,
        this.isActive,
      ])

      return withDirectives(
        this.$createElement(tag, data, this.genDefaultSlot()),
        directives
      )
    },
  },
})
