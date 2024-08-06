// Mixins
import Colorable from '../colorable'

// Utilities
import mixins from '../../util/mixins'
import { kebabCase } from '../../util/helpers'

// Types
import { VNodeChildren, h } from 'vue'

/* @vue/component */
export default mixins(
  Colorable
).extend({
  methods: {
    genPickerButton (
      prop: string,
      value: any,
      content: VNodeChildren,
      readonly = false,
      staticClass = ''
    ) {
      const active = (this as any)[prop] === value
      const onClick = (event: Event) => {
        event.stopPropagation()
        this.$emit(`update:${kebabCase(prop)}`, value)
      }

      return h('div', {
        class: [`v-picker__title__btn ${staticClass}`.trim(), {
          'v-picker__title__btn--active': active,
          'v-picker__title__btn--readonly': readonly,
        }],
        ...((active || readonly) ? {} : { onClick }),
      }, Array.isArray(content) ? content : [content])
    },
  },
})
