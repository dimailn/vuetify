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
          props: {
            ...this.$attrs,
            height: this.windowGroup.internalHeight,
          },
          on: this.$listeners,
          scopedSlots: {
            placeholder: this.$slots.placeholder,
          },
        }, getSlot(this)),
      ]
    },
    genWindowItem () {
      const { tag, data, directives } = this.generateRouteLink()

      data.staticClass = 'v-window-item'
      data.directives!.push([
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
