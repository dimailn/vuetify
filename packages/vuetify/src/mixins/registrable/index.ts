import { defineComponent } from 'vue'
import type { Component } from 'vue'
import { consoleWarn } from '../../util/console'

function generateWarning (child: string, parent: string) {
  return () => consoleWarn(`The ${child} component must be used inside a ${parent}`)
}

export type Registrable<T extends string, C extends Component | null = null> = Component

export function inject<
  T extends string, C extends Component | null = null
> (namespace: T, child?: string, parent?: string): Registrable<T, C> {
  const defaultImpl = child && parent
    ? {
        register: generateWarning(child, parent),
        unregister: generateWarning(child, parent)
      }
    : null

  return defineComponent({
    name: 'registrable-inject',

    inject: {
      [namespace]: {
        default: defaultImpl
      }
    }
  })
}

export function provide (namespace: string, self = false) {
  return defineComponent({
    name: 'registrable-provide',

    provide (): object {
      return {
        [namespace]: self
          ? this
          : {
              register: (this as any).register,
              unregister: (this as any).unregister
            }
      }
    }
  })
}
