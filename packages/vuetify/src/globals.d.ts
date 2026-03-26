/* eslint-disable max-len */

import type { Component } from 'vue'
import type { TouchStoredHandlers } from './directives/touch'

declare global {
  interface Window {
    Vue: Component
  }

  interface HTMLCollection {
    [Symbol.iterator] (): IterableIterator<Element>
  }

  interface Element {
    getElementsByClassName(classNames: string): NodeListOf<HTMLElement>
  }

  interface HTMLElement {
    _clickOutside?: Record<number, {
      onClick: EventListener
      onMousedown: EventListener
    } | undefined> & { lastMousedownWasOutside: boolean }
    _onResize?: Record<number, {
      callback: () => void
      options?: boolean | AddEventListenerOptions
    } | undefined>
    _ripple?: {
      enabled?: boolean
      centered?: boolean
      class?: string
      circle?: boolean
      touched?: boolean
      isTouch?: boolean
      showTimer?: number
      showTimerCommit?: (() => void) | null
    }
    _observe?: Record<number, {
      init: boolean
      observer: IntersectionObserver
    } | undefined>
    _mutate?: Record<number, {
      observer: MutationObserver
    } | undefined>
    _onScroll?: Record<number, {
      handler: EventListenerOrEventListenerObject
      options: boolean | AddEventListenerOptions
      target?: EventTarget
    } | undefined>
    _touchHandlers?: {
      [_uid: number]: TouchStoredHandlers
    }
    _transitionInitialStyles?: {
      position: string
      top: string
      left: string
      width: string
      height: string
    }
  }

  interface WheelEvent {
    path?: EventTarget[]
  }

  interface UIEvent {
    initUIEvent (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number): void
  }

  function parseInt(s: string | number, radix?: number): number
  function parseFloat(string: string | number): number

  type Dictionary<T> = Record<string, T>

  /** Историческое имя инстанса в миксинах/хелперах (Vue 3: ComponentPublicInstance) */
  type Vue = import('vue').ComponentPublicInstance

  const __VUETIFY_VERSION__: string
  const __REQUIRED_VUE__: string
}
