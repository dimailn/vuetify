// Components
import VSubheader from '../VSubheader'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'

describe('VSubheader.ts', () => {
  type Instance = InstanceType<typeof VSubheader>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSubheader, {
        ...options
      })
    }
  })

  it('should have custom class', () => {
    const wrapper = mount(VSubheader, {
      props: { class: 'foo' }
    })

    expect(wrapper.element.classList.contains('foo')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be light', () => {
    const wrapper = mountFunction({
      props: { light: true }
    })

    expect(wrapper.element.classList.contains('theme--light')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be dark', () => {
    const wrapper = mountFunction({
      props: { dark: true }
    })

    expect(wrapper.element.classList.contains('theme--dark')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be inset', () => {
    const wrapper = mountFunction({
      props: { inset: true }
    })

    expect(wrapper.element.classList.contains('v-subheader--inset')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
