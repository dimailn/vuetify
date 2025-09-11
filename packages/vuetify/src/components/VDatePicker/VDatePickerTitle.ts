import { h, Transition } from 'vue'
import './VDatePickerTitle.sass'

// Components
import VIcon from '../VIcon'

// Mixins
import PickerButton from '../../mixins/picker-button'

// Utils
import mixins from '../../util/mixins'
import { breaking } from '../../util/console'

// Types
import { VNode } from 'vue'

export default mixins(
  PickerButton
/* @vue/component */
).extend({
  name: 'v-date-picker-title',

  props: {
    date: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    readonly: Boolean,
    selectingYear: Boolean,
    modelValue: {
      type: String,
    },
    year: {
      type: [Number, String],
      default: '',
    },
    yearIcon: {
      type: String,
    },
  },

  emits: ['update:selecting-year'],

  data: () => ({
    isReversing: false,
  }),

  computed: {
    computedTransition (): string {
      return this.isReversing ? 'picker-reverse-transition' : 'picker-transition'
    },
  },

  created () {
    const breakingProps = [
      ['value', 'modelValue'],
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })
  },

  watch: {
    modelValue (val: string, prev: string) {
      this.isReversing = val < prev
    },
  },

  methods: {
    genYearIcon (): VNode {
      return h(VIcon, {
        dark: true,
      }, () => this.yearIcon)
    },
    getYearBtn (): VNode {
      return this.genPickerButton('selectingYear', true, [
        String(this.year),
        this.yearIcon ? this.genYearIcon() : null,
      ], false, 'v-date-picker-title__year')
    },
    genTitleText (): VNode {
      return h(Transition, {
        name: this.computedTransition,
      }, () => [
        h('div', {
          innerHTML: this.date || '&nbsp;',
          key: this.modelValue,
        }),
      ])
    },
    genTitleDate (): VNode {
      return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date')
    },
  },

  render (): VNode {
    return h('div', {
      class: ['v-date-picker-title', {
        'v-date-picker-title--disabled': this.disabled,
      }],
    }, [
      this.getYearBtn(),
      this.genTitleDate(),
    ])
  },
})
