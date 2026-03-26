// Legacy events mixin for Vue 3 migration
// Provides $on, $off, and $emitLegacy methods to maintain compatibility with Vue 2 code

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
      const names = Object.keys(this.$attrs).filter((name: string) => name.startsWith('on'))

      return names.reduce((listeners: Record<string, unknown>, name: string) => {
        listeners[name] = this.$attrs[name]
        return listeners
      }, {})
    }
  }
}
