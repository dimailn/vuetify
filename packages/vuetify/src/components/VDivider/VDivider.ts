import {h} from 'vue'
// Styles
import './VDivider.sass'

// Types
import { VNode, defineComponent } from 'vue'

// Mixins
import Themeable from '../../mixins/themeable'

export default defineComponent({
  name: 'v-divider',
  extends: Themeable,

  props: {
    inset: Boolean,
    vertical: Boolean,
  },

  render (): VNode {
    // WAI-ARIA attributes
    let orientation
    if (!this.$attrs.role || this.$attrs.role === 'separator') {
      orientation = this.vertical ? 'vertical' : 'horizontal'
    }
    return h('hr', {
      class: {
        'v-divider': true,
        'v-divider--inset': this.inset,
        'v-divider--vertical': this.vertical,
        ...this.themeClasses,
      },
      role: 'separator',
      'aria-orientation': orientation,
      ...this.$attrs,
      ...this.$listeners
    })
  },
})
