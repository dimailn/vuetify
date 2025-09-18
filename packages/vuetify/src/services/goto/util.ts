// Return target's cumulative offset from the top
export function getOffset (target: any): number {
  if (typeof target === 'number') {
    return target
  }

  let el = $(target)

  if (!el) {
    throw typeof target === 'string'
      ? new Error(`Target element "${target}" not found.`)
      : new TypeError(`Target must be a Number/Selector/HTMLElement/VueComponent, received ${type(target)} instead.`)
  }

  let totalOffset = 0
  while (el) {
    totalOffset += el.offsetTop
    el = el.offsetParent as HTMLElement
  }

  return totalOffset
}

export function getContainer (container: any): HTMLElement {
  const el = $(container)

  if (el) return el

  throw typeof container === 'string'
    ? new Error(`Container element "${container}" not found.`)
    : new TypeError(`Container must be a Selector/HTMLElement/VueComponent, received ${type(container)} instead.`)
}

function type (el: any) {
  if (el == null) return el
  // Vue 3 component detection
  if (isVue3Component(el)) return 'VueComponent'
  return el.constructor?.name || 'Unknown'
}

// Helper function to detect Vue 3 component instances
function isVue3Component (el: any): boolean {
  // Check for Vue 3 component instance properties
  return !!(el && (
    // Direct component instance with $el
    el.$el ||
    // Component instance with appContext (Vue 3 runtime)
    el.appContext ||
    // Component proxy with type property (from Vue Test Utils)
    (el.type && (el.type.name || el.type.__name)) ||
    // Component with setupState (Composition API)
    el.setupState ||
    // Component with ctx property (internal Vue 3)
    (el.ctx && el.ctx.type)
  ))
}

function $ (el: any): HTMLElement | null {
  if (typeof el === 'string') {
    return document.querySelector<HTMLElement>(el)
  } else if (el instanceof HTMLElement) {
    return el
  } else if (isVue3Component(el)) {
    return extractElementFromVue3Component(el)
  } else {
    return null
  }
}

// Helper function to extract HTMLElement from Vue 3 component
function extractElementFromVue3Component (component: any): HTMLElement | null {
  if (component.$el instanceof HTMLElement) {
    return component.$el
  }

  if (component.element instanceof HTMLElement) {
    return component.element
  }

  if (component.ctx?.vnode?.el instanceof HTMLElement) {
    return component.ctx.vnode.el
  }

  if (component.vnode?.el instanceof HTMLElement) {
    return component.vnode.el
  }

  return null
}
