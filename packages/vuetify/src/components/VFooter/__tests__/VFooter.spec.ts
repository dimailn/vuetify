// Components
import VFooter from '../VFooter'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VFooter.ts', () => {
  type Instance = InstanceType<typeof VFooter>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VFooter, {
        global: {
          mocks: {
            $vuetify: {
              application: {
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

  it('should return insetFooter', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.applicationProperty).toBe('footer')

    await wrapper.setProps({ inset: true })

    expect(wrapper.vm.applicationProperty).toBe('insetFooter')
  })

  it('should return computed values when using app', async () => {
    const wrapper = mountFunction({
      props: {
        app: true,
      },
      global: {
        mocks: {
          $vuetify: {
            application: {
              footer: 0,
              bottom: 64,
              left: 300,
              right: 200,
              register: () => {},
              unregister: () => {},
            },
          },
        },
      },
    })

    expect(wrapper.vm.computedBottom).toBe(64)
    expect(wrapper.vm.computedLeft).toBe(0)
    expect(wrapper.vm.computedRight).toBe(0)

    await wrapper.setProps({ inset: true })
    expect(wrapper.vm.computedLeft).toBe(300)
    expect(wrapper.vm.computedRight).toBe(200)

    await wrapper.setProps({ height: 48 })
  })
})
