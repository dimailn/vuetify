import { DirectiveBinding, ObjectDirective, VNode } from 'vue'

interface ResizeDirectiveBinding extends DirectiveBinding {
  value: () => void
  options?: boolean | AddEventListenerOptions
}

declare global {
  interface HTMLElement {
    _onResize?: Record<
      number,
      {
        callback: () => void
        options: boolean | AddEventListenerOptions
      }
    >
  }
}

function mounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  const callback = binding.value
  const options = binding.options || { passive: true }

  window.addEventListener('resize', callback, options)

  el._onResize = Object(el._onResize)
  el._onResize![vnode.ctx!.uid] = {
    callback,
    options,
  }

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback()
  }
}

function unmounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  if (!el._onResize?.[vnode.ctx!.uid]) return

  const { callback, options } = el._onResize[vnode.ctx!.uid]!

  window.removeEventListener('resize', callback, options)

  delete el._onResize[vnode.ctx!.uid]
}

export const Resize: ObjectDirective = {
  mounted,
  unmounted,
}

export default Resize
