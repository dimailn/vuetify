// Types
import type { ComponentPublicInstance } from 'vue'

export type VuetifyGoToTarget = number | string | HTMLElement | ComponentPublicInstance

export type VuetifyGoToEasing =
  ((t: number) => number) |
  'linear' |
  'easeInQuad' |
  'easeOutQuad' |
  'easeInOutQuad' |
  'easeInCubic' |
  'easeOutCubic' |
  'easeInOutCubic' |
  'easeInQuart' |
  'easeOutQuart' |
  'easeInOutQuart' |
  'easeInQuint' |
  'easeOutQuint' |
  'easeInOutQuint'

export interface GoToOptions {
  container?: string | HTMLElement | ComponentPublicInstance
  duration?: number
  offset?: number
  easing?: VuetifyGoToEasing
  appOffset?: boolean
}

export default function goTo(target: VuetifyGoToTarget, options?: GoToOptions): Promise<number>
