import {h, mergeProps} from 'vue'
import './VResponsive.sass'

// Mixins
import Measurable, { NumberOrNumberString } from '../../mixins/measurable'

// Types
import { VNode } from 'vue'

// Utils
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'

/* @vue/component */
export default mixins(Measurable).extend({
  name: 'v-responsive',

  props: {
    aspectRatio: [String, Number] as NumberOrNumberString,
    contentClass: String,
  },

  computed: {
    computedAspectRatio (): number {
      return Number(this.aspectRatio)
    },
    aspectStyle (): object | undefined {
      return this.computedAspectRatio
        ? { paddingBottom: (1 / this.computedAspectRatio) * 100 + '%' }
        : undefined
    },
    __cachedSizer (): VNode | [] {
      if (!this.aspectStyle) return []

      return this.$createElement('div', {
        style: this.aspectStyle,
        class: 'v-responsive__sizer',
      })
    },
  },

  methods: {
    genContent (): VNode {
      return this.$createElement('div', {
        class: `v-responsive__content ${this.contentClass}`,
      }, getSlot(this))
    },
  },

  render (): VNode {
    return h('div', mergeProps({
      class: 'v-responsive',
      style: this.measurableStyles,
    }, this.$attrs)
    , [
      this.__cachedSizer,
      this.genContent(),
    ])
  },
})
