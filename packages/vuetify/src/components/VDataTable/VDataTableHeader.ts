// Styles
import './VDataTableHeader.sass'

// Components
import VDataTableHeaderMobile from './VDataTableHeaderMobile'
import VDataTableHeaderDesktop from './VDataTableHeaderDesktop'

// Mixins
import header from './mixins/header'

// Utilities
import { pickSlotFunctions } from '../../util/helpers'

// Types
import { defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-data-table-header',

  props: {
    ...header.props,
    mobile: Boolean
  },

  render () {
    const props = this.$props
    const data = {
      ...this.$attrs,
      ...props
    }

    // dedupeModelListeners(data)
    const slotFns = pickSlotFunctions(this.$slots as Record<string, any>)

    if (props.mobile) {
      return h(VDataTableHeaderMobile, data, slotFns)
    } else {
      return h(VDataTableHeaderDesktop, data, slotFns)
    }
  }
})
