import './_grid.sass'
import './VGrid.sass'

import mergeData from '../../util/mergeData'
import { defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-container',
  props: {
    id: String,
    tag: {
      type: String,
      default: 'div',
    },
    fluid: {
      type: Boolean,
      default: false,
    },
  },
  render () {
    let classes

    const attrs = this.$attrs

    if (attrs) {
      // reset attrs to extract utility clases like pa-3
      classes = Object.keys(attrs).filter(key => {
        // TODO: Remove once resolved
        // https://github.com/vuejs/vue/issues/7841
        if (key === 'slot') return false

        const value = attrs[key]

        // add back data attributes like data-test="foo" but do not
        // add them as classes
        if (key.startsWith('data-')) {
          return false
        }

        return value || typeof value === 'string'
      })
    }

    return h(
      this.tag,
      mergeData(this.$attrs, {
        class: Array<any>({
          'container--fluid': this.fluid,
        }).concat(classes || []).concat('container'),
      }),
      this.$slots.default?.()
    )
  },
})
