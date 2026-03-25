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

    const existingClasses = node.data?.class || ''
    const contentClasses = normalizeClasses(`${existingClasses} v-content`)
    node.data = { ...node.data, class: contentClasses }

    if (node.children && node.children[0] && node.children[0].data) {
      const childExistingClasses = node.children[0].data.class || ''
      const wrapClasses = normalizeClasses(`${childExistingClasses} v-content__wrap`)
      node.children[0].data = { ...node.children[0].data, class: wrapClasses }
    }

    return h(getTagValue(this.tag), node.data, node.children)
  }
})
