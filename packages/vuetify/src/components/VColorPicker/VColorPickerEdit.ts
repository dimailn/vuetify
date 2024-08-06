import {h} from 'vue'
// Styles
import './VColorPickerEdit.sass'

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Helpers
import { parseHex } from '../../util/colorUtils'

// Types
import { defineComponent, VNode, PropType } from 'vue'
import { VColorPickerColor, fromRGBA, fromHexa, fromHSLA } from './util'

type Input = [string, number, string]

export type Mode = {
  inputs?: Input[]
  from: Function
}

export const modes = {
  rgba: {
    inputs: [
      ['r', 255, 'int'],
      ['g', 255, 'int'],
      ['b', 255, 'int'],
      ['a', 1, 'float'],
    ],
    from: fromRGBA,
  },
  hsla: {
    inputs: [
      ['h', 360, 'int'],
      ['s', 1, 'float'],
      ['l', 1, 'float'],
      ['a', 1, 'float'],
    ],
    from: fromHSLA,
  },
  hexa: {
    from: fromHexa,
  },
} as { [key: string]: Mode }

export default defineComponent({
  name: 'v-color-picker-edit',

  props: {
    color: Object as PropType<VColorPickerColor>,
    disabled: Boolean,
    hideAlpha: Boolean,
    hideModeSwitch: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: (v: string) => Object.keys(modes).includes(v),
    },
  },

  data () {
    return {
      modes,
      internalMode: this.mode,
    }
  },

  computed: {
    currentMode (): Mode {
      return this.modes[this.internalMode]
    },
  },

  watch: {
    mode (mode) {
      this.internalMode = mode
    },
  },

  created () {
    this.internalMode = this.mode
  },

  methods: {
    getValue (v: any, type: string) {
      if (type === 'float') return Math.round(v * 100) / 100
      else if (type === 'int') return Math.round(v)
      else return 0
    },
    parseValue (v: string, type: string) {
      if (type === 'float') return parseFloat(v)
      else if (type === 'int') return parseInt(v, 10) || 0
      else return 0
    },
    changeMode () {
      const modes = Object.keys(this.modes)
      const index = modes.indexOf(this.internalMode)
      const newMode = modes[(index + 1) % modes.length]
      this.internalMode = newMode
      this.$emit('update:mode', newMode)
    },
    genInput (target: string, attrs: any, value: any, on: any): VNode {
      return h('div', {
        class: 'v-color-picker__input',
      }, [
        h('input', {
          key: target,
          attrs,
          domProps: {
            value,
          },
          on,
        }),
        h('span', target.toUpperCase()),
      ])
    },
    genInputs (): VNode[] | VNode {
      if (this.internalMode === 'hexa') {
        const hex = this.color.hexa
        const value = this.hideAlpha && hex.endsWith('FF') ? hex.substr(0, 7) : hex
        return this.genInput(
          'hex',
          {
            maxlength: this.hideAlpha ? 7 : 9,
            disabled: this.disabled,
          },
          value,
          {
            change: (e: Event) => {
              const el = e.target as HTMLInputElement
              this.$emit('update:color', this.currentMode.from(parseHex(el.value)))
            },
          }
        )
      } else {
        const inputs = this.hideAlpha ? this.currentMode.inputs!.slice(0, -1) : this.currentMode.inputs!
        return inputs.map(([target, max, type]) => {
          const value = this.color[this.internalMode as keyof VColorPickerColor] as any
          return this.genInput(
            target,
            {
              type: 'number',
              min: 0,
              max,
              step: type === 'float' ? '0.01' : type === 'int' ? '1' : undefined,
              disabled: this.disabled,
            },
            this.getValue(value[target], type),
            {
              input: (e: Event) => {
                const el = e.target as HTMLInputElement
                const newVal = this.parseValue(el.value || '0', type)

                this.$emit('update:color', this.currentMode.from(
                  Object.assign({}, value, { [target]: newVal }),
                  this.color.alpha
                ))
              },
            }
          )
        })
      }
    },
    genSwitch (): VNode {
      return h(VBtn, {
        props: {
          small: true,
          icon: true,
          disabled: this.disabled,
        },
        on: {
          click: this.changeMode,
        },
      }, [
        h(VIcon, '$unfold'),
      ])
    },
  },

  render (): VNode {
    return h('div', {
      class: 'v-color-picker__edit',
    }, [
      this.genInputs(),
      !this.hideModeSwitch && this.genSwitch(),
    ])
  },
})
