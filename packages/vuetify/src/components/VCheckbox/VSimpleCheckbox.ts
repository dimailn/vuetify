import './VSimpleCheckbox.sass'

import Ripple from '../../directives/ripple'

import { VNode, VNodeDirective, h } from 'vue'
import {defineComponent} from 'vue'

import { VIcon } from '../VIcon'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Utilities
import mergeData from '../../util/mergeData'
import { wrapInArray } from '../../util/helpers'

export default defineComponent({
  name: 'v-simple-checkbox',

  functional: true,

  directives: {
    Ripple,
  },

  props: {
    ...Colorable.props,
    ...Themeable.props,
    disabled: Boolean,
    ripple: {
      type: Boolean,
      default: true,
    },
    value: Boolean,
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$checkboxIndeterminate',
    },
    onIcon: {
      type: String,
      default: '$checkboxOn',
    },
    offIcon: {
      type: String,
      default: '$checkboxOff',
    },
  },

  render (): VNode {
    const props = this.$props
    const data = this.$attrs

    const children = []
    let icon = props.offIcon
    if (props.indeterminate) icon = props.indeterminateIcon
    else if (props.value) icon = props.onIcon

    children.push(h(VIcon, Colorable.methods.setTextColor(props.value && props.color, {
      disabled: props.disabled,
      dark: props.dark,
      light: props.light
    }), icon))

    if (props.ripple && !props.disabled) {
      const ripple = h('div', Colorable.methods.setTextColor(props.color, {
        class: 'v-input--selection-controls__ripple',
        directives: [{
          def: Ripple,
          name: 'ripple',
          value: { center: true },
        }] as VNodeDirective[],
      }))

      children.push(ripple)
    }

    return h('div',
      mergeData(data, {
        class: {
          'v-simple-checkbox': true,
          'v-simple-checkbox--disabled': props.disabled,
        },
        onClick: (e: MouseEvent) => {
          e.stopPropagation()

          if (data.on && data.on.input && !props.disabled) {
            data.onInput && data.onInput(!props.value)
          }
        },
      }), [
        h('div', { class: 'v-input--selection-controls__input' }, children),
      ])
  },
})
