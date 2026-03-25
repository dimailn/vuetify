/* eslint-disable max-len, import/export, no-use-before-define */
import { Component, defineComponent } from 'vue'

export interface MixinBuilder {
  extend: (options: Record<string, any>) => ReturnType<typeof defineComponent>
}

export default function mixins (...args: Component[]): MixinBuilder {
  return {
    extend (options: Record<string, any>) {
      return defineComponent({
        mixins: args as any,
        ...options,
      }) as ReturnType<typeof defineComponent>
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
