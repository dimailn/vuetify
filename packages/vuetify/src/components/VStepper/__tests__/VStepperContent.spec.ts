// Components
import VStepperContent from '../VStepperContent'
import {
  VTabTransition,
  VTabReverseTransition,
} from '../../transitions'

// Utilities
import {
  mount,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { wait } from '../../../../test'

const tip = '[Vuetify] The v-stepper-content component must be used inside a v-stepper'

describe('VStepperContent.ts', () => {
  type Instance = InstanceType<typeof VStepperContent>
  let mountFunction: (options?: object) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VStepperContent, {
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
            },
          },
        },
        ...options,
      })
    }
  })

  it('should set height to auto', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: { step: 0 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    expect(wrapper.vm.isActive).toBeNull()
    expect(wrapper.vm.height).toBe(0)

    await wrapper.vm.$nextTick()
    await wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.height).toBe('auto')
  })

  it('should use reverse transition', async () => {
    const wrapper = mountFunction({
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })
    expect(wrapper.vm.computedTransition).toBe(VTabTransition)

    await wrapper.setData({ isReverse: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedTransition).toBe(VTabReverseTransition)
  })

  it('should use opposite of reverse transition in rtl', async () => {
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            rtl: true,
          },
        },
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
      props: { step: 1 },
    })
    expect(wrapper.vm.computedTransition).toBe(VTabReverseTransition)

    await wrapper.setData({ isReverse: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedTransition).toBe(VTabTransition)
  })

  it('should accept a custom height', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        step: 1,
      },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    const enter = jest.fn()
    const leave = jest.fn()
    wrapper.vm.enter = enter
    wrapper.vm.leave = leave

    await wrapper.setData({
      isActive: true,
      isVertical: true,
    })
    await wrapper.vm.$nextTick()

    const stepWrapper = wrapper.find('.v-stepper__wrapper')

    expect(stepWrapper.element.style.height).toBe('auto')

    // should call leave() -- total so far: 1
    await wrapper.setData({ isActive: false })
    await wrapper.vm.$nextTick()

    // should call enter() -- total so far: 1
    await wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()

    expect(enter).toHaveBeenCalled()
    expect(leave).toHaveBeenCalled()
    expect(enter.mock.calls).toHaveLength(1)
    expect(leave.mock.calls).toHaveLength(1)

    // setting vertical and isActive at the same time causes
    // isActive watcher to fire enter/leave methods
    await wrapper.setData({
      isVertical: false,
    })
    await wrapper.vm.$nextTick()
    await wrapper.setData({ isActive: false })
    await wrapper.vm.$nextTick()
    await wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()
    expect(enter.mock.calls).toHaveLength(1)
    expect(leave.mock.calls).toHaveLength(1)
  })

  it('should toggle isActive state', async () => {
    const wrapper = mountFunction({
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    wrapper.vm.toggle(1, false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.isReverse).toBe(false)

    wrapper.vm.toggle('1', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.isReverse).toBe(false)

    wrapper.vm.toggle(2, true)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isReverse).toBe(true)
  })

  it('should set height', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    await wrapper.setData({ isActive: false, isVertical: true })

    await wrapper.setData({ isActive: true })

    expect(wrapper.vm.height).toBe(0)

    await wait(450)

    expect(wrapper.vm.height).toBe('auto')

    await wrapper.setData({ isActive: false })

    await wait(10)

    expect(wrapper.vm.height).toBe(0)
  })

  it('should set height only if isActive', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    await wrapper.setData({ isActive: false, isVertical: true })

    await wrapper.setData({ isActive: true })

    expect(wrapper.vm.height).toBe(0)

    await wrapper.setData({ isActive: false })

    await wait(450)

    expect(wrapper.vm.height).toBe(0)
  })

  it('should reset height', async () => {
    const wrapper = mountFunction({
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
          stepper: {
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    const stepWrapper = wrapper.find('.v-stepper__wrapper')

    expect(wrapper.vm.height).toBe(0)

    expect(wrapper.vm.onTransition()).toBeUndefined()

    await wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.height).toBe('auto')

    await wrapper.setData({ height: 0 })
    await wrapper.vm.$nextTick()

    wrapper.vm.onTransition({ propertyName: 'foo' })
    expect(wrapper.vm.height).toBe(0)

    wrapper.vm.onTransition({ propertyName: 'height' })
    expect(wrapper.vm.height).toBe('auto')
  })

  it('should tip when not used with v-stepper', () => {
    const wrapper = mountFunction({
      props: { step: 1 },
      global: {
        provide: {
          isVertical: false,
        },
      },
    })

    expect(wrapper.vm).toBeDefined()

    // Ожидаем предупреждение о том, что компонент должен использоваться внутри v-stepper
    expect('[Vuetify] The v-stepper-content component must be used inside a v-stepper').toHaveBeenTipped()
  })
})
