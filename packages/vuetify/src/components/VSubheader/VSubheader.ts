import { h } from 'vue'
// Styles
import './VSubheader.sass'

// Mixins
import Themeable from '../../mixins/themeable'
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'
import { mergeListeners } from '../../util/mergeData'

// Types
import { VNode } from 'vue'

export default mixins(
  Themeable
  /* @vue/component */
).extend({
  name: 'v-subheader',

  props: {
    inset: Boolean
  },

  render (): VNode {
    return h('div', {
      ...this.$attrs,
      class: ['v-subheader', {
        'v-subheader--inset': this.inset,
        ...this.themeClasses
      }],
      ...mergeListeners(this.$listeners)
    }, getSlot(this))
  }
})
