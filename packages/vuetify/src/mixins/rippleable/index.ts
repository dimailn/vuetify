// Directives
import ripple from '../../directives/ripple'

// Types
import Vue, { VNode, VNodeData, VNodeDirective, defineComponent, withDirectives, h } from 'vue'

export default defineComponent({
  name: 'rippleable',

  directives: { ripple },

  props: {
    ripple: {
      type: [Boolean, Object],
      default: true,
    },
  },

  methods: {
    genRipple (data: VNodeData = {}): VNode | null {
      if (!this.ripple) return null

      data.class = 'v-input--selection-controls__ripple'

      const node = h('div', data)

      const directives = data.directives || []
      delete data.directives

      return withDirectives(node, [
        ...(directives),
        [
          ripple,
          { center: true },
          '',
          {}
        ]
      ])
    },
  },
})
