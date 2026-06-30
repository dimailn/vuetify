import { DirectiveBinding, VNode } from 'vue'

type MutateHandler = (
  mutationsList: MutationRecord[],
  observer: MutationObserver
) => void;

type MutateValue =
  | MutateHandler
  | { handler: MutateHandler, options?: MutationObserverInit };

type MutateModifiers = {
  once?: boolean
  attr?: boolean
  child?: boolean
  sub?: boolean
  char?: boolean
};

interface MutateState {
  observer: MutationObserver
}

const mutateState = new WeakMap<HTMLElement, MutateState>()

function mounted (
  el: HTMLElement,
  binding: DirectiveBinding<MutateValue>,
  vnode: VNode
) {
  const modifiers = (binding.modifiers as MutateModifiers) || {}
  const value = binding.value
  const callback = typeof value === 'object' ? value.handler : value!
  const { once, ...modifierKeys } = modifiers
  const hasModifiers = Object.keys(modifierKeys).length > 0

  // Options take top priority
  const options =
    typeof value === 'object' && value.options
      ? value.options
      : hasModifiers
        ? {
          // If we have modifiers, use only those provided
            attributes: modifierKeys.attr,
            childList: modifierKeys.child,
            subtree: modifierKeys.sub,
            characterData: modifierKeys.char
          }
        : {
          // Defaults to everything on
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
          }

  const observer = new MutationObserver(
    (mutationsList: MutationRecord[], observer: MutationObserver) => {
      /* istanbul ignore if */
      if (!mutateState.has(el)) return // Just in case, should never fire

      callback(mutationsList, observer)

      // If has the once modifier, unbind
      once && unmounted(el, binding, vnode)
    }
  )

  observer.observe(el, options)
  mutateState.set(el, { observer })
}

function unmounted (
  el: HTMLElement,
  binding: DirectiveBinding<MutateValue>,
  vnode: VNode
) {
  const state = mutateState.get(el)
  if (!state) return

  state.observer.disconnect()
  mutateState.delete(el)
}

export const Mutate = {
  mounted,
  unmounted
}

export default Mutate
