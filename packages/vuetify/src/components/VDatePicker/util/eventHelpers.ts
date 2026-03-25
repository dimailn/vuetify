// Utils for creating event listeners that work with Vue 3 emits/attrs pattern

export function createItemTypeListeners (instance: any, itemTypeSuffix: string) {
  const listeners: Record<string, Function> = {}

  const eventAttrs = [
    `onClick${itemTypeSuffix}`,
    `onDblclick${itemTypeSuffix}`
  ]

  eventAttrs.forEach(attrName => {
    const handler = instance.$attrs[attrName]
    if (handler && typeof handler === 'function') {
      listeners[attrName] = handler
    }
  })

  return listeners
}

export function createItemTypeNativeListeners (instance: any, mouseEventType: string, value: any) {
  const listeners: Record<string, Function> = {}

  const eventAttrs = [
    `onClick${mouseEventType.charAt(0).toUpperCase() + mouseEventType.slice(1)}`,
    `onDblclick${mouseEventType.charAt(0).toUpperCase() + mouseEventType.slice(1)}`
  ]

  eventAttrs.forEach(attrName => {
    const handler = instance.$attrs[attrName]
    if (handler && typeof handler === 'function') {
      // Преобразуем onClickDate -> click и onDblclickDate -> dblclick для DOM событий
      const eventName = attrName.slice(2, attrName.length - mouseEventType.length).toLowerCase()
      listeners[eventName] = (event: Event) => {
        handler(value, event)
      }
    }
  })

  return listeners
}
