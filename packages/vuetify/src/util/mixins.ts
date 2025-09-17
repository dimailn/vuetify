/* eslint-disable max-len, import/export, no-use-before-define */
import { Component, defineComponent } from 'vue'

export default function mixins<T extends Component[]> (...args: T): ExtractVue<T> extends infer V ? V extends Component ? Component<V> : never : never
export default function mixins<T extends Component> (...args: Component[]): Component<T>
export default function mixins (...args: Component[]) {
  return {
    extend (options) {
      return defineComponent({
        mixins: args,
        ...options,
      })
    },
  }
}

/**
 * Returns the instance type from a Vue 3 Component
 * Useful for adding types when using mixins().extend()
 */
export type ExtractVue<T extends Component | Component[]> = T extends (infer U)[]
  ? UnionToIntersection<
    U extends Component<infer V> ? V : never
  >
  : T extends Component<infer V> ? V : never

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
