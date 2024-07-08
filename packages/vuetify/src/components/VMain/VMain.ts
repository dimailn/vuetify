// Styles
import './VMain.sass'

// Mixins
import SSRBootable from '../../mixins/ssr-bootable'
import { getSlot } from '../../util/helpers'

// Types
import { VNode, defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-main',

  extends: SSRBootable,

  props: {
    tag: {
      type: String,
      default: 'main',
    },
  },

  computed: {
    styles (): object {
      const {
        bar, top, right, footer, insetFooter, bottom, left,
      } = this.$vuetify.application

      return {
        paddingTop: `${top + bar}px`,
        paddingRight: `${right}px`,
        paddingBottom: `${footer + insetFooter + bottom}px`,
        paddingLeft: `${left}px`,
      }
    },
  },

  render (): VNode {
    const data = {
      class: 'v-main',
      style: this.styles,
      ref: 'main',
    }

    return h(this.tag, data, [
      h(
        'div',
        { class: 'v-main__wrap' },
        getSlot(this),
      ),
    ])
  },
})
