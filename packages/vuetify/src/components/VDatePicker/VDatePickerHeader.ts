import './VDatePickerHeader.sass'

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Mixins
import Colorable from '../../mixins/colorable'
import Localable from '../../mixins/localable'
import Themeable from '../../mixins/themeable'

// Utils
import { createNativeLocaleFormatter, monthChange } from './util'
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'

// Types
import { VNode, PropType, Transition, h } from 'vue'
import { DatePickerFormatter } from 'vuetify/types'

export default mixins(
  Colorable,
  Localable,
  Themeable
/* @vue/component */
).extend({
  name: 'v-date-picker-header',

  props: {
    disabled: Boolean,
    format: Function as PropType<DatePickerFormatter | undefined>,
    min: String,
    max: String,
    nextAriaLabel: String,
    nextIcon: {
      type: String,
      default: '$next',
    },
    prevAriaLabel: String,
    prevIcon: {
      type: String,
      default: '$prev',
    },
    readonly: Boolean,
    value: {
      type: [Number, String],
      required: true,
    },
  },

  data () {
    return {
      isReversing: false,
    }
  },

  computed: {
    formatter (): DatePickerFormatter {
      if (this.format) {
        return this.format
      } else if (String(this.value).split('-')[1]) {
        return createNativeLocaleFormatter(this.currentLocale, { month: 'long', year: 'numeric', timeZone: 'UTC' }, { length: 7 })
      } else {
        return createNativeLocaleFormatter(this.currentLocale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 })
      }
    },
  },

  watch: {
    value (newVal, oldVal) {
      this.isReversing = newVal < oldVal
    },
  },

  methods: {
    genBtn (change: number) {
      const ariaLabelId = change > 0 ? this.nextAriaLabel : this.prevAriaLabel
      const ariaLabel = ariaLabelId ? this.$vuetify.lang.t(ariaLabelId) : undefined
      const disabled = this.disabled ||
        (change < 0 && this.min && this.calculateChange(change) < this.min) ||
        (change > 0 && this.max && this.calculateChange(change) > this.max)

      return h(VBtn, {
        'aria-label': ariaLabel,
        dark: this.dark,
        disabled,
        icon: true,
        light: this.light,
        onClick: (e: Event) => {
          e.stopPropagation()
          this.$emit('input', this.calculateChange(change))
        }
      }, [
        h(VIcon, ((change < 0) === !this.$vuetify.rtl) ? this.prevIcon : this.nextIcon),
      ])
    },
    calculateChange (sign: number) {
      const [year, month] = String(this.value).split('-').map(Number)

      if (month == null) {
        return `${year + sign}`
      } else {
        return monthChange(String(this.value), sign)
      }
    },
    genHeader () {
      const color = !this.disabled && (this.color || 'accent')
      const header = h('div', this.setTextColor(color, {
        key: String(this.value),
      }), [h('button', {
        type: 'button',
        onClick: () => this.$emit('toggle'),
      }, getSlot(this) || [this.formatter(String(this.value))])])

      const transition = h(Transition, {
        name: (this.isReversing === !this.$vuetify.rtl) ? 'tab-reverse-transition' : 'tab-transition',
      }, [header])

      return h('div', {
        class: ['v-date-picker-header__value', {
          'v-date-picker-header__value--disabled': this.disabled,
        }]
      }, [transition])
    },
  },

  render (): VNode {
    return h('div', {
      class: ['v-date-picker-header', {
        'v-date-picker-header--disabled': this.disabled,
        ...this.themeClasses,
      }]
    }, [
      this.genBtn(-1),
      this.genHeader(),
      this.genBtn(+1),
    ])
  },
})
