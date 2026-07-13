import { h } from 'vue'
// Types
import { VNode, defineComponent } from 'vue'

// Extensions
import VMain from '../VMain/VMain'
import { deprecate } from '../../util/console'
import { normalizeClasses, getTagValue } from '../../util/helpers'

/* @vue/component */
export default defineComponent({
  name: 'v-main',

  extends: VMain,

  created () {
    deprecate('v-content', 'v-main', this)
  },

  render (): VNode {
    // Add the legacy class names
    const node = VMain.render.call(this, h)

    const existingClasses = node.props?.class || ''
    const contentClasses = normalizeClasses(`${existingClasses} v-content`)

    const children = (node.children as VNode[] | undefined)?.map((child, i) => {
      if (i !== 0) return child

      const childExistingClasses = child.props?.class || ''
      const wrapClasses = normalizeClasses(`${childExistingClasses} v-content__wrap`)

      return h('div', { ...child.props, class: wrapClasses }, child.children as any)
    })

    return h(getTagValue(this.tag), { ...node.props, class: contentClasses }, children ?? node.children)
  }
})
