import { h, defineComponent } from 'vue'

// Styles
import './VColorPickerSwatches.sass'

// Components
import VIcon from '../VIcon'

// Helpers
import colors from '../../util/colors'
import { VColorPickerColor, fromHex, parseColor } from './util'
import { convertToUnit, deepEqual } from '../../util/helpers'
import { contrastRatio } from '../../util/colorUtils'

// Mixins
import Themeable from '../../mixins/themeable'

// Types
import type { VNode, PropType } from 'vue'

function parseDefaultColors (colors: Record<string, Record<string, string>>) {
  return Object.keys(colors).map(key => {
    const color = colors[key]
    return color.base ? [
      color.base,
      color.darken4,
      color.darken3,
      color.darken2,
      color.darken1,
      color.lighten1,
      color.lighten2,
      color.lighten3,
      color.lighten4,
      color.lighten5,
    ] : [
      color.black,
      color.white,
      color.transparent,
    ]
  })
}

const white = fromHex('#FFFFFF').rgba
const black = fromHex('#000000').rgba

export default defineComponent({
  name: 'v-color-picker-swatches',

  mixins: [Themeable],

  props: {
    swatches: {
      type: Array as PropType<string[][]>,
      default: () => parseDefaultColors(colors),
    },
    disabled: Boolean,
    color: {
      type: Object as PropType<VColorPickerColor>,
      required: true,
    },
    maxWidth: [Number, String],
    maxHeight: [Number, String],
  },

  emits: ['update:color'],

  methods: {
    genColor (color: string): VNode {
      const content = h('div', {
        style: {
          background: color,
        },
      }, [
        deepEqual(this.color, parseColor(color, null)) && h(VIcon, {
          small: true,
          dark: contrastRatio(this.color.rgba, white) > 2 && this.color.alpha > 0.5,
          light: contrastRatio(this.color.rgba, black) > 2 && this.color.alpha > 0.5
        }, '$success'),
      ])

      return h('div', {
        class: 'v-color-picker__color',
        onClick: () => {
          if (!this.disabled) {
            this.$emit('update:color', fromHex(color === 'transparent' ? '#00000000' : color))
          }
        },
      }, [content])
    },

    genSwatches (): VNode[] {
      return this.swatches.map(swatch => {
        const colors = swatch.map(this.genColor)

        return h('div', {
          class: 'v-color-picker__swatch',
        }, colors)
      })
    },
  },

  render (): VNode {
    return h('div', {
      class: ['v-color-picker__swatches', this.themeClasses],
      style: {
        maxWidth: convertToUnit(this.maxWidth),
        maxHeight: convertToUnit(this.maxHeight),
      },
    }, [
      h('div', this.genSwatches()),
    ])
  },
})
