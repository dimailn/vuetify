import VTooltip from '../VTooltip'
import {
  mount,
  enableAutoUnmount,
  VueWrapper,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VTooltip', () => {
  type Instance = InstanceType<typeof VTooltip>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VTooltip, options)
    }
  })

  it('should render component with top and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
        top: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.vm.offsetX).toBeFalsy()
    expect(wrapper.vm.offsetY).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      modelValue: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with left and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
        left: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.vm.offsetX).toBeTruthy()
    expect(wrapper.vm.offsetY).toBeFalsy()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      modelValue: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with bottom and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
        bottom: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.vm.offsetX).toBeFalsy()
    expect(wrapper.vm.offsetY).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      modelValue: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with right and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
        right: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.vm.offsetX).toBeTruthy()
    expect(wrapper.vm.offsetY).toBeFalsy()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      modelValue: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom eager and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with modelValue=true and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with min/max width and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        minWidth: 100,
        maxWidth: 200,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with zIndex prop and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        zIndex: 42,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display tooltip after mouseenter and hide after mouseleave', async () => {
    jest.useFakeTimers()
    const wrapper = mountFunction({
      props: {
        openDelay: 123,
        closeDelay: 321,
      },
      slots: {
        activator: ({ on }: any) => h('span', { ...on, class: 'activator' }, 'activator'),
        default: () => h('span', { class: 'content' }, 'content'),
      },
    })

    const activator = wrapper.find('.activator')

    await activator.trigger('mouseenter')
    jest.runAllTimers()
    await wrapper.vm.$nextTick()

    // Check if tooltip became active
    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true])

    await activator.trigger('mouseleave')
    jest.runAllTimers()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([false])

    jest.useRealTimers()
  })

  it(`should work with normal activator slot`, () => {
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
      },
      slots: {
        activator: function({ on }: any) { return h('span', { ...on }, 'activator') },
        default: () => h('span', 'content'),
      },
    })

    // In Vue 3, all slots are functions and should work correctly
    expect(wrapper.html()).toContain('activator')
  })

  it(`should open and close`, () => {
    jest.useFakeTimers()
    const wrapper = mountFunction({
      props: {
        openDelay: 0,
        closeDelay: 0,
      },
      slots: {
        activator: ({ on }: any) => h('span', { ...on, class: 'activator' }, 'activator'),
        default: () => h('span', { class: 'content' }, 'content'),
      },
    })

    expect(wrapper.vm.isActive).toBeFalsy()

    wrapper.find('.activator').trigger('focus')
    jest.runAllTimers()
    expect(wrapper.vm.isActive).toBeTruthy()

    wrapper.find('.activator').trigger('blur')
    jest.runAllTimers()
    expect(wrapper.vm.isActive).toBeFalsy()

    wrapper.vm.isActive = true

    wrapper.find('.activator').trigger('keydown.esc')
    jest.runAllTimers()
    expect(wrapper.vm.isActive).toBeFalsy()

    jest.useRealTimers()
  })
})
