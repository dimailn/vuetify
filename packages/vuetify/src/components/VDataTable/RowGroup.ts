import { defineComponent, VNode, h } from 'vue'

export default defineComponent({
  name: 'row-group',

  props: {
    value: {
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
    const computedSlots = this.$slots
    const children = []

    if (computedSlots['column.header']) {
      children.push(h('tr', {
        class: props.headerClass,
      }, computedSlots['column.header']()))
    } else if (computedSlots['row.header']) {
      const headerResult = computedSlots['row.header']()
      if (Array.isArray(headerResult)) {
        children.push(...headerResult)
      } else {
        children.push(headerResult)
      }
    }

    if (computedSlots['row.content'] && props.value) {
      const contentResult = computedSlots['row.content']()
      if (Array.isArray(contentResult)) {
        children.push(...contentResult)
      } else {
        children.push(contentResult)
      }
    }

    if (computedSlots['column.summary']) {
      children.push(h('tr', {
        class: props.summaryClass,
      }, computedSlots['column.summary']()))
    } else if (computedSlots['row.summary']) {
      const summaryResult = computedSlots['row.summary']()
      if (Array.isArray(summaryResult)) {
        children.push(...summaryResult)
      } else {
        children.push(summaryResult)
      }
    }

    return children.filter(Boolean)
  },
})
