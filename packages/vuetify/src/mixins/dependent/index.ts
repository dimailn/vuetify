import { defineComponent } from 'vue'
import type { VNode } from 'vue'

import mixins from '../../util/mixins'
import { VOverlay } from '../../components/VOverlay'

interface options {
  $el: HTMLElement
  $refs: {
    content?: HTMLElement
  }
  overlay?: InstanceType<typeof VOverlay>
}

interface DependentInstance extends Vue {
  isActive?: boolean
  isDependent?: boolean
  getClickableDependentElements?: () => HTMLElement[]
}

function searchVNodeTree (vnodes: VNode[]): DependentInstance[] {
  const results: DependentInstance[] = []

  for (const vnode of vnodes) {
    const proxy = (vnode as any).component?.proxy as DependentInstance | undefined

    if (proxy?.isActive && proxy?.isDependent) {
      results.push(proxy)
    } else {
      const subTree = (vnode as any).component?.subTree
      if (subTree) {
        results.push(...searchVNodeTree(Array.isArray(subTree) ? subTree : [subTree]))
      }

      const children = (vnode as any).children
      if (Array.isArray(children)) {
        results.push(...searchVNodeTree(children))
      }
    }
  }

  return results
}

/* @vue/component */
export default mixins().extend({
  name: 'dependent',

  data () {
    return {
      closeDependents: true,
      isActive: false,
      isDependent: true
    }
  },

  watch: {
    isActive (val) {
      if (val) return

      const openDependents = this.getOpenDependents()
      for (let index = 0; index < openDependents.length; index++) {
        openDependents[index].isActive = false
      }
    }
  },

  methods: {
    getOpenDependents (): any[] {
      if (!this.closeDependents) return []

      const subTree = (this.$ as any)?.subTree
      if (!subTree) return []

      return searchVNodeTree(Array.isArray(subTree) ? subTree : [subTree])
    },
    getOpenDependentElements (): HTMLElement[] {
      const result = []
      const openDependents = this.getOpenDependents()

      for (let index = 0; index < openDependents.length; index++) {
        result.push(...openDependents[index].getClickableDependentElements())
      }

      return result
    },
    getClickableDependentElements (): HTMLElement[] {
      const result = [this.$el]
      if (this.$refs.content) result.push(this.$refs.content)
      if (this.overlay) result.push(this.overlay.$el as HTMLElement)
      result.push(...this.getOpenDependentElements())

      return result
    }
  }
})
