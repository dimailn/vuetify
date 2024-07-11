import {h} from 'vue'
// Styles
import './VSheet.sass'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Colorable from '../../mixins/colorable'
import Elevatable from '../../mixins/elevatable'
import Measurable from '../../mixins/measurable'
import Roundable from '../../mixins/roundable'
import Themeable from '../../mixins/themeable'

// Helpers
import mixins from '../../util/mixins'

// Types
import { VNode, defineComponent } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-sheet',
  mixins: [
    BindsAttrs,
    Colorable,
    Elevatable,
    Measurable,
    Roundable,
    Themeable
  ],

  props: {
    outlined: Boolean,
    shaped: Boolean,
    tag: {
      type: String,
      default: 'div',
    },
  },

  computed: {
    classes (): object {
      return {
        'v-sheet': true,
        'v-sheet--outlined': this.outlined,
        'v-sheet--shaped': this.shaped,
        ...this.themeClasses,
        ...this.elevationClasses,
        ...this.roundedClasses,
      }
    },
    styles (): object {
      return this.measurableStyles
    },
  },

  render (): VNode {
    const data = {
      class: this.classes,
      style: this.styles,
      on: this.listeners$,
    }

    return h(
      this.tag,
      this.setBackgroundColor(this.color, data),
      this.$slots.default()
    )
  },
})
