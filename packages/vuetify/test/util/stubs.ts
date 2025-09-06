// Test stubs for Vue 3 components
import { defineComponent, h } from 'vue'

/**
 * Custom RouterLinkStub with proper default slot handling for Vue 3
 * Fixes the "Non-function value encountered for default slot" warning
 * while maintaining proper attribute inheritance and router functionality
 */
export const Vue3RouterLinkStub = defineComponent({
  name: 'RouterLinkStub',
  inheritAttrs: false,
  props: {
    to: { type: [String, Object], required: true },
    custom: { type: Boolean, default: false },
    exact: { type: Boolean, default: false },
    activeClass: { type: String, default: 'router-link-active' },
    exactActiveClass: { type: String, default: 'router-link-exact-active' },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const slotContent = slots.default ? slots.default() : 'Router Link'
      const href = typeof props.to === 'string' ? props.to : attrs.href || '#'
      return h('a', { ...attrs, href }, slotContent)
    }
  },
})
