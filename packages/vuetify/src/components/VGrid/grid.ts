// Types
import { defineComponent, VNode, h } from 'vue'

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

    render() {
      const data: any = { ...this.$attrs }
      const children = this.$slots?.default?.() || []
      const componentProps = this.$props

      data.class = [name, data.class].filter(Boolean)

      const { attrs: dataAttrs } = data
      if (dataAttrs) {
        // reset attrs to extract utility clases like pa-3
        data.attrs = {}
        const classes = Object.keys(dataAttrs).filter(key => {
          // TODO: Remove once resolved
          // https://github.com/vuejs/vue/issues/7841
          if (key === 'slot') return false

          const value = dataAttrs[key]

          // add back data attributes like data-test="foo" but do not
          // add them as classes
          if (key.startsWith('data-')) {
            data.attrs![key] = value
            return false
          }

          return value || typeof value === 'string'
        })

        if (classes.length) data.class = [...data.class, ...classes]
      }

      if (componentProps?.id) {
        data.id = componentProps.id
      }

      return h(componentProps?.tag || 'div', data, children)
    }
  })
}
