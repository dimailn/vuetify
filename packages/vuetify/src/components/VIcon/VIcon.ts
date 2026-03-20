import './VIcon.sass'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Colorable from '../../mixins/colorable'
import Sizeable from '../../mixins/sizeable'
import Themeable from '../../mixins/themeable'

// Util
import { convertToUnit, keys, remapInternalIcon } from '../../util/helpers'

// Types
import { defineComponent, CreateElement, VNode, VNodeChildren, VNodeData, h } from 'vue'
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

function classesToString (classObj: Record<string, boolean>): string {
  return Object.keys(classObj).filter(key => classObj[key]).join(' ')
}


export const VIconInternal = mixins(
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
      default: 'i',
    },
  },

  computed: {
    medium () {
      return false
    },
    hasClickListener (): boolean {
      return Boolean(
        this.listeners$.onClick
      )
    },
  },

  methods: {
    getIcon (): VuetifyIcon {
      let iconName = ''
      if (this.$slots.default) {
        const slotChildren = this.$slots.default()
        if (slotChildren && slotChildren[0]) {
          const children = slotChildren[0].children
          if(typeof children === 'string') {
            iconName = children.trim()
          }
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
        xLarge: this.xLarge,
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
          'notranslate': true
        },
        'aria-hidden': !this.hasClickListener,
        type: this.hasClickListener ? 'button' : undefined,
        // ...this.attrs$,
        ...this.listeners$,
      }

      if(this.hasClickListener && this.disabled) {
        data.disabled = true
      }
      return data
    },
    applyColors (data: any): void {
      this.setTextColor(this.color, data)
    },
    getSvgWrapperData () {
      const fontSize = this.getSize()

      const defaultData = this.getDefaultData()
      const normalizedClasses = normalizeClasses([defaultData.class, this.themeClasses])

      const wrapperData: any = {
        class: classesToString(normalizedClasses),
        'aria-hidden': defaultData['aria-hidden'],
        type: defaultData.type,
        style: fontSize ? {
          fontSize,
          height: fontSize,
          width: fontSize,
        } : undefined,
        ...this.listeners$,
      }

      if(this.hasClickListener && this.disabled) {
        wrapperData.disabled = true
      }

      this.applyColors(wrapperData)

      return wrapperData
    },
    renderFontIcon (icon: string): VNode {
      const newChildren: VNodeChildren = []
      const defaultData = this.getDefaultData()

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

      // Создаем объект классов для иконки
      const iconClasses = { [iconType]: true }
      if (!isMaterialIcon) {
        iconClasses[icon] = true
      }

      const allClasses = normalizeClasses([defaultData.class, this.themeClasses, iconClasses])

      const fontSize = this.getSize()
      const fontData: any = {
        class: classesToString(allClasses),
        'aria-hidden': defaultData['aria-hidden'],
        type: defaultData.type,
        style: fontSize ? { fontSize } : undefined,
        ...this.listeners$,
      }

      if(this.hasClickListener && this.disabled) {
        fontData.disabled = true
      }

      this.applyColors(fontData)

      return h(this.hasClickListener ? 'button' : getTagValue(this.tag), fontData, {default: () => newChildren})
    },
    renderSvgIcon (icon: string): VNode {
      const size = this.getSize()
      const svgProps: any = {
        class: 'v-icon__svg',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        role: 'img',
        'aria-hidden': true,
      }

      if (size) {
        svgProps.style = {
          fontSize: size,
          height: size,
          width: size,
        }
      }

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
        h('svg', svgProps, [
          h('path', {
            d: icon,
          }),
        ]),
      ])
    },
    renderSvgIconComponent (
      icon: VuetifyIconComponent
    ): VNode {
      const size = this.getSize()
      const componentClasses = normalizeClasses([
        { 'v-icon__component': true },
        this.themeClasses
      ])

      const componentData: any = {
        class: classesToString(componentClasses),
        style: size ? {
          fontSize: size,
          height: size,
          width: size,
        } : undefined,
        ...icon.props,
      }

      this.applyColors(componentData)

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), {default: () =>[
        h(icon.component, componentData),
      ]})
    },
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
  },
})

export default defineComponent({
  name: 'v-icon',

  $_wrapperFor: VIconInternal,

  functional: true,

  mounted() {
    this.$el.innerHTML = ''
  },

  render (): VNode {
    const data = { ...this.$attrs }


    // console.log(children && children[0]?.children)
    return h(VIconInternal, data, {
      default: () => {
        let iconName = ''

        // Support usage of v-text and v-html
        // if (data.domProps) {
        if(this.$.vnode.props?.textContent) {
          iconName = this.$.vnode.props.textContent  ||
          this.$.vnode.props.innerHTML ||
            iconName
        }

        const children = this.$slots.default?.()

        return iconName ? [iconName] : children && children[0]?.children
      }
    })
  }
})
