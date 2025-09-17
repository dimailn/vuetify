// Mixins
import Delayable from '../../mixins/delayable'
import Toggleable from '../../mixins/toggleable'

// Utilities
import mixins from '../../util/mixins'
import { consoleWarn } from '../../util/console'

// Types
import { VNode, ScopedSlotChildren } from 'vue/types/vnode'

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

    let element: VNode | ScopedSlotChildren

    /* istanbul ignore else */
    if (this.$slots.default) {
      element = this.$slots.default({ hover: this.isActive })
    }

    if (Array.isArray(element)) {
      if (element.length === 1) {
        element = element[0]
      } else {
        consoleWarn('v-hover should only contain a single element', this)
        return element as any
      }
    }

    if (!element || (!element.tag && !element.type)) {
      consoleWarn('v-hover should only contain a single element', this)

      return element as any
    }

    if (!this.disabled) {
      element.data = element.data || {}
      element.data.on = {
        ...element.data.on,
        onMouseenter: this.onMouseEnter,
        onMouseleave: this.onMouseLeave,
      }
    }

    return element
  },
})
