import './VIcon.sass'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Colorable from '../../mixins/colorable'
import Sizeable from '../../mixins/sizeable'
import Themeable from '../../mixins/themeable'

// Util
import { convertToUnit, keys, remapInternalIcon } from '../../util/helpers'

// Types
import { defineComponent, VNode, h } from 'vue'
import type { CreateElement, VNodeChildren, VNodeData } from '../../types/vue-internal'
import mixins from '../../util/mixins'
import { VuetifyIcon, VuetifyIconComponent } from 'vuetify/types/services/icons'
import { normalizeAttrs, normalizeClasses, getTagValue } from '../../util/helpers'

enum SIZE_MAP {
  xSmall = '12px',
  small = '16px',
  default = '24px',
  medium = '28px',
  large = '36px',
  xLarge = '40px'
}

function isFontAwesome5 (iconType: string): boolean {
  return ['fas', 'far', 'fal', 'fab', 'fad', 'fak'].some(val => iconType.includes(val))
}

function isSvgPath (icon: string): boolean {
  return (/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4)
}

function readFirstText (node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node.trim()
  if (typeof node.children === 'string') return node.children.trim()
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const text = readFirstText(child)
      if (text) return text
    }
  }
  return ''
}


export default mixins(
  BindsAttrs,
  Colorable,
  Sizeable,
  Themeable
  /* @vue/component */
).extend({
  name: 'v-icon',

  props: {
    dense: Boolean,
    disabled: Boolean,
    left: Boolean,
    right: Boolean,
    size: [Number, String],
    tag: {
      type: String,
      required: false,
      default: 'i'
    },
    textContent: String,
    innerHTML: String
  },

  computed: {
    medium () {
      return false
    },
    hasClickListener (): boolean {
      return Boolean(
        this.listeners$.onClick
      )
    }
  },

  methods: {
    getIcon (): VuetifyIcon {
      let iconName = ''
      if (this.textContent) iconName = this.textContent.trim()
      else if (this.innerHTML) iconName = this.innerHTML.trim()
      else {
        const slotChildren = this.$slots.default?.() || []
        for (const child of slotChildren) {
          iconName = readFirstText(child)
          if (iconName) break
        }
      }

      return remapInternalIcon(this, iconName)
    },
    getSize (): string | undefined {
      const sizes = {
        xSmall: this.xSmall,
        small: this.small,
        medium: this.medium,
        large: this.large,
        xLarge: this.xLarge
      }

      const explicitSize = keys(sizes).find(key => sizes[key])

      return (
        (explicitSize && SIZE_MAP[explicitSize]) || convertToUnit(this.size)
      )
    },
    // Component data for both font icon and SVG wrapper span
    getDefaultData (): VNodeData {
      const data = {
        class: {
          'v-icon--disabled': this.disabled,
          'v-icon--left': this.left,
          'v-icon--link': this.hasClickListener,
          'v-icon--right': this.right,
          'v-icon--dense': this.dense,
          'v-icon': true,
          notranslate: true
        },
        'aria-hidden': !this.hasClickListener,
        type: this.hasClickListener ? 'button' : undefined,
        // ...this.attrs$,
        ...this.listeners$
      }

      if (this.hasClickListener && this.disabled) {
        data.disabled = true
      }
      return data
    },
    applyColors (data: any): void {
      data.class = normalizeClasses([data.class, this.themeClasses])
      this.setTextColor(this.color, data)
    },
    getSvgWrapperData () {
      const fontSize = this.getSize()
      const wrapperData: any = {
        ...this.getDefaultData(),
        style: fontSize ? {
          fontSize,
          height: fontSize,
          width: fontSize
        } : undefined
      }

      this.applyColors(wrapperData)

      return wrapperData
    },
    renderFontIcon (icon: string): VNode {
      const newChildren: VNodeChildren = []
      const data = this.getDefaultData()

      let iconType = 'material-icons'
      // Material Icon delimiter is _
      // https://material.io/icons/
      const delimiterIndex = icon.indexOf('-')
      const isMaterialIcon = delimiterIndex <= -1

      if (isMaterialIcon) {
        // Material icon uses ligatures.
        newChildren.push(icon)
      } else {
        iconType = icon.slice(0, delimiterIndex)
        if (isFontAwesome5(iconType)) iconType = ''
      }

      data.class[iconType] = true
      data.class[icon] = !isMaterialIcon

      const fontSize = this.getSize()
      if (fontSize) data.style = { fontSize }

      this.applyColors(data)

      const el = this.hasClickListener ? 'button' : getTagValue(this.tag)
      return typeof el === 'string'
        ? h(el, data, newChildren)
        : h(el, data, { default: () => newChildren })
    },
    renderSvgIcon (icon: string): VNode {
      const size = this.getSize()
      const svgProps: any = {
        class: 'v-icon__svg',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        role: 'img',
        'aria-hidden': true
      }

      if (size) {
        svgProps.style = {
          fontSize: size,
          height: size,
          width: size
        }
      }

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
        h('svg', svgProps, [
          h('path', {
            d: icon
          })
        ])
      ])
    },
    renderSvgIconComponent (
      icon: VuetifyIconComponent
    ): VNode {
      const data: any = {
        class: {
          'v-icon__component': true
        }
      }

      const size = this.getSize()
      if (size) {
        data.style = {
          fontSize: size,
          height: size,
          width: size
        }
      }

      this.applyColors(data)

      const component = icon.component
      Object.assign(data, icon.props)

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), {
        default: () => [
          h(component, data)
        ]
      })
    }
  },

  render (): VNode {
    const icon = this.getIcon()

    if (typeof icon === 'string') {
      if (isSvgPath(icon)) {
        return this.renderSvgIcon(icon)
      }
      return this.renderFontIcon(icon)
    }

    return this.renderSvgIconComponent(icon)
  }
})

