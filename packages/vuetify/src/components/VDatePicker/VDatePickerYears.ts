import './VDatePickerYears.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Localable from '../../mixins/localable'

// Utils
import {
  createNativeLocaleFormatter,
} from './util'
import mixins, { ExtractVue } from '../../util/mixins'
import { breaking } from '../../util/console'

// Types
import { VNode, PropType, h } from 'vue'
import { DatePickerFormatter } from 'vuetify/types'

interface options {
  $el: HTMLElement
}

export default mixins(
  Colorable,
  Localable
/* @vue/component */
).extend({
  name: 'v-date-picker-years',

  props: {
    format: Function as PropType<DatePickerFormatter | undefined>,
    min: [Number, String],
    max: [Number, String],
    readonly: Boolean,
    modelValue: [Number, String],
  },

  data () {
    return {
      defaultColor: 'primary',
    }
  },

  computed: {
    formatter (): DatePickerFormatter {
      return this.format || createNativeLocaleFormatter(this.currentLocale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 })
    },
  },

  created () {
    const breakingProps = [
      ['value', 'modelValue'],
      ['onInput', 'onUpdate:modelValue'],
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })
  },

  mounted () {
    setTimeout(() => {
      const activeItem = this.$el.getElementsByClassName('active')[0]
      if (activeItem) {
        this.$el.scrollTop = activeItem.offsetTop - this.$el.offsetHeight / 2 + activeItem.offsetHeight / 2
      } else if (this.min && !this.max) {
        this.$el.scrollTop = this.$el.scrollHeight
      } else if (!this.min && this.max) {
        this.$el.scrollTop = 0
      } else {
        this.$el.scrollTop = this.$el.scrollHeight / 2 - this.$el.offsetHeight / 2
      }
    })
  },

  methods: {
    genYearItem (year: number): VNode {
      const formatted = this.formatter(`${year}`)
      const active = parseInt(this.modelValue, 10) === year
      const color = active && (this.color || 'primary')

      return h('li', this.setTextColor(color, {
        key: year,
        class: { active },
        onClick: () => this.$emit('update:modelValue', year),
      }), formatted)
    },

    genYearItems (): VNode[] {
      const children = []
      const selectedYear = this.modelValue ? parseInt(this.modelValue, 10) : new Date().getFullYear()
      const maxYear = this.max ? parseInt(this.max, 10) : (selectedYear + 100)
      const minYear = Math.min(maxYear, this.min ? parseInt(this.min, 10) : (selectedYear - 100))

      for (let year = maxYear; year >= minYear; year--) {
        children.push(this.genYearItem(year))
      }

      return children
    },
  },

  render (): VNode {
    return h('ul', {
      class: 'v-date-picker-years',
      ref: 'years',
    }, this.genYearItems())
  },
})
