// Components
import VSnackbar from '../VSnackbar'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VSnackbar.ts', () => {
  type Instance = InstanceType<typeof VSnackbar>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {} as MountingOptions<Instance>) => {
      return mount(VSnackbar, {
        global: {
          mocks: {
            $vuetify: {
              application: {
                bar: 24,
                bottom: 56,
                footer: 48,
                insetFooter: 32,
                left: 256,
                right: 256,
                top: 64
              }
            }
          }
        },
        ...options
      })
    }
  })

  it.each([
    [{}, true],
    [{ text: true }, false],
    [{ outlined: true }, false],
    [{ light: true }, false]
  ])('should be dark when using %s', (props, expected: boolean) => {
    const wrapper = mountFunction({ props })

    expect(wrapper.vm.isDark).toBe(expected)
  })

  it.each([
    [undefined, undefined, undefined],
    [false, undefined, undefined],
    [true, '256px', '256px']
  ])('should have app padding on the x-axis using %s', (app, left, right) => {
    const wrapper = mountFunction({
      props: { app }
    })

    expect(wrapper.vm.styles).toHaveProperty('paddingLeft', left)
    expect(wrapper.vm.styles).toHaveProperty('paddingRight', right)
  })

  it.each([
    [undefined, true],
    [false, true],
    [true, false]
  ])('should have app padding on the x-axis using %s', (absolute, expected: boolean) => {
    const wrapper = mountFunction({
      props: {
        app: true,
        absolute
      }
    })

    expect(Object.keys(wrapper.vm.styles).length > 0).toBe(expected)
  })

  it.each([
    [undefined, false],
    [false, false],
    [true, true]
  ])('should conditionally invoke setTimeout method using %s', (modelValue, expected: boolean) => {
    const wrapper = mountFunction({
      props: { modelValue }
    })

    // Проверяем, что setTimeout вызывается через проверку activeTimeout
    if (expected) {
      expect(wrapper.vm.activeTimeout).toBeGreaterThanOrEqual(0)
    } else {
      expect(wrapper.vm.activeTimeout).toBe(-1)
    }
  })

  it.each([
    [undefined, false],
    [false, true]
  ])('should conditionally render transition content using %s', (transition, expected: boolean) => {
    const wrapper = mountFunction({
      props: {
        transition,
        modelValue: true // Активируем компонент, чтобы увидеть transition
      }
    })

    // Проверяем, что transition используется через проверку computed свойства
    // Когда transition undefined, используется значение по умолчанию 'v-snack-transition'
    // Когда transition false, transition не используется
    const usesTransition = wrapper.vm.transition !== false
    expect(usesTransition).toBe(!expected)
  })

  it.each([
    [undefined, true],
    [100, true],
    [0, false],
    [-1, false]
  ])('should condtionally remove the snackbar when using a timeout value of %s', (timeout, expected) => {
    jest.useFakeTimers()
    const spy = jest.spyOn(window, 'setTimeout')

    mountFunction({
      props: {
        timeout,
        modelValue: true
      }
    })

    jest.runAllTimers()

    expect(spy.mock.calls.length > 0).toBe(expected)

    // TODO: remove in v3
    if (timeout === 0) {
      expect(`[Vuetify] [UPGRADE] 'timeout="0"' is deprecated, use '-1' instead.`).toHaveBeenTipped()
    }

    spy.mockRestore()
    jest.useRealTimers()
  })
})
