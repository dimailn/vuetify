// Directives
import ripple from '../../directives/ripple'

// Types
import Vue, { VNode, VNodeData, VNodeDirective, defineComponent, withDirectives } from 'vue'

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

      const node = this.$createElement('div', data)

      return withDirectives(node, [
        ...(data.directives || []),
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
