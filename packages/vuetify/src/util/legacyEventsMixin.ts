// Legacy events mixin for Vue 3 migration
// Provides $on, $off, and $emitLegacy methods to maintain compatibility with Vue 2 code

export function vue3AttrToVue2ListenerName (attr: string): string {
  if (!attr.startsWith('on') || attr.length <= 2) return attr
  return attr.charAt(2).toLowerCase() + attr.slice(3)
}

export function vue2ListenerNameToVue3Attr (name: string): string {
  return 'on' + name.charAt(0).toUpperCase() + name.slice(1)
}

export const legacyEventsMixin = {
  methods: {
    $emitLegacy (this: any, eventName: string, args?: any) {
      if (!this.eventsLegacy || !this.eventsLegacy[eventName]) return

      this.eventsLegacy[eventName].forEach((listener: Function) => listener(args))
    },
    $on (this: any, eventName: string, listener: Function) {
      this.eventsLegacy ||= {}
      this.eventsLegacy[eventName] ||= []
      this.eventsLegacy[eventName].push(listener)
      // console.warn("$on is not available")
    },
    $off (this: any, eventName: string, listener: Function) {
      if (this.eventsLegacy && this.eventsLegacy[eventName]) {
        this.eventsLegacy[eventName] = this.eventsLegacy[eventName].filter((_listener: Function) => _listener !== listener)
      }
      // console.warn('$off is not available')
    }
  },
  computed: {
    $listeners (this: any): Record<string, unknown> {
      return Object.keys(this.$attrs)
        .filter((name: string) => name.startsWith('on') && name.length > 2)
        .reduce((listeners: Record<string, unknown>, name: string) => {
          listeners[vue3AttrToVue2ListenerName(name)] = this.$attrs[name]
          return listeners
        }, {} as Record<string, unknown>)
    }
  }
}
