import { defineComponent, VNode, h, Fragment } from 'vue'
import { getSlot } from '../../util/helpers'

export default defineComponent({
  name: 'row-group',

  functional: true,

  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    headerClass: {
      type: String,
      default: 'v-row-group__header',
    },
    contentClass: String,
    summaryClass: {
      type: String,
      default: 'v-row-group__summary',
    },
  },

  render (): VNode {
    const props = this.$props
    const children = []

    const columnHeaderSlot = getSlot(this, 'column.header')
    const rowHeaderSlot = getSlot(this, 'row.header')
    const rowContentSlot = getSlot(this, 'row.content')
    const columnSummarySlot = getSlot(this, 'column.summary')
    const rowSummarySlot = getSlot(this, 'row.summary')

    if (columnHeaderSlot) {
      children.push(h('tr', {
        class: props.headerClass,
      }, columnHeaderSlot))
    } else if (rowHeaderSlot) {
      children.push(...(Array.isArray(rowHeaderSlot) ? rowHeaderSlot : [rowHeaderSlot]))
    }

    if (rowContentSlot && props.modelValue) {
      children.push(...(Array.isArray(rowContentSlot) ? rowContentSlot : [rowContentSlot]))
    }

    if (columnSummarySlot) {
      children.push(h('tr', {
        class: props.summaryClass,
      }, columnSummarySlot))
    } else if (rowSummarySlot) {
      children.push(...(Array.isArray(rowSummarySlot) ? rowSummarySlot : [rowSummarySlot]))
    }

    return h(Fragment, children)
  },
})
