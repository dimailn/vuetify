import ExpandTransitionGenerator from '../../transitions/expand-transition'

export default {
  methods: {
    genTBody () {
      const children = this.genItems()

      return this.$createElement('tbody', children)
    },

    genWrappedExpandedRow (props) {
      return this.$createElement('div', {
        class: 'v-datatable__expand-content',
        key: props.item[this.itemKey]
      }, this.$scopedSlots.expand(props))
    },

    genExpandedRow (props) {
      const children = []

      if (this.isExpanded(props.item)) {
        const expand = this.noWrappedExpandSlots ? this.$scopedSlots.expand(props) : this.genWrappedExpandedRow(props)

        children.push(expand)
      }

      if (this.noWrappedExpandSlots) {
        return children
      }

      const transition = this.$createElement('transition-group', {
        class: 'v-datatable__expand-col',
        attrs: { colspan: this.headerColumns },
        props: {
          tag: 'td'
        },
        on: ExpandTransitionGenerator('v-datatable__expand-col--expanded')
      }, children)

      return this.genTR([transition], { class: 'v-datatable__expand-row' })
    },
    genFilteredItems () {
      if (!this.$scopedSlots.items) {
        return null
      }

      const rows = []
      for (let index = 0, len = this.filteredItems.length; index < len; ++index) {
        const item = this.filteredItems[index]
        const props = this.createProps(item, index)
        const row = this.$scopedSlots.items(props)

        rows.push(this.hasTag(row, 'td')
          ? this.genTR(row, {
            key: index,
            attrs: { active: this.isSelected(item) }
          })
          : row)

        if (this.$scopedSlots.expand) {
          const expandRow = this.genExpandedRow(props)
          rows.push(expandRow)
        }
      }

      return rows
    },
    genEmptyItems (content) {
      if (this.hasTag(content, 'tr')) {
        return content
      } else if (this.hasTag(content, 'td')) {
        return this.genTR(content)
      } else {
        return this.genTR([this.$createElement('td', {
          class: {
            'text-xs-center': typeof content === 'string'
          },
          attrs: { colspan: this.headerColumns }
        }, content)])
      }
    }
  }
}
