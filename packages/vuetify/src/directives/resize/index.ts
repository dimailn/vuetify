import { DirectiveBinding, ObjectDirective, VNode } from 'vue'

interface ResizeDirectiveBinding extends DirectiveBinding {
  value: () => void
  options?: boolean | AddEventListenerOptions
}

interface ResizeState {
  callback: () => void
  options: boolean | AddEventListenerOptions
}

const resizeState = new WeakMap<HTMLElement, ResizeState>()

function mounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  const callback = binding.value
  const options = binding.options || { passive: true }

  window.addEventListener('resize', callback, options)

  resizeState.set(el, {
    callback,
    options
  })

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback()
  }
}

function unmounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  const state = resizeState.get(el)
  if (!state) return
  const { callback, options } = state

  window.removeEventListener('resize', callback, options)
  resizeState.delete(el)
}

export const Resize: ObjectDirective = {
  mounted,
  unmounted
}

export default Resize
