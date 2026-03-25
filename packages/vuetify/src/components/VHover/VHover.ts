// Mixins
import Delayable from '../../mixins/delayable'
import Toggleable from '../../mixins/toggleable'

// Utilities
import mixins from '../../util/mixins'
import { consoleWarn } from '../../util/console'

// Types
import { VNode, mergeProps } from 'vue'

export default mixins(
  Delayable,
  Toggleable
  /* @vue/component */
).extend({
  name: 'v-hover',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    onMouseEnter () {
      if (this.disabled) return
      this.runDelay('open')
    },
    onMouseLeave () {
      if (this.disabled) return
      this.runDelay('close')
    },
  },

  render (): VNode {
    if (!this.$slots.default && this.modelValue === undefined) {
      consoleWarn('v-hover is missing a default scopedSlot or bound value', this)
      return null as any
    }

    if (!this.$slots.default) return null as any

    const slotContent = this.$slots.default({ hover: this.isActive })

    if (!slotContent?.length) {
      consoleWarn('v-hover slot returned empty content', this)
      return null as any
    }

    const element = slotContent[0]

    if (!element?.type) {
      consoleWarn('v-hover should only contain valid VNode elements', this)
      return element as any
    }

    if (slotContent.length > 1) {
      consoleWarn('v-hover should only contain a single element', this)
    }

    if (!this.disabled) {
      element.props = mergeProps(element.props || {}, {
        onMouseenter: this.onMouseEnter,
        onMouseleave: this.onMouseLeave,
      })
    }

    return element
  },
})
