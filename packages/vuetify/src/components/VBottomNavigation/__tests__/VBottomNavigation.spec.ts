// Libraries
import { h } from 'vue'

// Components
import VBottomNavigation from '../VBottomNavigation'
import VBtn from '../../VBtn/VBtn'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'

function createBtn (val = null) {
  const options = {
    attrs: {},
    props: { text: true },
  }
  if (val) options.attrs = { value: val }

  return {
    name: 'test',
    render () {
      return h(VBtn, options)
    },
  }
}

describe('VBottomNavigation.ts', () => {
  type Instance = InstanceType<typeof VBottomNavigation>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options: MountingOptions<Instance> = {}) => {
      return mount(VBottomNavigation, {
        global: {
          mocks: {
            $vuetify: {
              application: {
                bottom: 0,
                register: () => {},
                unregister: () => {},
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should be visible with a true value', async () => {
    const wrapper = mountFunction({
      props: { modelValue: true },
      slots: {
        default: [VBtn, VBtn],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.styles).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: false })

    expect(wrapper.vm.styles).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should update application when height or modelValue changes', async () => {
    const wrapper = mountFunction({
      props: {
        app: true,
      },
      slots: {
        default: [VBtn, VBtn],
      },
    })

    const updateApplication = wrapper.vm.updateApplication
    const spy = jest.fn(updateApplication)
    wrapper.vm.updateApplication = spy

    await wrapper.setProps({ height: 80 })

    expect(spy).toHaveBeenCalled()

    await wrapper.setProps({ modelValue: false })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should fire an event and activate/deactivate when reached threshold and using hideOnScroll', async () => {
    const wrapper = mountFunction({
      props: { hideOnScroll: true },
    })

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    // Scrolling down
    wrapper.vm.currentScroll = 1000
    wrapper.vm.previousScroll = 0
    wrapper.vm.isScrollingUp = false

    wrapper.vm.thresholdMet()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    expect(wrapper.vm.isActive).toBeTruthy()

    // Scrolling up
    wrapper.vm.currentScroll = 0
    wrapper.vm.previousScroll = 1000
    wrapper.vm.isScrollingUp = true

    wrapper.vm.thresholdMet()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([false])
    expect(wrapper.vm.isActive).toBeFalsy()
  })

  it('should fire change event when updated', async () => {
    const wrapper = mountFunction({
      props: {
        app: true,
      },
      slots: {
        default: () => [h(VBtn, { value: 1 }), h(VBtn, { value: 2 })],
      },
    })

    expect(wrapper.emitted('change')).toBeFalsy()

    // Simulate clicking on a button by calling the updateValue method directly
    wrapper.vm.updateValue(1)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0]).toEqual([1])
  })
})
