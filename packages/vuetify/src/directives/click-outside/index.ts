import { attachedRoot } from '../../util/dom'
import type { VNodeDirective } from '../../types/vue-internal'
import { VNode } from 'vue'

interface ClickOutsideBindingArgs {
  handler: (e: Event) => void
  closeConditional?: (e: Event) => boolean
  include?: () => HTMLElement[]
}

type ClickOutsideDirective = VNodeDirective & {
  value?: ((e: Event) => void) | ClickOutsideBindingArgs
}

interface ClickOutsideState {
  onClick: (e: Event) => void
  onMousedown: (e: Event) => void
  lastMousedownWasOutside: boolean
}

const clickOutsideState = new WeakMap<HTMLElement, ClickOutsideState>()

function defaultConditional () {
  return true
}

function checkEvent (e: PointerEvent, el: HTMLElement, binding: ClickOutsideDirective): boolean {
  // The include element callbacks below can be expensive
  // so we should avoid calling them when we're not active.
  // Explicitly check for false to allow fallback compatibility
  // with non-toggleable components
  if (!e || checkIsActive(e, binding) === false) return false

  // If we're clicking inside the shadowroot, then the app root doesn't get the same
  // level of introspection as to _what_ we're clicking. We want to check to see if
  // our target is the shadowroot parent container, and if it is, ignore.
  const root = attachedRoot(el)
  if (
    typeof ShadowRoot !== 'undefined' &&
    root instanceof ShadowRoot &&
    root.host === e.target
  ) return false

  // Check if additional elements were passed to be included in check
  // (click must be outside all included elements, if any)
  const elements = ((typeof binding.value === 'object' && binding.value.include) || (() => []))()
  // Add the root element for the component this directive was defined on
  elements.push(el)

  // Check if it's a click outside our elements, and then if our callback returns true.
  // Non-toggleable components should take action in their callback and return falsy.
  // Toggleable can return true if it wants to deactivate.
  // Note that, because we're in the capture phase, this callback will occur before
  // the bubbling click event on any outside elements.
  return !elements.some(el => el.contains(e.target as Node))
}

function checkIsActive (e: PointerEvent, binding: ClickOutsideDirective): boolean | void {
  const isActive = (typeof binding.value === 'object' && binding.value.closeConditional) || defaultConditional

  return isActive(e)
}

function directive (e: PointerEvent, el: HTMLElement, binding: ClickOutsideDirective) {
  const handler = typeof binding.value === 'function' ? binding.value : binding.value!.handler
  const state = clickOutsideState.get(el)
  if (!state) return

  state.lastMousedownWasOutside && checkEvent(e, el, binding) && setTimeout(() => {
    checkIsActive(e, binding) && handler && handler(e)
  }, 0)
}

function handleShadow (el: HTMLElement, callback: Function): void {
  const root = attachedRoot(el)

  callback(document)

  if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
    callback(root)
  }
}

export const ClickOutside = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted (el: HTMLElement, binding: ClickOutsideDirective, vnode: VNode) {
    const onClick = (e: Event) => directive(e as PointerEvent, el, binding)
    const onMousedown = (e: Event) => {
      const state = clickOutsideState.get(el)
      if (!state) return
      state.lastMousedownWasOutside = checkEvent(e as PointerEvent, el, binding)
    }

    clickOutsideState.set(el, {
      onClick,
      onMousedown,
      lastMousedownWasOutside: true
    })

    handleShadow(el, (app: HTMLElement) => {
      app.addEventListener('click', onClick, true)
      app.addEventListener('mousedown', onMousedown, true)
    })
  },

  unmounted (el: HTMLElement, binding: ClickOutsideDirective, vnode: VNode) {
    const state = clickOutsideState.get(el)
    if (!state) return

    handleShadow(el, (app: HTMLElement) => {
      if (!app) return

      const { onClick, onMousedown } = state
      app.removeEventListener('click', onClick, true)
      app.removeEventListener('mousedown', onMousedown, true)
    })

    clickOutsideState.delete(el)
  }
}

export default ClickOutside
