import { DirectiveBinding, ObjectDirective, VNode } from 'vue'

type ObserveHandler = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
  isIntersecting: boolean
) => void;

interface ObserveDirectiveBinding
  extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
  value?:
    | ObserveHandler
    | { handler: ObserveHandler, options?: IntersectionObserverInit }
  modifiers?: {
    once?: boolean
    quiet?: boolean
  }
}

interface IntersectState {
  init: boolean
  observer: IntersectionObserver
}

const intersectState = new WeakMap<HTMLElement, IntersectState>()

function mounted (
  el: HTMLElement,
  binding: ObserveDirectiveBinding,
  vnode: VNode
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) { return }

  const modifiers = binding.modifiers || {}
  const value = binding.value
  const { handler, options } =
    typeof value === 'object' && value !== null && 'handler' in value
      ? value
      : { handler: value, options: {} }

  if (!handler) return

  const observer = new IntersectionObserver(
    (
      entries: IntersectionObserverEntry[] = [],
      observer: IntersectionObserver
    ) => {
      const state = intersectState.get(el)
      if (!state) return // Just in case, should never fire

      const isIntersecting = entries.some(entry => entry.isIntersecting)

      // If is not quiet or has already been
      // initted, invoke the user callback
      if (
        handler &&
        typeof handler === 'function' &&
        (!modifiers.quiet || state.init) &&
        (!modifiers.once || isIntersecting || state.init)
      ) {
        handler(entries, observer, isIntersecting)
      }

      if (isIntersecting && modifiers.once) unmounted(el, binding, vnode)
      else state.init = true
    },
    options
  )

  intersectState.set(el, { init: false, observer })

  observer.observe(el)
}

function updated (
  el: HTMLElement,
  binding: ObserveDirectiveBinding,
  vnode: VNode
) {
  // Если значение изменилось, пересоздаем observer
  if (binding.value !== binding.oldValue) {
    unmounted(el, binding, vnode)
    mounted(el, binding, vnode)
  }
}

function unmounted (
  el: HTMLElement,
  binding: ObserveDirectiveBinding,
  vnode: VNode
) {
  const state = intersectState.get(el)
  if (!state) return

  state.observer.unobserve(el)
  intersectState.delete(el)
}

export const Intersect: ObjectDirective<
  HTMLElement,
  | ObserveHandler
  | { handler: ObserveHandler, options?: IntersectionObserverInit }
> = {
  mounted,
  updated,
  unmounted
}

export default Intersect
