import {h} from 'vue'
// Styles
import './VSubheader.sass'

// Mixins
import Themeable from '../../mixins/themeable'
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'

// Types
import { VNode } from 'vue'

export default mixins(
  Themeable
  /* @vue/component */
).extend({
  name: 'v-subheader',

  props: {
    inset: Boolean,
  },

  render (): VNode {
    return h('div', {
      class: 'v-subheader',
      class: {
        'v-subheader--inset': this.inset,
        ...this.themeClasses,
      },
      attrs: this.$attrs,
      on: this.$listeners,
    }, getSlot(this))
  },
})
