// Components
import VSystemBar from '../VSystemBar'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VSystemBar.ts', () => {
  type Instance = InstanceType<typeof VSystemBar>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSystemBar, {
        global: {
          mocks: {
            $vuetify: {
              application: {
                register: () => {},
                unregister: () => {}
              }
            }
          }
        },
        ...options
      })
    }
  })

  it('should return the correct height for numeric height', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        height: 56
      }
    })

    expect(wrapper.vm.computedHeight).toBe(56)
  })

  it('should return the correct height for string height', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        height: '48'
      }
    })

    expect(wrapper.vm.computedHeight).toBe(48)
  })

  it('should return the correct height for auto height', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        height: 'auto'
      }
    })

    expect(wrapper.vm.computedHeight).toBe('auto')
  })

  it('should return default height when height is undefined', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        height: undefined
      }
    })

    expect(wrapper.vm.computedHeight).toBe(24)
  })

  it('should return window height when window is true', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        window: true
      }
    })

    expect(wrapper.vm.computedHeight).toBe(32)
  })

  it('should render with correct classes', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        lightsOut: true,
        window: true
      }
    })

    expect(wrapper.classes()).toContain('v-system-bar--lights-out')
    expect(wrapper.classes()).toContain('v-system-bar--fixed')
    expect(wrapper.classes()).toContain('v-system-bar--window')
  })

  it('should render with correct styles', () => {
    const wrapper = mountFunction({
      props: {
        app: true,
        height: 48
      }
    })

    expect(wrapper.attributes('style')).toContain('height: 48px')
  })

  it('should render with slot content', () => {
    const wrapper = mountFunction({
      props: {
        app: true
      },
      slots: {
        default: 'System Bar Content'
      }
    })

    expect(wrapper.text()).toBe('System Bar Content')
  })
})
