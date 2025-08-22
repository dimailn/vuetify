import {h} from 'vue'
import './VSimpleTable.sass'

import { convertToUnit, getSlot } from '../../util/helpers'
import Themeable from '../../mixins/themeable'
import mixins from '../../util/mixins'
import { VNode } from 'vue'

export default mixins(Themeable).extend({
  name: 'v-simple-table',

  props: {
    dense: Boolean,
    fixedHeader: Boolean,
    height: [Number, String],
  },

  computed: {
    classes (): Record<string, boolean> {
      return {
        'v-data-table--dense': this.dense,
        'v-data-table--fixed-height': !!this.height && !this.fixedHeader,
        'v-data-table--fixed-header': this.fixedHeader,
        'v-data-table--has-top': !!this.$slots.top,
        'v-data-table--has-bottom': !!this.$slots.bottom,
        ...this.themeClasses,
      }
    },
  },

  methods: {
    genWrapper () {
      const wrapperSlot = this.$slots.wrapper
      return wrapperSlot ? wrapperSlot() : h('div', {
        class: 'v-data-table__wrapper',
        style: {
          height: convertToUnit(this.height),
        },
      }, [
        h('table', this.$slots.default ? this.$slots.default() : undefined),
      ])
    },
  },

  render (): VNode {
    const children = []
    if (this.$slots.top) {
      children.push(this.$slots.top())
    }
    children.push(this.genWrapper())
    if (this.$slots.bottom) {
      children.push(this.$slots.bottom())
    }

    return h('div', {
      class: ['v-data-table', this.classes],
    }, children.filter(Boolean))
  },
})
