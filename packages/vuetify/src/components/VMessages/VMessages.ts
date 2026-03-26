// Styles
import './VMessages.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Types
import { TransitionGroup, VNode, h } from 'vue'
import mixins from '../../util/mixins'

// Utilities
import { getSlot } from '../../util/helpers'
import { breaking } from '../../util/console'

/* @vue/component */
export default mixins(Colorable, Themeable).extend({
  name: 'v-messages',

  props: {
    modelValue: {
      type: Array,
      default: () => ([])
    }
  },

  created () {
    const breakingProps = [
      ['value', 'modelValue']
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })
  },

  methods: {
    genChildren () {
      return h(TransitionGroup, {
        class: 'v-messages__wrapper',
        name: 'message-transition',
        tag: 'div'
      }, () => this.modelValue.map(this.genMessage))
    },
    genMessage (message: string, key: number) {
      const fromSlot = getSlot(this, 'default', { message, key })
      const hasSlotContent = fromSlot != null &&
        (!Array.isArray(fromSlot) || fromSlot.length > 0)
      const children = hasSlotContent
        ? (Array.isArray(fromSlot) ? fromSlot : [fromSlot])
        : [message]

      return h('div', {
        class: 'v-messages__message',
        key
      }, children)
    }
  },

  render (): VNode {
    return h('div', this.setTextColor(this.color, {
      class: ['v-messages', this.themeClasses]
    }), [this.genChildren()])
  }
})
