import {h, Transition} from 'vue'
import './VPicker.sass'
import '../VCard/VCard.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Elevatable from '../../mixins/elevatable'
import Themeable from '../../mixins/themeable'

// Helpers
import { convertToUnit, getSlot } from '../../util/helpers'

// Types
import { VNode } from 'vue/types'
import mixins from '../../util/mixins'

/* @vue/component */
export default mixins(
  Colorable,
  Elevatable,
  Themeable
).extend({
  name: 'v-picker',

  props: {
    flat: Boolean,
    fullWidth: Boolean,
    landscape: Boolean,
    noTitle: Boolean,
    transition: {
      type: String,
      default: 'fade-transition',
    },
    width: {
      type: [Number, String],
      default: 290,
    },
  },

  computed: {
    computedTitleColor (): string | false {
      const defaultTitleColor = this.isDark ? false : (this.color || 'primary')
      return this.color || defaultTitleColor
    },
  },

  methods: {
    genTitle () {
      return this.$createElement('div', this.setBackgroundColor(this.computedTitleColor, {
        class: ['v-picker__title', {
          'v-picker__title--landscape': this.landscape,
        }],
      }), getSlot(this, 'title'))
    },
    genBodyTransition () {
      return this.$createElement(Transition, {
        name: this.transition,
      }, getSlot(this))
    },
    genBody () {
      return this.$createElement('div', {
        class: ['v-picker__body', {
          'v-picker__body--no-title': this.noTitle,
          ...this.themeClasses,
        }],
        style: this.fullWidth ? undefined : {
          width: convertToUnit(this.width),
        },
      }, [
        this.genBodyTransition(),
      ])
    },
    genActions () {
      return this.$createElement('div', {
        class: ['v-picker__actions v-card__actions', {
          'v-picker__actions--no-title': this.noTitle,
        }],
      }, getSlot(this, 'actions'))
    },
  },

  render (): VNode {
    return h('div', {
      class: ['v-picker v-card', {
        'v-picker--flat': this.flat,
        'v-picker--landscape': this.landscape,
        'v-picker--full-width': this.fullWidth,
        ...this.themeClasses,
        ...this.elevationClasses,
      }],
    }, [
      this.$slots.title ? this.genTitle() : null,
      this.genBody(),
      this.$slots.actions ? this.genActions() : null,
    ])
  },
})
