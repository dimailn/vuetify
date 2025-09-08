import { h, defineComponent } from 'vue'

// Styles
import './VColorPickerPreview.sass'

// Components
import VSlider from '../VSlider/VSlider'

// Utilities
import { RGBtoCSS, RGBAtoCSS } from '../../util/colorUtils'

// Types
import type { VNode, PropType } from 'vue'
import type { VColorPickerColor } from './util'
import { fromHSVA } from './util'

export default defineComponent({
  name: 'v-color-picker-preview',

  props: {
    color: {
      type: Object as PropType<VColorPickerColor>,
      required: true,
    },
    disabled: Boolean,
    hideAlpha: Boolean,
  },

  emits: ['update:color'],

  methods: {
    genAlpha (): VNode {
      if (!this.color) return h('div')
      return this.genTrack({
        class: 'v-color-picker__alpha',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.alpha,
        step: 0,
        min: 0,
        max: 1,
        style: {
          backgroundImage: this.disabled
            ? undefined
            : `linear-gradient(to ${this.$vuetify?.rtl ? 'left' : 'right'}, transparent, ${RGBtoCSS(this.color.rgba)})`,
        },
        'onUpdate:modelValue': (val: number) => {
          if (this.color && this.color.alpha !== val) {
            this.$emit('update:color', fromHSVA({ ...this.color.hsva, a: val }))
          }
        },
      })
    },

    genHue (): VNode {
      if (!this.color) return h('div')
      return this.genTrack({
        class: 'v-color-picker__hue',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.hue,
        step: 0,
        min: 0,
        max: 360,
        'onUpdate:modelValue': (val: number) => {
          if (this.color && this.color.hue !== val) {
            this.$emit('update:color', fromHSVA({ ...this.color.hsva, h: val }))
          }
        },
      })
    },

    genTrack (options: Record<string, any>): VNode {
      return h(VSlider, {
        class: 'v-color-picker__track',
        disabled: this.disabled,
        ...options,
      })
    },

    genSliders (): VNode {
      return h('div', {
        class: 'v-color-picker__sliders',
      }, [
        this.genHue(),
        !this.hideAlpha && this.genAlpha(),
      ])
    },

    genDot (): VNode {
      return h('div', {
        class: 'v-color-picker__dot',
      }, [
        h('div', {
          style: {
            background: this.color ? RGBAtoCSS(this.color.rgba) : 'transparent',
          },
        }),
      ])
    },
  },

  render (): VNode {
    return h('div', {
      class: ['v-color-picker__preview', {
        'v-color-picker__preview--hide-alpha': this.hideAlpha,
      }],
    }, [
      this.genDot(),
      this.genSliders(),
    ])
  },
})
