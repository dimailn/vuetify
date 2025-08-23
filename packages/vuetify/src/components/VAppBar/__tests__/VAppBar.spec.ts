// Libraries
// Components
import VAppBar from '../VAppBar'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'
import { scrollWindow } from '../../../../test'

describe('AppBar.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VAppBar, {
        global: {
          mocks: {
            $vuetify: {
              application: {
                top: 0,
                left: 0,
                right: 0,
                bar: 0,
                register: () => {},
                unregister: () => {},
              },
              breakpoint: {
                smAndDown: false,
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render correctly', () => {
    const wrapper = mountFunction()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have correct component name', () => {
    const wrapper = mountFunction()
    expect(wrapper.vm.$options.name).toBe('v-app-bar')
  })

  it('should set isActive false when created and vertical-scroll', () => {
    const wrapper = mountFunction({
      props: {
        invertedScroll: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should render with background', () => {
    const wrapper = mountFunction({
      props: {
        src: '/test.jpg',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should work with basic props', () => {
    const wrapper = mountFunction({
      props: {
        dense: true,
        flat: true,
        floating: true,
      },
    })

    expect(wrapper.vm.dense).toBe(true)
    expect(wrapper.vm.flat).toBe(true)
    expect(wrapper.vm.floating).toBe(true)
  })

  it('should handle scroll events', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: { hideOnScroll: true, scrollThreshold: 300 },
    })

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.currentScroll).toBe(0)

    await scrollWindow(100)
    expect(wrapper.vm.currentScroll).toBe(100)

    await scrollWindow(600)
    expect(wrapper.vm.currentScroll).toBe(600)
  })

  it('should handle value prop changes', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(true)

    wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)
  })
})
