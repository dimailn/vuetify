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

function mounted (
  el: HTMLElement,
  binding: ScrollDirectiveBinding,
  vnode: VNode
) {
  const { self = false } = binding.modifiers || {}
  const value = binding.value
  const options = (typeof value === 'object' && value.options) || {
    passive: true,
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

  el._onScroll = Object(el._onScroll)
  el._onScroll![vnode.ctx!.uid] = {
    handler,
    options,
    // Don't reference self
    target: self ? undefined : target,
  }
}

function unmounted (
  el: HTMLElement,
  binding: ScrollDirectiveBinding,
  vnode: VNode
) {
  if (!el._onScroll?.[vnode.ctx!.uid]) return

  const { handler, options, target = el } = el._onScroll[vnode.ctx!.uid]!

  target.removeEventListener('scroll', handler, options)
  delete el._onScroll[vnode.ctx!.uid]
}

export const Scroll: ObjectDirective = {
  mounted,
  unmounted,
}

export default Scroll
