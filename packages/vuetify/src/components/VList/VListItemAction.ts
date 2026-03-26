// Types
import { defineComponent, VNode, h, Comment } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-list-item-action',

  render (): VNode {
    const { class: attrClass, ...otherAttrs } = this.$attrs
    let className = attrClass ? `v-list-item__action ${attrClass}` : 'v-list-item__action'
    const children = this.$slots.default?.() || []

    const filteredChild = children.filter((vnode: any) => {
      return vnode?.type !== Comment && vnode?.children !== ' '
    })
    if (filteredChild.length > 1) className += ' v-list-item__action--stack'

    return h('div', {
      ...otherAttrs,
      class: className
    }, children)
  }
})
