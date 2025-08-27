// Legacy events mixin for Vue 3 migration
// Provides $on, $off, and $emitLegacy methods to maintain compatibility with Vue 2 code

export const legacyEventsMixin = {
  methods: {
    $emitLegacy (eventName: string, args?: any) {
      if (!this.eventsLegacy || !this.eventsLegacy[eventName]) return

      this.eventsLegacy[eventName].forEach((listener: Function) => listener(args))
    },
    $on (eventName: string, listener: Function) {
      this.eventsLegacy ||= {}
      this.eventsLegacy[eventName] ||= []
      this.eventsLegacy[eventName].push(listener)
      // console.warn("$on is not available")
    },
    $off (eventName: string, listener: Function) {
      if (this.eventsLegacy && this.eventsLegacy[eventName]) {
        this.eventsLegacy[eventName] = this.eventsLegacy[eventName].filter((_listener: Function) => _listener !== listener)
      }
      // console.warn('$off is not available')
    },
  },
  computed: {
    $listeners () {
      const names = Object.keys(this.$attrs).filter(name => name.startsWith('on'))

      return names.reduce((listeners, name) => {
        listeners[name] = this.$attrs[name]
        return listeners
      }, {})
    },
  },
}
