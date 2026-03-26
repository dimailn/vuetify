import { h, withDirectives, VNode } from 'vue'
import Routable from '../../mixins/routable'

import mixins from '../../util/mixins'
import { getSlot, getTagValue } from '../../util/helpers'

/* @vue/component */
export default mixins(Routable).extend({
  name: 'v-breadcrumbs-item',

  props: {
    // In a breadcrumb, the currently
    // active item should be dimmed
    activeClass: {
      type: String,
      default: 'v-breadcrumbs__item--disabled'
    },
    ripple: {
      type: [Boolean, Object],
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },

  computed: {
    classes (): object {
      return {
        'v-breadcrumbs__item': true,
        [this.activeClass]: this.disabled
      }
    }
  },

  render (): VNode {
    const { tag, data, directives } = this.generateRouteLink()
    const slotContent = getSlot(this)

    const linkData = {
      ...data,
      'aria-current': this.isActive && this.isLink ? 'page' : undefined
    }

    // Строка из Routable (div / a / кастомный tag) — через getTagValue для имён компонентов;
    // при наличии `to` сюда уже попадает resolveComponent(router-link), не строка.
    const resolvedTag = typeof tag === 'string' ? getTagValue(tag) : tag
    const isNativeTag = typeof resolvedTag === 'string'

    const normalizedChildren =
      slotContent == null
        ? null
        : (Array.isArray(slotContent) ? slotContent : [slotContent])

    let link: VNode
    if (normalizedChildren == null) {
      link = h(resolvedTag as any, linkData)
    } else if (isNativeTag) {
      link = h(resolvedTag, linkData, normalizedChildren)
    } else {
      // Vue 3: у компонента дети через слот-функцию; у нативного тега — массивом.
      link = h(resolvedTag, linkData, () => normalizedChildren)
    }

    return withDirectives(h('li', [link]), directives)
  }
})
