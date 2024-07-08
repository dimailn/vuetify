/* eslint-disable max-len, import/export, no-use-before-define */
import { defineComponent, VueConstructor } from 'vue'

export default function mixins<T extends VueConstructor[]> (...args: T): ExtractVue<T> extends infer V ? V extends Vue ? VueConstructor<V> : never : never
export default function mixins<T extends Vue> (...args: VueConstructor[]): VueConstructor<T>
export default function mixins (...args: VueConstructor[]): VueConstructor {
  return {
    extend(options) {
      return {
        mixins: args,
        ...options
      }
    }
}

/**
 * Returns the instance type from a VueConstructor
 * Useful for adding types when using mixins().extend()
 */
export type ExtractVue<T extends VueConstructor | VueConstructor[]> = T extends (infer U)[]
  ? UnionToIntersection<
    U extends VueConstructor<infer V> ? V : never
  >
  : T extends VueConstructor<infer V> ? V : never

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
