/**
 * @copyright 2017 Alex Regan
 * @license MIT
 * @see https://github.com/alexsasharegan/vue-functional-data-merge
 */
/* eslint-disable max-statements */
import type { VNodeData } from '../types/vue-internal'
import { camelize, wrapInArray } from './helpers'

const pattern = {
  styleList: /;(?![^(]*\))/g,
  styleProp: /:(.*)/
} as const

function parseStyle (style: string) {
  const styleMap: Dictionary<any> = {}

  for (const s of style.split(pattern.styleList)) {
    let [key, val] = s.split(pattern.styleProp)
    key = key.trim()
    if (!key) {
      continue
    }
    // May be undefined if the `key: value` pair is incomplete.
    if (typeof val === 'string') {
      val = val.trim()
    }
    styleMap[camelize(key)] = val
  }

  return styleMap
}

/**
 * Intelligently merges data for createElement.
 * Merges arguments left to right, preferring the right argument.
 * Returns new VNodeData object.
 */
export default function mergeData (...vNodeData: VNodeData[]): VNodeData
export default function mergeData (): VNodeData {
  const mergeTarget: VNodeData & Dictionary<any> = {}
  let i: number = arguments.length
  let prop: string

  // Allow for variadic argument length.
  while (i--) {
    // Iterate through the data properties and execute merge strategies
    // Object.keys eliminates need for hasOwnProperty call
    for (prop of Object.keys(arguments[i])) {
      switch (prop) {
        // Array merge strategy (array concatenation)
        case 'class':
        case 'directives':
          if (arguments[i][prop]) {
            mergeTarget[prop] = mergeClasses(mergeTarget[prop], arguments[i][prop])
          }
          break
        case 'style':
          if (arguments[i][prop]) {
            mergeTarget[prop] = mergeStyles(mergeTarget[prop], arguments[i][prop])
          }
          break
        // Object, the properties of which to merge via array merge strategy (array concatenation).
        // Callback merge strategy merges callbacks to the beginning of the array,
        // so that the last defined callback will be invoked first.
        // This is done since to mimic how Object.assign merging
        // uses the last given value to assign.
        case 'on':
        case 'nativeOn':
          if (arguments[i][prop]) {
            mergeTarget[prop] = mergeListeners(mergeTarget[prop], arguments[i][prop])
          }
          break
        // Object merge strategy
        case 'attrs':
        case 'props':
        case 'domProps':
        case 'scopedSlots':
        case 'staticStyle':
        case 'hook':
        case 'transition':
          if (!arguments[i][prop]) {
            break
          }
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = {}
          }
          mergeTarget[prop] = { ...arguments[i][prop], ...mergeTarget[prop] }
          break
        // Reassignment strategy (no merge)
        default: // slot, key, ref, tag, show, keepAlive
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = arguments[i][prop]
          }
      }
    }
  }

  return mergeTarget
}

export function mergeStyles (
  target: undefined | string | object[] | object,
  source: undefined | string | object[] | object
) {
  if (!target) return source
  if (!source) return target

  target = wrapInArray(typeof target === 'string' ? parseStyle(target) : target)

  return (target as object[]).concat(typeof source === 'string' ? parseStyle(source) : source)
}

export function mergeClasses (target: any, source: any) {
  if (!source) return target
  if (!target) return source

  return target ? wrapInArray(target).concat(source) : source
}

export function mergeListeners (...args: [
  { [key: string]: Function | Function[] } | undefined,
  { [key: string]: Function | Function[] } | undefined
]) {
  if (!args[0] && !args[1]) return undefined

  const dest: { [key: string]: Function | Function[] } = {}

  for (let i = 2; i--;) {
    const arg = args[i]
    if (!arg) continue

    for (const event in arg) {
      if (!arg[event]) continue

      const vueEventName = event.startsWith('on') && event.length > 2 && event.charAt(2) === event.charAt(2).toUpperCase()
        ? event
        : `on${event.charAt(0).toUpperCase() + event.slice(1)}`

      if (dest[vueEventName]) {
        // Merge current listeners before (because we are iterating backwards).
        // Note that neither "target" or "source" must be altered.
        dest[vueEventName] = ([] as Function[]).concat(arg[event], dest[vueEventName])
      } else {
        // Straight assign.
        dest[vueEventName] = arg[event]
      }
    }
  }

  return dest
}
