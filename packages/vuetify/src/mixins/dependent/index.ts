import {defineComponent} from 'vue'

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
}

function searchChildren (children: Vue[]): DependentInstance[] {


  const results = []
  for (let index = 0; index < children.length; index++) {
    const child = children[index] as DependentInstance

    if (child.isActive && child.isDependent) {
      results.push(child)
    } else {
      results.push(...searchChildren(child.children?.default?.() || []))
    }
  }

  return results
}

/* @vue/component */
export default mixins<Vue & options>().extend({
  name: 'dependent',

  data () {
    return {
      closeDependents: true,
      isActive: false,
      isDependent: true,
    }
  },

  watch: {
    isActive (val) {
      if (val) return

      const openDependents = this.getOpenDependents()
      for (let index = 0; index < openDependents.length; index++) {
        openDependents[index].isActive = false
      }
    },
  },

  methods: {
    getOpenDependents (): any[] {
      if (this.closeDependents) return searchChildren(this.$slots.default())

      return []
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
    },
  },
})
