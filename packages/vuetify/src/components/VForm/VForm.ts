import {h} from 'vue'
// Components
import VInput from '../VInput/VInput'

// Mixins
import mixins from '../../util/mixins'
import BindsAttrs from '../../mixins/binds-attrs'
import { provide as RegistrableProvide } from '../../mixins/registrable'

// Helpers
import { VNode } from 'vue'
import { getSlot } from '../../util/helpers'

type ErrorBag = Record<number, boolean>
type VInputInstance = InstanceType<typeof VInput>
type Watchers = {
  _uid: number
  valid: () => void
  shouldValidate: () => void
}

/* @vue/component */
export default mixins(
  BindsAttrs,
  RegistrableProvide('form')
  /* @vue/component */
).extend({
  name: 'v-form',

  provide (): object {
    return { form: this }
  },

  inheritAttrs: false,

  props: {
    disabled: Boolean,
    lazyValidation: Boolean,
    readonly: Boolean,
    value: Boolean,
  },

  data: () => ({
    inputs: [] as VInputInstance[],
    watchers: [] as Watchers[],
    errorBag: {} as ErrorBag,
  }),

  watch: {
    errorBag: {
      handler (this: any, val: any) {
        const errors = Object.values(val).includes(true)

        this.$emit('input', !errors)
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    getInputUid(input: any): number {
      return input.$.uid
    },

    watchInput (this: any, input: any): Watchers {
      const uid = this.getInputUid(input)

      const watcher = (input: any): (() => void) => {
        // В Vue 3 $watch может не быть доступен, используем альтернативный подход
        if (typeof input.$watch === 'function') {
          return input.$watch('hasError', (val: boolean) => {
            this.errorBag[uid] = val
          }, { immediate: true })
        } else {
          // Fallback для Vue 3
          return () => {}
        }
      }

      const watchers: Watchers = {
        _uid: uid,
        valid: () => {},
        shouldValidate: () => {},
      }

      if (this.lazyValidation) {
        // Only start watching inputs if we need to
        if (typeof input.$watch === 'function') {
          watchers.shouldValidate = input.$watch('shouldValidate', (val: boolean) => {
            if (!val) return

            // Only watch if we're not already doing it
            if (this.errorBag.hasOwnProperty(uid)) return

            watchers.valid = watcher(input)
          })
        }
      } else {
        watchers.valid = watcher(input)
      }

      return watchers
    },
    /** @public */
    validate (this: any): boolean {
      return this.inputs.filter((input: any) => !input.validate(true)).length === 0
    },
    /** @public */
    reset (this: any): void {
      this.inputs.forEach((input: any) => input.reset())
      this.resetErrorBag()
    },
    resetErrorBag (this: any) {
      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          this.errorBag = {}
        }, 0)
      }
    },
    /** @public */
    resetValidation (this: any) {
      this.inputs.forEach((input: any) => input.resetValidation())
      this.resetErrorBag()
    },
    register (this: any, input: VInputInstance) {
      this.inputs.push(input)
      this.watchers.push(this.watchInput(input))
    },
    unregister (this: any, input: VInputInstance) {
      const inputUid = this.getInputUid(input)
      const found = this.inputs.find((i: any) => this.getInputUid(i) === inputUid)

      if (!found) return

      const unwatch = this.watchers.find((i: any) => i._uid === inputUid)
      if (unwatch) {
        unwatch.valid()
        unwatch.shouldValidate()
      }

      this.watchers = this.watchers.filter((i: any) => i._uid !== inputUid)
      this.inputs = this.inputs.filter((i: any) => this.getInputUid(i) !== inputUid)
      delete this.errorBag[inputUid]
    },
  },

  render (): VNode {
    return h('form', {
      class: 'v-form',
      novalidate: true,
      ...this.attrs$,
      onSubmit: (e: Event) => this.$emit('submit', e),
    }, getSlot(this))
  },
})
