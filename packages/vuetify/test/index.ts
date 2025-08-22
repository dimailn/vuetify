import { ComponentPublicInstance, ComponentOptions } from 'vue'
import { VueWrapper } from '@vue/test-utils'
import { config } from '@vue/test-utils'
import { legacyEventsMixin } from '../src/util/legacyEventsMixin'
import toHaveBeenWarnedInit from './util/to-have-been-warned'

// Configure global mixins for all tests
// This provides $on, $off, and $emitLegacy methods to all components in tests
config.global.mixins = [legacyEventsMixin]

// Initialize custom Jest matchers globally
// This provides toHaveBeenWarned and toHaveBeenTipped matchers for all tests
toHaveBeenWarnedInit()

// Import Jest custom matchers types
/// <reference path="./types/jest.d.ts" />

// Vue.prototype.$vuetify = {
//   icons: {},
// }

export function functionalContext (context: ComponentOptions<ComponentPublicInstance> = {}, children = []) {
  if (!Array.isArray(children)) children = [children]
  return {
    context: {
      data: {},
      props: {},
      ...context,
    },
    children,
  }
}

export function touch (element: VueWrapper<any>) {
  const createTrigger = (eventName: string) => (clientX: number, clientY: number) => {
    const touches = [{ clientX, clientY }]
    const event = new Event(eventName)

    ;(event as any).touches = touches
    ;(event as any).changedTouches = touches
    element.element.dispatchEvent(event)

    return touch(element)
  }

  return {
    start: createTrigger('touchstart'),
    move: createTrigger('touchmove'),
    end: createTrigger('touchend'),
  }
}

export const wait = (timeout?: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const waitAnimationFrame = (timeout?: number) => {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export const resizeWindow = (width = window.innerWidth, height = window.innerHeight) => {
  (window as any).innerWidth = width
  ;(window as any).innerHeight = height
  window.dispatchEvent(new Event('resize'))
  return wait(200)
}

export const scrollWindow = (y: number) => {
  (window as any).pageYOffset = y
  window.dispatchEvent(new Event('scroll'))

  return wait(200)
}

// Add a global mockup for IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  callback: (entries: any, observer: any) => void

  constructor (callback: (entries: any, observer: any) => void, options?: any) {
    this.callback = callback
  }

  observe () {
    this.callback([], this)
    return null
  }

  unobserve () {
    this.callback = () => {}
    return null
  }
}


