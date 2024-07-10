// Styles
import './VCounter.sass'

// Mixins
import Themeable, { functionalThemeClasses } from '../../mixins/themeable'

// Types
import { VNode, h } from 'vue'
import mixins from '../../util/mixins'

/* @vue/component */
export default mixins(Themeable).extend({
  name: 'v-counter',

  functional: true,

  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    max: [Number, String],
  },

  render (): VNode {
    const props  = this.$props
    const max = parseInt(props.max, 10)
    const value = parseInt(props.value, 10)
    const content = max ? `${value} / ${max}` : String(props.value)
    const isGreater = max && (value > max)

    return h('div', {
      class: {
        'v-counter': true,
        'error--text': isGreater,
        ...functionalThemeClasses(this),
      },
    }, content)
  },
})
