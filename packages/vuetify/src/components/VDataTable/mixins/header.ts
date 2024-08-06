import { VDataTable } from '../'
import VIcon from '../../VIcon'
import VSimpleCheckbox from '../../VCheckbox/VSimpleCheckbox'
import ripple from '../../../directives/ripple'

import {defineComponent, h} from 'vue'
import { PropValidator } from 'vue/types/options'
import mixins from '../../../util/mixins'
import { DataOptions, DataTableHeader } from 'vuetify/types'

type VDataTableInstance = InstanceType<typeof VDataTable>

interface options extends Vue {
  dataTable: VDataTableInstance
}

export default mixins<options>().extend({
  // https://github.com/vuejs/vue/issues/6872
  directives: {
    ripple,
  },

  props: {
    headers: {
      type: Array,
      default: () => ([]),
    } as PropValidator<DataTableHeader[]>,
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
      }),
    } as PropValidator<DataOptions>,
    checkboxColor: String,
    sortIcon: {
      type: String,
      default: '$sort',
    },
    everyItem: Boolean,
    someItems: Boolean,
    showGroupBy: Boolean,
    singleSelect: Boolean,
    disableSort: Boolean,
  },

  methods: {
    genSelectAll () {
      const data = {
        props: {
          value: this.everyItem,
          indeterminate: !this.everyItem && this.someItems,
          color: this.checkboxColor ?? '',
        },
        on: {
          input: (v: boolean) => this.$emit('toggle-select-all', v),
        },
      }

      if (this.$slots['data-table-select']) {
        return this.$slots['data-table-select']!(data)
      }

      return h(VSimpleCheckbox, {
        class: 'v-data-table__checkbox',
        ...data,
      })
    },
    genSortIcon () {
      return h(VIcon, {
        class: 'v-data-table-header__icon',
        size: 18,
      }, [this.sortIcon])
    },
  },
})
