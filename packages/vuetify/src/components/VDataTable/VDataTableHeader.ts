// Styles
import './VDataTableHeader.sass'

// Components
import VDataTableHeaderMobile from './VDataTableHeaderMobile'
import VDataTableHeaderDesktop from './VDataTableHeaderDesktop'

// Mixins
import header from './mixins/header'

// Utilities
import dedupeModelListeners from '../../util/dedupeModelListeners'
import mergeData from '../../util/mergeData'
import rebuildSlots from '../../util/rebuildFunctionalSlots'

// Types
import {defineComponent, h} from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-data-table-header',

  props: {
    ...header.props,
    mobile: Boolean,
  },

  render () {
    const props = this.$props
    let data = {
      ...this.$attrs,
      ...props,
    }

    // dedupeModelListeners(data)
    if (props.mobile) {
      return h(VDataTableHeaderMobile, data, this.$slots)
    } else {
      return h(VDataTableHeaderDesktop, data, this.$slots)
    }
  },
})
