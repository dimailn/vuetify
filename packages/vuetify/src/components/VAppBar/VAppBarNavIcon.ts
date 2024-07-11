// Components
import VIcon from '../VIcon'
import VBtn from '../VBtn/VBtn'

// Types
import {defineComponent, h} from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-app-bar-nav-icon',

  functional: true,

  render () {
    const data = this.$attrs
    const props = this.$props

    const d = Object.assign(data, {
      class: (`v-app-bar__nav-icon ${data.class || ''}`).trim(),
      props: {
        ...props,
        icon: true,
      }
    })

    const defaultSlot = this.$slots.default?.()

    return h(VBtn, d, defaultSlot || [h(VIcon, '$menu')])
  },
})
