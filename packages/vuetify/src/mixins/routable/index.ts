import type { VNodeData } from '../../types/vue-internal'
import type { PropType } from 'vue'
import { defineComponent, resolveComponent } from 'vue'

// Directives
import Ripple, { RippleOptions } from '../../directives/ripple'

// Utilities
import { mergeListeners } from '../../util/mergeData'

export default defineComponent({
  name: 'routable',

  directives: {
    Ripple
  },

  props: {
    activeClass: String,
    append: Boolean,
    disabled: Boolean,
    exact: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    exactPath: Boolean,
    exactActiveClass: String,
    link: Boolean,
    href: [String, Object],
    to: [String, Object],
    nuxt: Boolean,
    replace: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: null
    },
    tag: String,
    target: String,
    notALink: Boolean
  },

  data: () => ({
    isActive: false,
    proxyClass: ''
  }),

  computed: {
    classes (): object {
      const classes: Record<string, boolean> = {}

      if (this.to) return classes

      const activeClass = this.activeClass || ('$activeClass' in this ? this.$activeClass : undefined)
      // const activeClass = this.activeClass || this.$activeClass

      if (activeClass) classes[activeClass] = this.isActive
      if (this.proxyClass) classes[this.proxyClass] = this.isActive

      return classes
    },
    computedRipple (): RippleOptions | boolean {
      return this.ripple ?? (!this.disabled && this.isClickable)
    },
    isClickable (): boolean {
      if (this.notALink) return false

      if (this.disabled) return false

      return Boolean(
        this.isLink ||
        this.$attrs.onClick ||
        this.$attrs['on!click'] ||
        this.$attrs.tabindex ||
        this.$props?.onClick
      )
    },
    isLink (): boolean {
      return this.to || this.href || this.link
    },
    styles: () => ({})
  },

  watch: {
    $route: 'onRouteChange'
  },

  mounted () {
    this.onRouteChange()
  },

  methods: {
    generateRouteLink () {
      let exact = this.exact
      let tag

      const directives = [[
        Ripple,
        this.computedRipple
      ]]

      const data: VNodeData = {
        tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined,
        class: this.classes,
        style: this.styles,
        ...mergeListeners(this.$listeners),
        ...('click' in this ? { onClick: (this as any).click } : undefined), // #14447
        ref: 'link'
      }

      if (typeof this.exact === 'undefined') {
        exact = this.to === '/' ||
          (this.to === Object(this.to) && this.to.path === '/')
      }

      if (this.to) {
        // Add a special activeClass hook
        // for component level styles
        let activeClass = this.activeClass
        let exactActiveClass = this.exactActiveClass || activeClass

        if (this.proxyClass) {
          activeClass = [activeClass, this.proxyClass].filter(Boolean).join(' ')
          exactActiveClass = [exactActiveClass, this.proxyClass].filter(Boolean).join(' ')
        }

        tag = resolveComponent(this.nuxt ? 'nuxt-link' : 'router-link')
        Object.assign(data, {
          to: this.to,
          exact,
          exactPath: this.exactPath,
          activeClass,
          exactActiveClass,
          append: this.append,
          replace: this.replace
        })
      } else {
        tag = (this.href && 'a') || this.tag || 'div'

        if (tag === 'a' && this.href) data.href = this.href
      }

      if (this.target) data.target = this.target

      return { tag, data, directives }
    },
    onRouteChange () {
      if (!this.to || !this.$refs.link || !this.$route) return
      const activeClass = `${this.activeClass || ''} ${this.proxyClass || ''}`.trim()
      const exactActiveClass = `${this.exactActiveClass || ''} ${this.proxyClass || ''}`.trim() || activeClass

      const activeClasses = (this.exact ? exactActiveClass : activeClass).split(' ')

      this.$nextTick(() => {
        /* istanbul ignore else */
        const el = (this.$refs.link as any).$el || this.$refs.link
        const isLinkActive = activeClasses.every(c => el?.classList?.contains(c))

        if (isLinkActive !== this.isActive) {
          this.toggle()
        }
      })
    },
    toggle () {
      this.isActive = !this.isActive
    }
  }
})
