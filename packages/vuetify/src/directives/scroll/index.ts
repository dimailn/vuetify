import { DirectiveBinding, VNode, ObjectDirective } from 'vue'

interface ScrollDirectiveBinding extends Omit<DirectiveBinding, 'modifiers'> {
  value:
    | EventListener
    | {
        handler: EventListener
        options?: boolean | AddEventListenerOptions
      }
    | (EventListenerObject & { options?: boolean | AddEventListenerOptions })
  modifiers?: {
    self?: boolean
  }
}

interface ScrollState {
  handler: EventListener | EventListenerObject
  options: boolean | AddEventListenerOptions
  target?: EventTarget
}

const scrollState = new WeakMap<HTMLElement, ScrollState>()

function mounted (
  el: HTMLElement,
  binding: ScrollDirectiveBinding,
  vnode: VNode
) {
  const { self = false } = binding.modifiers || {}
  const value = binding.value
  const options = (typeof value === 'object' && value.options) || {
    passive: true
  }
  const handler =
    typeof value === 'function' || 'handleEvent' in value
      ? value
      : value.handler

  const target = self
    ? el
    : binding.arg
      ? document.querySelector(binding.arg)
      : window

  if (!target) return

  target.addEventListener('scroll', handler, options)

  scrollState.set(el, {
    handler,
    options,
    // Don't reference self
    target: self ? undefined : target
  })
}

function unmounted (
  el: HTMLElement,
  binding: ScrollDirectiveBinding,
  vnode: VNode
) {
  const state = scrollState.get(el)
  if (!state) return
  const { handler, options, target = el } = state

  target.removeEventListener('scroll', handler, options)
  scrollState.delete(el)
}

export const Scroll: ObjectDirective = {
  mounted,
  unmounted
}

export default Scroll
