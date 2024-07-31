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

  functional: true,

  props: {
    ...header.props,
    mobile: Boolean,
  },

  render () {
    const props = this.$props
    let data = this.$attrs

    // dedupeModelListeners(data)
    const children = rebuildSlots(this.$slots, h)

    data = mergeData(data, props)

    if (this.mobile) {
      return h(VDataTableHeaderMobile, data, children)
    } else {
      return h(VDataTableHeaderDesktop, data, children)
    }
  },
})
