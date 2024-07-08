// Styles
import './VMessages.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Types
import { VNode, h } from 'vue'
import { PropValidator } from 'vue/types/options'
import mixins from '../../util/mixins'

// Utilities
import { getSlot } from '../../util/helpers'

/* @vue/component */
export default mixins(Colorable, Themeable).extend({
  name: 'v-messages',

  props: {
    value: {
      type: Array,
      default: () => ([]),
    } as PropValidator<string[]>,
  },

  methods: {
    genChildren () {
      return this.$createElement('transition-group', {
        class: 'v-messages__wrapper',
        attrs: {
          name: 'message-transition',
          tag: 'div',
        },
      }, this.value.map(this.genMessage))
    },
    genMessage (message: string, key: number) {
      return this.$createElement('div', {
        class: 'v-messages__message',
        key,
      }, getSlot(this, 'default', { message, key }) || [message])
    },
  },

  render (): VNode {
    return h('div', this.setTextColor(this.color, {
      class: 'v-messages',
      class: this.themeClasses,
    }), [this.genChildren()])
  },
})
