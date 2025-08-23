// Types
import { defineComponent, VNode, h } from 'vue'
import { getSlot } from '../../util/helpers'

export default function VGrid (name: string) {
  /* @vue/component */
  return defineComponent({
    name: `v-${name}`,

    props: {
      id: String,
      tag: {
        type: String,
        default: 'div',
      },
    },

    render (): VNode {
      const data = { ...this.$attrs }
      const children = getSlot(this) || []
      const props = this.$props

      // Start with the base class
      let classes = [name]

      // Extract utility classes from attrs and filter out non-class attributes
      if (data.attrs) {
        const utilityClasses = Object.keys(data.attrs).filter(key => {
          // TODO: Remove once resolved
          // https://github.com/vuejs/vue/issues/7841
          if (key === 'slot') return false

          const value = (data.attrs as Record<string, any>)[key]

          // add back data attributes like data-test="foo" but do not
          // add them as classes
          if (key.startsWith('data-')) {
            return false
          }

          return value || typeof value === 'string'
        })

        if (utilityClasses.length) {
          classes = classes.concat(utilityClasses)
        }

        // Filter out non-class attributes to prevent them from being rendered as DOM attributes
        const filteredAttrs: Record<string, any> = {}
        Object.keys(data.attrs).forEach(key => {
          if (key.startsWith('data-')) {
            filteredAttrs[key] = (data.attrs as Record<string, any>)[key]
          }
        })
        data.attrs = filteredAttrs
      }

      // Set the class
      data.class = classes.join(' ')

      // Handle ID
      if (props.id) {
        if (!data.domProps) {
          data.domProps = {}
        }
        (data.domProps as Record<string, any>).id = props.id
      }

      return h(props.tag, data, children)
    },
  })
}
