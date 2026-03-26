/* eslint-disable no-console */
import Vuetify from '../framework'

function createMessage (message: string, vm?: any, parent?: any): string | void {
  if (Vuetify.config.silent) return

  if (parent) {
    vm = {
      _isVue: true,
      $parent: parent,
      $options: vm
    }
  }

  if (vm) {
    vm.$_alreadyWarned = vm.$_alreadyWarned || []
    if (vm.$_alreadyWarned.includes(message)) return
    vm.$_alreadyWarned.push(message)
  }

  return `[Vuetify] ${message}` + (
    vm ? generateComponentTrace(vm) : ''
  )
}

export function consoleInfo (message: string, vm?: any, parent?: any): void {
  const newMessage = createMessage(message, vm, parent)
  newMessage != null && console.info(newMessage)
}

export function consoleWarn (message: string, vm?: any, parent?: any): void {
  const newMessage = createMessage(message, vm, parent)
  newMessage != null && console.warn(newMessage)
}

export function consoleError (message: string, vm?: any, parent?: any): void {
  const newMessage = createMessage(message, vm, parent)
  newMessage != null && console.error(newMessage)
}

export function deprecate (original: string, replacement: string, vm?: any, parent?: any) {
  consoleWarn(`[UPGRADE] '${original}' is deprecated, use '${replacement}' instead.`, vm, parent)
}
export function breaking (original: string, replacement: string, vm?: any, parent?: any) {
  consoleError(`[BREAKING] '${original}' has been removed, use '${replacement}' instead.`, vm, parent)
}
export function removed (original: string, vm?: any, parent?: any) {
  consoleWarn(`[REMOVED] '${original}' has been removed. You can safely omit it.`, vm, parent)
}

/**
 * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
 */

const classifyRE = /(?:^|[-_])(\w)/g
const classify = (str: string) => str
  .replace(classifyRE, c => c.toUpperCase())
  .replace(/[-_]/g, '')

function formatComponentName (vm: any): string {
  if (vm === vm?.appContext?.app?._instance?.proxy) {
    return '<Root>'
  }

  const { name } = extractComponentInfo(vm)
  const additionalInfo = getAdditionalVue3Info(vm)

  const componentName = name ? `<${classify(name)}>` : '<Anonymous>'
  const additionalInfoStr = additionalInfo.length > 0 ? ` (${additionalInfo.join(', ')})` : ''

  return componentName + additionalInfoStr
}

function extractComponentInfo (vm: any): { name?: string } {
  const options = vm?.$options || vm?.vnode?.type || vm?.type || vm || {}
  return { name: options.name }
}

function getAdditionalVue3Info (vm: any): string[] {
  const additionalInfo: string[] = []

  if (vm?.props && typeof vm.props === 'object') {
    const propKeys = Object.keys(vm.props).slice(0, 3)
    if (propKeys.length > 0) {
      additionalInfo.push(`props: ${propKeys.join(', ')}${Object.keys(vm.props).length > 3 ? '...' : ''}`)
    }
  }

  if (vm?.setupState && typeof vm.setupState === 'object') {
    const setupKeys = Object.keys(vm.setupState).slice(0, 2)
    if (setupKeys.length > 0) {
      additionalInfo.push(`setup: ${setupKeys.join(', ')}${Object.keys(vm.setupState).length > 2 ? '...' : ''}`)
    }
  }

  return additionalInfo
}

function generateComponentTrace (vm: any): string {
  if (vm?.parent || vm?.$parent) {
    const tree: any[] = []
    let currentRecursiveSequence = 0
    let currentVm = vm

    while (currentVm) {
      if (tree.length > 0) {
        const last: any = tree[tree.length - 1]
        if (last.constructor === currentVm.constructor) {
          currentRecursiveSequence++
          currentVm = currentVm.parent || currentVm.$parent
          continue
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence]
          currentRecursiveSequence = 0
        }
      }
      tree.push(currentVm)
      currentVm = currentVm.parent || currentVm.$parent
    }

    return '\n\nfound in\n\n' + tree
      .map((vm, i) => `${
        i === 0 ? '---> ' : ' '.repeat(5 + i * 2)
      }${
        Array.isArray(vm)
          ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
          : formatComponentName(vm)
      }`)
      .join('\n')
  } else {
    return `\n\n(found in ${formatComponentName(vm)})`
  }
}
